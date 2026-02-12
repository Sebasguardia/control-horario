-- Migration: Functions and Triggers
-- Description: Database functions and triggers for automation
-- Author: Antigravity
-- Date: 2026-02-12

-- ============================================================================
-- FUNCTION: handle_new_user
-- Description: Automatically create user profile when auth user is created
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Also create default preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- FUNCTION: handle_updated_at
-- Description: Automatically update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_work_sessions
  BEFORE UPDATE ON work_sessions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_projects
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_user_preferences
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================================
-- FUNCTION: calculate_net_work_minutes
-- Description: Calculate net work minutes for a session
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_net_work_minutes(session_id UUID)
RETURNS INTEGER AS $$
DECLARE
  start_t TIMESTAMP WITH TIME ZONE;
  end_t TIMESTAMP WITH TIME ZONE;
  total_breaks INTEGER;
  gross_minutes INTEGER;
BEGIN
  -- Get session data
  SELECT start_time, end_time, total_break_minutes
  INTO start_t, end_t, total_breaks
  FROM work_sessions
  WHERE id = session_id;
  
  -- If session not ended, return NULL
  IF end_t IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Calculate gross minutes
  gross_minutes := EXTRACT(EPOCH FROM (end_t - start_t)) / 60;
  
  -- Return net minutes (gross - breaks)
  RETURN gross_minutes - COALESCE(total_breaks, 0);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: update_session_break_total
-- Description: Update total_break_minutes when breaks change
-- ============================================================================
CREATE OR REPLACE FUNCTION update_session_break_total()
RETURNS TRIGGER AS $$
DECLARE
  total INTEGER;
BEGIN
  -- Calculate total break minutes for the session
  SELECT COALESCE(SUM(duration_minutes), 0)
  INTO total
  FROM breaks
  WHERE work_session_id = COALESCE(NEW.work_session_id, OLD.work_session_id);
  
  -- Update the work_session
  UPDATE work_sessions
  SET total_break_minutes = total
  WHERE id = COALESCE(NEW.work_session_id, OLD.work_session_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update break totals
CREATE TRIGGER update_break_total_on_insert
  AFTER INSERT ON breaks
  FOR EACH ROW EXECUTE FUNCTION update_session_break_total();

CREATE TRIGGER update_break_total_on_update
  AFTER UPDATE ON breaks
  FOR EACH ROW EXECUTE FUNCTION update_session_break_total();

CREATE TRIGGER update_break_total_on_delete
  AFTER DELETE ON breaks
  FOR EACH ROW EXECUTE FUNCTION update_session_break_total();

-- ============================================================================
-- FUNCTION: update_net_work_minutes
-- Description: Update net_work_minutes when session ends
-- ============================================================================
CREATE OR REPLACE FUNCTION update_net_work_minutes()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if end_time is being set or changed
  IF NEW.end_time IS NOT NULL AND (OLD.end_time IS NULL OR OLD.end_time IS DISTINCT FROM NEW.end_time) THEN
    NEW.net_work_minutes := calculate_net_work_minutes(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to calculate net minutes on session end
CREATE TRIGGER calculate_net_minutes_on_end
  BEFORE UPDATE ON work_sessions
  FOR EACH ROW EXECUTE FUNCTION update_net_work_minutes();

-- ============================================================================
-- FUNCTION: calculate_break_duration
-- Description: Calculate duration when break ends
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_break_duration()
RETURNS TRIGGER AS $$
BEGIN
  -- Only calculate if end_time is being set
  IF NEW.end_time IS NOT NULL AND (OLD.end_time IS NULL OR OLD.end_time IS DISTINCT FROM NEW.end_time) THEN
    NEW.duration_minutes := EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 60;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to calculate break duration
CREATE TRIGGER calculate_duration_on_break_end
  BEFORE UPDATE ON breaks
  FOR EACH ROW EXECUTE FUNCTION calculate_break_duration();

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON FUNCTION handle_new_user() IS 'Creates user profile and preferences when auth user is created';
COMMENT ON FUNCTION handle_updated_at() IS 'Automatically updates the updated_at timestamp';
COMMENT ON FUNCTION calculate_net_work_minutes(UUID) IS 'Calculates net work minutes for a session';
COMMENT ON FUNCTION update_session_break_total() IS 'Updates total break minutes when breaks change';
COMMENT ON FUNCTION update_net_work_minutes() IS 'Updates net work minutes when session ends';
COMMENT ON FUNCTION calculate_break_duration() IS 'Calculates break duration when break ends';

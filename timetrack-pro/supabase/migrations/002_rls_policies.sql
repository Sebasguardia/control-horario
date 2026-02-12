-- Migration: Row Level Security Policies
-- Description: Implements RLS policies to ensure data isolation between users
-- Author: Antigravity
-- Date: 2026-02-12

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE breaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLICIES FOR: users
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile (triggered on signup)
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- POLICIES FOR: work_sessions
-- ============================================================================

-- Users can view their own work sessions
CREATE POLICY "Users can view own sessions"
  ON work_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own work sessions
CREATE POLICY "Users can insert own sessions"
  ON work_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own work sessions
CREATE POLICY "Users can update own sessions"
  ON work_sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own work sessions
CREATE POLICY "Users can delete own sessions"
  ON work_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- POLICIES FOR: breaks
-- ============================================================================

-- Users can view breaks from their own sessions
CREATE POLICY "Users can view own breaks"
  ON breaks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM work_sessions
      WHERE work_sessions.id = breaks.work_session_id
      AND work_sessions.user_id = auth.uid()
    )
  );

-- Users can insert breaks into their own sessions
CREATE POLICY "Users can insert own breaks"
  ON breaks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM work_sessions
      WHERE work_sessions.id = breaks.work_session_id
      AND work_sessions.user_id = auth.uid()
    )
  );

-- Users can update their own breaks
CREATE POLICY "Users can update own breaks"
  ON breaks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM work_sessions
      WHERE work_sessions.id = breaks.work_session_id
      AND work_sessions.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM work_sessions
      WHERE work_sessions.id = breaks.work_session_id
      AND work_sessions.user_id = auth.uid()
    )
  );

-- Users can delete their own breaks
CREATE POLICY "Users can delete own breaks"
  ON breaks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM work_sessions
      WHERE work_sessions.id = breaks.work_session_id
      AND work_sessions.user_id = auth.uid()
    )
  );

-- ============================================================================
-- POLICIES FOR: projects
-- ============================================================================

-- Users can view their own projects
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own projects
CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own projects
CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- POLICIES FOR: user_preferences
-- ============================================================================

-- Users can view their own preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own preferences
CREATE POLICY "Users can delete own preferences"
  ON user_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON POLICY "Users can view own profile" ON users IS 'Allow users to view their own profile';
COMMENT ON POLICY "Users can view own sessions" ON work_sessions IS 'Allow users to view only their own work sessions';
COMMENT ON POLICY "Users can view own breaks" ON breaks IS 'Allow users to view breaks from their own sessions';
COMMENT ON POLICY "Users can view own projects" ON projects IS 'Allow users to view only their own projects';
COMMENT ON POLICY "Users can view own preferences" ON user_preferences IS 'Allow users to view their own preferences';

-- Migration: Views for Reporting
-- Description: Database views for analytics and reporting
-- Author: Antigravity
-- Date: 2026-02-12

-- ============================================================================
-- VIEW: v_sessions_summary
-- Description: Complete session information with project and break details
-- ============================================================================
CREATE OR REPLACE VIEW v_sessions_summary AS
SELECT 
  ws.id,
  ws.user_id,
  ws.start_time,
  ws.end_time,
  ws.total_break_minutes,
  ws.net_work_minutes,
  ws.notes,
  ws.location_lat,
  ws.location_lng,
  ws.created_at,
  ws.updated_at,
  p.id as project_id,
  p.name as project_name,
  p.color as project_color,
  COUNT(b.id) as break_count,
  -- Calculate if session is currently active
  CASE WHEN ws.end_time IS NULL THEN true ELSE false END as is_active,
  -- Calculate gross minutes
  CASE 
    WHEN ws.end_time IS NOT NULL THEN 
      EXTRACT(EPOCH FROM (ws.end_time - ws.start_time)) / 60
    ELSE 
      EXTRACT(EPOCH FROM (NOW() - ws.start_time)) / 60
  END as gross_minutes,
  -- Extract date for grouping
  DATE(ws.start_time) as session_date
FROM work_sessions ws
LEFT JOIN projects p ON ws.project_id = p.id
LEFT JOIN breaks b ON b.work_session_id = ws.id
GROUP BY ws.id, p.id, p.name, p.color;

-- ============================================================================
-- VIEW: v_daily_stats
-- Description: Daily statistics per user
-- ============================================================================
CREATE OR REPLACE VIEW v_daily_stats AS
SELECT 
  user_id,
  DATE(start_time) as work_date,
  COUNT(*) as session_count,
  SUM(COALESCE(net_work_minutes, 0)) as total_work_minutes,
  SUM(COALESCE(total_break_minutes, 0)) as total_break_minutes,
  MIN(start_time) as first_start,
  MAX(end_time) as last_end,
  -- Calculate if user met expected hours
  CASE 
    WHEN SUM(COALESCE(net_work_minutes, 0)) >= (
      SELECT expected_hours_per_day * 60 
      FROM users u 
      WHERE u.id = work_sessions.user_id
    ) THEN true 
    ELSE false 
  END as met_expected_hours
FROM work_sessions
WHERE end_time IS NOT NULL
GROUP BY user_id, DATE(start_time);

-- ============================================================================
-- VIEW: v_weekly_stats
-- Description: Weekly statistics per user
-- ============================================================================
CREATE OR REPLACE VIEW v_weekly_stats AS
SELECT 
  user_id,
  DATE_TRUNC('week', start_time)::DATE as week_start,
  COUNT(DISTINCT DATE(start_time)) as days_worked,
  COUNT(*) as total_sessions,
  SUM(COALESCE(net_work_minutes, 0)) as total_work_minutes,
  SUM(COALESCE(total_break_minutes, 0)) as total_break_minutes,
  AVG(COALESCE(net_work_minutes, 0)) as avg_minutes_per_session,
  -- Calculate average per working day
  SUM(COALESCE(net_work_minutes, 0)) / NULLIF(COUNT(DISTINCT DATE(start_time)), 0) as avg_minutes_per_day,
  -- Calculate total hours
  ROUND(SUM(COALESCE(net_work_minutes, 0)) / 60.0, 2) as total_hours
FROM work_sessions
WHERE end_time IS NOT NULL
GROUP BY user_id, DATE_TRUNC('week', start_time);

-- ============================================================================
-- VIEW: v_monthly_stats
-- Description: Monthly statistics per user
-- ============================================================================
CREATE OR REPLACE VIEW v_monthly_stats AS
SELECT 
  user_id,
  DATE_TRUNC('month', start_time)::DATE as month_start,
  EXTRACT(YEAR FROM start_time)::INTEGER as year,
  EXTRACT(MONTH FROM start_time)::INTEGER as month,
  COUNT(DISTINCT DATE(start_time)) as days_worked,
  COUNT(*) as total_sessions,
  SUM(COALESCE(net_work_minutes, 0)) as total_work_minutes,
  SUM(COALESCE(total_break_minutes, 0)) as total_break_minutes,
  AVG(COALESCE(net_work_minutes, 0)) as avg_minutes_per_session,
  SUM(COALESCE(net_work_minutes, 0)) / NULLIF(COUNT(DISTINCT DATE(start_time)), 0) as avg_minutes_per_day,
  ROUND(SUM(COALESCE(net_work_minutes, 0)) / 60.0, 2) as total_hours
FROM work_sessions
WHERE end_time IS NOT NULL
GROUP BY user_id, DATE_TRUNC('month', start_time), EXTRACT(YEAR FROM start_time), EXTRACT(MONTH FROM start_time);

-- ============================================================================
-- VIEW: v_project_stats
-- Description: Statistics grouped by project
-- ============================================================================
CREATE OR REPLACE VIEW v_project_stats AS
SELECT 
  p.id as project_id,
  p.user_id,
  p.name as project_name,
  p.color as project_color,
  p.is_active,
  COUNT(ws.id) as session_count,
  SUM(COALESCE(ws.net_work_minutes, 0)) as total_work_minutes,
  ROUND(SUM(COALESCE(ws.net_work_minutes, 0)) / 60.0, 2) as total_hours,
  MIN(ws.start_time) as first_session,
  MAX(ws.end_time) as last_session
FROM projects p
LEFT JOIN work_sessions ws ON ws.project_id = p.id AND ws.end_time IS NOT NULL
GROUP BY p.id, p.user_id, p.name, p.color, p.is_active;

-- ============================================================================
-- VIEW: v_break_analysis
-- Description: Break patterns and statistics
-- ============================================================================
CREATE OR REPLACE VIEW v_break_analysis AS
SELECT 
  b.work_session_id,
  ws.user_id,
  DATE(ws.start_time) as session_date,
  b.break_type,
  COUNT(*) as break_count,
  SUM(COALESCE(b.duration_minutes, 0)) as total_duration,
  AVG(COALESCE(b.duration_minutes, 0)) as avg_duration,
  MIN(b.duration_minutes) as min_duration,
  MAX(b.duration_minutes) as max_duration
FROM breaks b
JOIN work_sessions ws ON ws.id = b.work_session_id
WHERE b.end_time IS NOT NULL
GROUP BY b.work_session_id, ws.user_id, DATE(ws.start_time), b.break_type;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON VIEW v_sessions_summary IS 'Complete session information with project and break details';
COMMENT ON VIEW v_daily_stats IS 'Daily work statistics per user';
COMMENT ON VIEW v_weekly_stats IS 'Weekly work statistics per user';
COMMENT ON VIEW v_monthly_stats IS 'Monthly work statistics per user';
COMMENT ON VIEW v_project_stats IS 'Statistics grouped by project';
COMMENT ON VIEW v_break_analysis IS 'Break patterns and statistics';

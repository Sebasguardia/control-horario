-- Migration: Initial Schema for TimeTrack Pro
-- Description: Creates all tables for the time tracking system
-- Author: Antigravity
-- Date: 2026-02-12

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: users
-- Description: Extended user profiles linked to Supabase Auth
-- ============================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  expected_hours_per_day DECIMAL(4,2) DEFAULT 8.00,
  timezone TEXT DEFAULT 'America/Lima',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX idx_users_email ON users(email);

-- ============================================================================
-- TABLE: work_sessions
-- Description: Records of work sessions/shifts
-- ============================================================================
CREATE TABLE work_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  total_break_minutes INTEGER DEFAULT 0,
  net_work_minutes INTEGER,
  notes TEXT,
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  project_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_work_sessions_user_id ON work_sessions(user_id);
CREATE INDEX idx_work_sessions_start_time ON work_sessions(start_time);
CREATE INDEX idx_work_sessions_user_date ON work_sessions(user_id, start_time);

-- ============================================================================
-- TABLE: breaks
-- Description: Break periods during work sessions
-- ============================================================================
CREATE TABLE breaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_session_id UUID REFERENCES work_sessions(id) ON DELETE CASCADE NOT NULL,
  break_type TEXT NOT NULL CHECK (break_type IN ('lunch', 'short', 'personal')),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster session lookups
CREATE INDEX idx_breaks_session_id ON breaks(work_session_id);

-- ============================================================================
-- TABLE: projects
-- Description: Projects that can be associated with work sessions
-- ============================================================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#166534',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for user projects
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_user_active ON projects(user_id, is_active);

-- Add foreign key constraint for work_sessions.project_id
ALTER TABLE work_sessions 
  ADD CONSTRAINT fk_work_sessions_project 
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;

-- ============================================================================
-- TABLE: user_preferences
-- Description: User preferences and settings
-- ============================================================================
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  break_reminders BOOLEAN DEFAULT TRUE,
  overtime_alerts BOOLEAN DEFAULT TRUE,
  language TEXT DEFAULT 'es',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for user preferences lookup
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE users IS 'Extended user profiles linked to Supabase Auth';
COMMENT ON TABLE work_sessions IS 'Records of work sessions with start/end times';
COMMENT ON TABLE breaks IS 'Break periods during work sessions';
COMMENT ON TABLE projects IS 'Projects that can be associated with work sessions';
COMMENT ON TABLE user_preferences IS 'User preferences and application settings';

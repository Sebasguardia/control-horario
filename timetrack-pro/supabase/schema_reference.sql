-- ============================================================================
-- TimeTrack Pro - Schema Reference (mirrors 001_initial_schema.sql)
-- Updated: 2026-02-19
-- ============================================================================

-- 1. PROFILES TABLE (extends auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    gender TEXT DEFAULT 'No especificado',
    city TEXT,
    position TEXT,
    department TEXT,
    expected_hours_per_day INTEGER DEFAULT 8,
    timezone TEXT DEFAULT 'America/Lima',
    schedule_start TIME DEFAULT '08:00',
    schedule_end TIME DEFAULT '17:00',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. PROJECTS TABLE
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#166534',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. WORK SESSIONS TABLE
CREATE TABLE public.work_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    total_break_minutes INTEGER DEFAULT 0,
    net_work_minutes INTEGER,
    notes TEXT,
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'break')),
    weather_condition TEXT,
    temperature DOUBLE PRECISION,
    is_holiday BOOLEAN DEFAULT FALSE,
    holiday_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. BREAKS TABLE
CREATE TABLE public.breaks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    work_session_id UUID REFERENCES public.work_sessions(id) ON DELETE CASCADE NOT NULL,
    break_type TEXT NOT NULL CHECK (break_type IN ('lunch', 'short', 'personal')),
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. USER PREFERENCES TABLE
CREATE TABLE public.user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    notifications_enabled BOOLEAN DEFAULT TRUE,
    break_reminders BOOLEAN DEFAULT TRUE,
    overtime_alerts BOOLEAN DEFAULT TRUE,
    exit_reminder BOOLEAN DEFAULT TRUE,
    language TEXT DEFAULT 'es',
    work_days_per_week INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- RLS (all tables have RLS enabled with per-operation policies)
-- See full policies in: supabase/migrations/001_initial_schema.sql
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

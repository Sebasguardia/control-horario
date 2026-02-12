-- ============================================================================
-- TimeTrack Pro - Complete Database Schema
-- Migration: 001_initial_schema.sql
-- Generated: 2026-02-12
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. PROFILES TABLE (extends auth.users)
-- ============================================================================
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

-- Indexes
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- ============================================================================
-- 2. PROJECTS TABLE
-- ============================================================================
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

-- Indexes
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_active ON public.projects(user_id, is_active);

-- ============================================================================
-- 3. WORK SESSIONS TABLE
-- ============================================================================
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
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_work_sessions_user_id ON public.work_sessions(user_id);
CREATE INDEX idx_work_sessions_user_date ON public.work_sessions(user_id, start_time DESC);
CREATE INDEX idx_work_sessions_status ON public.work_sessions(user_id, status);
CREATE INDEX idx_work_sessions_project ON public.work_sessions(project_id);

-- ============================================================================
-- 4. BREAKS TABLE
-- ============================================================================
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

-- Indexes
CREATE INDEX idx_breaks_session ON public.breaks(work_session_id);

-- ============================================================================
-- 5. USER PREFERENCES TABLE
-- ============================================================================
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

-- Indexes
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);

-- ============================================================================
-- 6. FUNCTIONS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-create profile and preferences on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 
            'https://api.dicebear.com/7.x/initials/svg?seed=' || 
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email) ||
            '&backgroundColor=166534&textColor=ffffff')
    );
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate break duration when break ends
CREATE OR REPLACE FUNCTION public.handle_break_end()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.end_time IS NOT NULL AND OLD.end_time IS NULL THEN
        NEW.duration_minutes = EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 60;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update session break totals when a break is completed
CREATE OR REPLACE FUNCTION public.handle_break_completed()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.end_time IS NOT NULL AND OLD.end_time IS NULL THEN
        UPDATE public.work_sessions
        SET total_break_minutes = (
            SELECT COALESCE(SUM(duration_minutes), 0)
            FROM public.breaks
            WHERE work_session_id = NEW.work_session_id
            AND end_time IS NOT NULL
        )
        WHERE id = NEW.work_session_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate net work minutes when session ends
CREATE OR REPLACE FUNCTION public.handle_session_end()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.end_time IS NOT NULL AND OLD.end_time IS NULL THEN
        NEW.net_work_minutes = EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 60 - COALESCE(NEW.total_break_minutes, 0);
        NEW.status = 'completed';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. TRIGGERS
-- ============================================================================

-- updated_at triggers
CREATE TRIGGER on_profiles_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_projects_updated
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_work_sessions_updated
    BEFORE UPDATE ON public.work_sessions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_user_preferences_updated
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- New user trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Break calculation triggers
CREATE TRIGGER on_break_end
    BEFORE UPDATE ON public.breaks
    FOR EACH ROW EXECUTE FUNCTION public.handle_break_end();

CREATE TRIGGER on_break_completed
    AFTER UPDATE ON public.breaks
    FOR EACH ROW EXECUTE FUNCTION public.handle_break_completed();

-- Session end trigger
CREATE TRIGGER on_session_end
    BEFORE UPDATE ON public.work_sessions
    FOR EACH ROW EXECUTE FUNCTION public.handle_session_end();

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- PROJECTS policies
CREATE POLICY "Users can view own projects"
    ON public.projects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
    ON public.projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
    ON public.projects FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
    ON public.projects FOR DELETE
    USING (auth.uid() = user_id);

-- WORK SESSIONS policies
CREATE POLICY "Users can view own sessions"
    ON public.work_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions"
    ON public.work_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
    ON public.work_sessions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
    ON public.work_sessions FOR DELETE
    USING (auth.uid() = user_id);

-- BREAKS policies (via session ownership)
CREATE POLICY "Users can view own breaks"
    ON public.breaks FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.work_sessions ws
            WHERE ws.id = work_session_id AND ws.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create breaks on own sessions"
    ON public.breaks FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.work_sessions ws
            WHERE ws.id = work_session_id AND ws.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own breaks"
    ON public.breaks FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.work_sessions ws
            WHERE ws.id = work_session_id AND ws.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own breaks"
    ON public.breaks FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.work_sessions ws
            WHERE ws.id = work_session_id AND ws.user_id = auth.uid()
        )
    );

-- USER PREFERENCES policies
CREATE POLICY "Users can view own preferences"
    ON public.user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own preferences"
    ON public.user_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
    ON public.user_preferences FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

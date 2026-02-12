-- REFERENCE SCHEMA BASED ON MOCK DATA
-- Use this as a guide to create your tables in Supabase

-- 1. Users table (usually handled by Supabase Auth, but you might want a 'profiles' table)
-- Profiles table to store extra user info
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    expected_hours_per_day INTEGER DEFAULT 8,
    timezone TEXT DEFAULT 'America/Lima',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Sessions table
CREATE TABLE sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    total_minutes INTEGER, -- Can be calculated
    break_minutes INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('active', 'completed', 'paused', 'break')) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Breaks table (optional, if you want to track each break detail)
CREATE TABLE breaks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES sessions ON DELETE CASCADE NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    type TEXT, -- 'Almuerzo', 'Descanso', etc.
    duration_minutes INTEGER
);

-- 4. Projects table
CREATE TABLE projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#166534',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Example View for Dashboard Stats
-- CREATE VIEW user_stats AS ...

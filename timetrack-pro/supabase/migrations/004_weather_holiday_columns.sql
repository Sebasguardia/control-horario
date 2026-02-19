-- ============================================================================
-- Migration 004: Add weather and holiday context columns to work_sessions
-- Sprint 1 - Activity 3: Parallel API Integration
-- Date: 2026-02-19
-- ============================================================================
-- These columns store contextual data fetched from external APIs
-- (OpenWeatherMap + Nager.Date) when a session starts.
-- All columns are nullable to ensure backward compatibility.
-- Existing sessions and RLS policies are NOT affected.
-- ============================================================================

ALTER TABLE public.work_sessions
  ADD COLUMN IF NOT EXISTS weather_condition TEXT,
  ADD COLUMN IF NOT EXISTS temperature DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS is_holiday BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS holiday_name TEXT;

-- Add a comment for documentation
COMMENT ON COLUMN public.work_sessions.weather_condition IS 'Weather description at session start (e.g. "Clear", "Rain")';
COMMENT ON COLUMN public.work_sessions.temperature IS 'Temperature in Celsius at session start';
COMMENT ON COLUMN public.work_sessions.is_holiday IS 'Whether the session date is a public holiday';
COMMENT ON COLUMN public.work_sessions.holiday_name IS 'Name of the public holiday, if applicable';

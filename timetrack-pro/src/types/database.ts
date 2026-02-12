export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    expected_hours_per_day: number
                    timezone: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    expected_hours_per_day?: number
                    timezone?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    expected_hours_per_day?: number
                    timezone?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            work_sessions: {
                Row: {
                    id: string
                    user_id: string
                    start_time: string
                    end_time: string | null
                    total_break_minutes: number
                    net_work_minutes: number | null
                    notes: string | null
                    location_lat: number | null
                    location_lng: number | null
                    project_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    start_time: string
                    end_time?: string | null
                    total_break_minutes?: number
                    net_work_minutes?: number | null
                    notes?: string | null
                    location_lat?: number | null
                    location_lng?: number | null
                    project_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    start_time?: string
                    end_time?: string | null
                    total_break_minutes?: number
                    net_work_minutes?: number | null
                    notes?: string | null
                    location_lat?: number | null
                    location_lng?: number | null
                    project_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            breaks: {
                Row: {
                    id: string
                    work_session_id: string
                    break_type: 'lunch' | 'short' | 'personal'
                    start_time: string
                    end_time: string | null
                    duration_minutes: number | null
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    work_session_id: string
                    break_type: 'lunch' | 'short' | 'personal'
                    start_time: string
                    end_time?: string | null
                    duration_minutes?: number | null
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    work_session_id?: string
                    break_type?: 'lunch' | 'short' | 'personal'
                    start_time?: string
                    end_time?: string | null
                    duration_minutes?: number | null
                    notes?: string | null
                    created_at?: string
                }
            }
            projects: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    description: string | null
                    color: string
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    description?: string | null
                    color?: string
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    description?: string | null
                    color?: string
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            user_preferences: {
                Row: {
                    id: string
                    user_id: string
                    theme: 'light' | 'dark' | 'system'
                    notifications_enabled: boolean
                    break_reminders: boolean
                    overtime_alerts: boolean
                    language: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    theme?: 'light' | 'dark' | 'system'
                    notifications_enabled?: boolean
                    break_reminders?: boolean
                    overtime_alerts?: boolean
                    language?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    theme?: 'light' | 'dark' | 'system'
                    notifications_enabled?: boolean
                    break_reminders?: boolean
                    overtime_alerts?: boolean
                    language?: string
                    created_at?: string
                    updated_at?: string
                }
            }
        }
        Views: {
            v_sessions_summary: {
                Row: {
                    id: string
                    user_id: string
                    start_time: string
                    end_time: string | null
                    total_break_minutes: number
                    net_work_minutes: number | null
                    notes: string | null
                    location_lat: number | null
                    location_lng: number | null
                    created_at: string
                    updated_at: string
                    project_id: string | null
                    project_name: string | null
                    project_color: string | null
                    break_count: number
                    is_active: boolean
                    gross_minutes: number
                    session_date: string
                }
            }
            v_daily_stats: {
                Row: {
                    user_id: string
                    work_date: string
                    session_count: number
                    total_work_minutes: number
                    total_break_minutes: number
                    first_start: string
                    last_end: string | null
                    met_expected_hours: boolean
                }
            }
            v_weekly_stats: {
                Row: {
                    user_id: string
                    week_start: string
                    days_worked: number
                    total_sessions: number
                    total_work_minutes: number
                    total_break_minutes: number
                    avg_minutes_per_session: number
                    avg_minutes_per_day: number
                    total_hours: number
                }
            }
            v_monthly_stats: {
                Row: {
                    user_id: string
                    month_start: string
                    year: number
                    month: number
                    days_worked: number
                    total_sessions: number
                    total_work_minutes: number
                    total_break_minutes: number
                    avg_minutes_per_session: number
                    avg_minutes_per_day: number
                    total_hours: number
                }
            }
            v_project_stats: {
                Row: {
                    project_id: string
                    user_id: string
                    project_name: string
                    project_color: string
                    is_active: boolean
                    session_count: number
                    total_work_minutes: number
                    total_hours: number
                    first_session: string | null
                    last_session: string | null
                }
            }
        }
        Functions: {
            calculate_net_work_minutes: {
                Args: { session_id: string }
                Returns: number
            }
        }
    }
}


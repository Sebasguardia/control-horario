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
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    gender: string | null
                    city: string | null
                    position: string | null
                    department: string | null
                    expected_hours_per_day: number
                    timezone: string
                    schedule_start: string
                    schedule_end: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    gender?: string | null
                    city?: string | null
                    position?: string | null
                    department?: string | null
                    expected_hours_per_day?: number
                    timezone?: string
                    schedule_start?: string
                    schedule_end?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    gender?: string | null
                    city?: string | null
                    position?: string | null
                    department?: string | null
                    expected_hours_per_day?: number
                    timezone?: string
                    schedule_start?: string
                    schedule_end?: string
                    updated_at?: string
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
                    updated_at?: string
                }
            }
            work_sessions: {
                Row: {
                    id: string
                    user_id: string
                    project_id: string | null
                    start_time: string
                    end_time: string | null
                    total_break_minutes: number
                    net_work_minutes: number | null
                    notes: string | null
                    location_lat: number | null
                    location_lng: number | null
                    status: 'active' | 'completed' | 'paused' | 'break'
                    weather_condition: string | null
                    temperature: number | null
                    is_holiday: boolean
                    holiday_name: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    project_id?: string | null
                    start_time?: string
                    end_time?: string | null
                    total_break_minutes?: number
                    net_work_minutes?: number | null
                    notes?: string | null
                    location_lat?: number | null
                    location_lng?: number | null
                    status?: 'active' | 'completed' | 'paused' | 'break'
                    weather_condition?: string | null
                    temperature?: number | null
                    is_holiday?: boolean
                    holiday_name?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    project_id?: string | null
                    start_time?: string
                    end_time?: string | null
                    total_break_minutes?: number
                    net_work_minutes?: number | null
                    notes?: string | null
                    location_lat?: number | null
                    location_lng?: number | null
                    status?: 'active' | 'completed' | 'paused' | 'break'
                    weather_condition?: string | null
                    temperature?: number | null
                    is_holiday?: boolean
                    holiday_name?: string | null
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
                    start_time?: string
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
                    exit_reminder: boolean
                    language: string
                    work_days_per_week: number
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
                    exit_reminder?: boolean
                    language?: string
                    work_days_per_week?: number
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
                    exit_reminder?: boolean
                    language?: string
                    work_days_per_week?: number
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}

// Helper types for common usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type UserRole = 'admin' | 'user';

export interface User {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    gender: string | null;
    city: string | null;
    position: string | null;
    department: string | null;
    expected_hours_per_day: number;
    timezone: string;
    schedule_start: string;
    schedule_end: string;
    created_at: string;
    updated_at: string;
}

export interface WorkSession {
    id: string;
    user_id: string;
    start_time: string;
    end_time: string | null;
    total_break_minutes: number;
    net_work_minutes: number | null;
    notes: string | null;
    location_lat?: number;
    location_lng?: number;
    project_id?: string;
    status: 'active' | 'completed' | 'paused' | 'break';
    created_at: string;
    updated_at: string;
}

export type BreakType = 'lunch' | 'short' | 'personal';

export interface Break {
    id: string;
    work_session_id: string;
    break_type: BreakType;
    start_time: string;
    end_time: string | null;
    duration_minutes: number | null;
    notes: string | null;
    created_at: string;
}

export interface Project {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    color: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface UserPreferences {
    id: string;
    user_id: string;
    theme: 'light' | 'dark' | 'system';
    notifications_enabled: boolean;
    break_reminders: boolean;
    overtime_alerts: boolean;
    language: string;
    created_at: string;
    updated_at: string;
}

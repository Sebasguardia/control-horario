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
                    id?: string
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
            // Add other tables here based on schema
        }
    }
}

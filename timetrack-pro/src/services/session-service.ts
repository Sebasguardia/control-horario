import { createClient } from '@/lib/supabase/client';
import { WorkSession, Break } from '@/types/models';

const supabase = createClient();

export const SessionService = {
    async startSession(userId: string): Promise<WorkSession | null> {
        const { data, error } = await supabase
            .from('work_sessions')
            .insert({ user_id: userId, start_time: new Date().toISOString() })
            .select()
            .single();

        if (error) {
            console.error('Error starting session:', error);
            return null;
        }
        return data;
    },

    async endSession(sessionId: string): Promise<WorkSession | null> {
        const { data, error } = await supabase
            .from('work_sessions')
            .update({ end_time: new Date().toISOString() })
            .eq('id', sessionId)
            .select()
            .single();

        if (error) {
            console.error('Error ending session:', error);
            return null;
        }
        return data;
    },

    async getRecentSessions(userId: string, limit = 5): Promise<WorkSession[]> {
        const { data, error } = await supabase
            .from('work_sessions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching sessions:', error);
            return [];
        }
        return data || [];
    },

    // Add break management methods here
};

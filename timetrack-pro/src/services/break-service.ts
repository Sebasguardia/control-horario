import { getSupabaseClient } from '@/lib/supabase/client';
import { Break } from '@/types/models';

export const BreakService = {
    async startBreak(sessionId: string, type: Break['break_type']): Promise<Break | null> {
        const supabase = getSupabaseClient();

        // Update session status to 'break'
        await (supabase as any)
            .from('work_sessions')
            .update({ status: 'break' } as any)
            .eq('id', sessionId);

        const { data, error } = await (supabase as any)
            .from('breaks')
            .insert({
                work_session_id: sessionId,
                break_type: type,
                start_time: new Date().toISOString(),
            } as any)
            .select()
            .single();

        if (error) {
            console.error('Error starting break:', JSON.stringify(error, null, 2));
            return null;
        }
        return data as Break;
    },

    async endBreak(breakId: string, sessionId: string): Promise<Break | null> {
        const supabase = getSupabaseClient();

        const { data, error } = await (supabase as any)
            .from('breaks')
            .update({ end_time: new Date().toISOString() } as any)
            .eq('id', breakId)
            .select()
            .single();

        if (error) {
            console.error('Error ending break:', error);
            return null;
        }

        // Update session status back to 'active'
        await (supabase as any)
            .from('work_sessions')
            .update({ status: 'active' } as any)
            .eq('id', sessionId);

        return data as Break;
    },

    async getBreaksBySession(sessionId: string): Promise<Break[]> {
        const supabase = getSupabaseClient();
        const { data, error } = await (supabase as any)
            .from('breaks')
            .select('*')
            .eq('work_session_id', sessionId)
            .order('start_time', { ascending: true });

        if (error) {
            console.error('Error fetching breaks:', error);
            return [];
        }
        return (data || []) as Break[];
    },

    async getActiveBreak(sessionId: string): Promise<Break | null> {
        const supabase = getSupabaseClient();
        const { data, error } = await (supabase as any)
            .from('breaks')
            .select('*')
            .eq('work_session_id', sessionId)
            .is('end_time', null)
            .order('start_time', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error('Error fetching active break:', error);
            return null;
        }
        return data as Break | null;
    },
};

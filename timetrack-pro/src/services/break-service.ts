import { supabase } from '@/lib/supabase/client';
import { Break } from '@/types/models';

export const BreakService = {
    async startBreak(sessionId: string, type: Break['break_type']): Promise<Break | null> {
        const { data, error } = await supabase
            .from('breaks')
            .insert({
                work_session_id: sessionId,
                break_type: type,
                start_time: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error('Error starting break:', error);
            return null;
        }
        return data;
    },

    async endBreak(breakId: string): Promise<Break | null> {
        const { data, error } = await supabase
            .from('breaks')
            .update({
                end_time: new Date().toISOString(),
                // duration_minutes would typically be calculated by DB trigger or here
            })
            .eq('id', breakId)
            .select()
            .single();

        if (error) {
            console.error('Error ending break:', error);
            return null;
        }
        return data;
    },
};

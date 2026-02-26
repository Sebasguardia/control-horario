import { getSupabaseClient } from '@/lib/supabase/client';
import { WorkSession } from '@/types/models';
import { EnrichmentData } from './context-enrichment-service';

export const SessionService = {
    async startSession(userId: string, enrichment?: EnrichmentData): Promise<WorkSession | null> {
        const supabase = getSupabaseClient();
        const baseData: any = {
            user_id: userId,
            start_time: new Date().toISOString(),
        };

        const insertData: any = enrichment
            ? {
                ...baseData,
                weather_condition: enrichment.weather_condition,
                temperature: enrichment.temperature,
                is_holiday: enrichment.is_holiday,
                holiday_name: enrichment.holiday_name,
            }
            : baseData;

        let { data, error } = await (supabase as any)
            .from('work_sessions')
            .insert(insertData)
            .select()
            .single();

        // Fallback: if insert fails with enrichment (e.g. migration not yet applied),
        // retry without enrichment columns to ensure session is always created
        if (error && enrichment) {
            console.warn('[SessionService] Insert with enrichment failed, retrying without:', error.message || error);
            ({ data, error } = await (supabase as any)
                .from('work_sessions')
                .insert(baseData)
                .select()
                .single());
        }

        if (error) {
            console.error('Error starting session:', error);
            return null;
        }
        return data as WorkSession;
    },

    async endSession(sessionId: string, notes?: string): Promise<WorkSession | null> {
        const supabase = getSupabaseClient();
        const endTime = new Date();
        const endTimeStr = endTime.toISOString();

        // 0. Close any active breaks first to ensure time is captured
        await (supabase as any)
            .from('breaks')
            .update({ end_time: endTimeStr } as any)
            .eq('work_session_id', sessionId)
            .is('end_time', null);

        // 1. Fetch session to get start_time
        const { data: session, error: fetchError } = await (supabase as any)
            .from('work_sessions')
            .select('start_time, breaks(*)')
            .eq('id', sessionId)
            .single();

        if (fetchError || !session) {
            console.error('Error fetching session details for calculation:', fetchError);
            return null;
        }

        // 2. Calculate totals
        const startTime = new Date(session.start_time);
        const breaks = session.breaks || [];

        let totalBreakMs = 0;
        breaks.forEach((b: any) => {
            if (b.start_time && b.end_time) {
                totalBreakMs += new Date(b.end_time).getTime() - new Date(b.start_time).getTime();
            }
        });

        const totalDurationMs = endTime.getTime() - startTime.getTime();
        const netWorkMs = totalDurationMs - totalBreakMs;

        const totalBreakMinutes = Math.floor(totalBreakMs / 1000 / 60);
        const netWorkMinutes = Math.floor(netWorkMs / 1000 / 60);

        const updateData: any = {
            end_time: endTimeStr,
            status: 'completed',
            total_break_minutes: totalBreakMinutes,
            net_work_minutes: netWorkMinutes
        };
        if (notes) updateData.notes = notes;

        const { data, error } = await (supabase as any)
            .from('work_sessions')
            .update(updateData)
            .eq('id', sessionId)
            .select()
            .single();

        if (error) {
            console.error('Error ending session:', error);
            return null;
        }
        return data as WorkSession;
    },

    async updateSessionStatus(sessionId: string, status: string): Promise<void> {
        const supabase = getSupabaseClient();
        await (supabase as any)
            .from('work_sessions')
            .update({ status } as any)
            .eq('id', sessionId);
    },

    async getActiveSession(userId: string): Promise<WorkSession | null> {
        const supabase = getSupabaseClient();
        const { data, error } = await (supabase as any)
            .from('work_sessions')
            .select('*')
            .eq('user_id', userId)
            .in('status', ['active', 'paused', 'break'])
            .order('start_time', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error('Error fetching active session:', error);
            return null;
        }
        return data as WorkSession | null;
    },

    async getRecentSessions(userId: string, limit = 10): Promise<WorkSession[]> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('work_sessions')
            .select('*')
            .eq('user_id', userId)
            .order('start_time', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching sessions:', error);
            return [];
        }
        return (data || []) as WorkSession[];
    },

    async getSessionsByDateRange(userId: string, startDate: string, endDate: string): Promise<WorkSession[]> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('work_sessions')
            .select('*')
            .eq('user_id', userId)
            .gte('start_time', startDate)
            .lte('start_time', endDate)
            .order('start_time', { ascending: false });

        if (error) {
            console.error('Error fetching sessions by date range:', error);
            return [];
        }
        return (data || []) as WorkSession[];
    },

    async deleteSession(sessionId: string): Promise<boolean> {
        const supabase = getSupabaseClient();
        const { error } = await supabase
            .from('work_sessions')
            .delete()
            .eq('id', sessionId);

        if (error) {
            console.error('Error deleting session:', error);
            return false;
        }
        return true;
    },
};

import { getSupabaseClient } from '@/lib/supabase/client';

export interface ReportData {
    totalHours: number;
    totalMinutes: number;
    totalSessions: number;
    avgDailyHours: number;
    totalBreakMinutes: number;
    sessionsPerDay: { date: string; totalMinutes: number; breakMinutes: number; sessions: number }[];
}

export const ReportService = {
    async getReportByDateRange(userId: string, startDate: string, endDate: string): Promise<ReportData> {
        const supabase = getSupabaseClient();

        const { data: sessions, error } = await supabase
            .from('work_sessions')
            .select('*')
            .eq('user_id', userId)
            .gte('start_time', startDate)
            .lte('start_time', endDate)
            .eq('status', 'completed')
            .order('start_time', { ascending: true });

        if (error || !sessions || sessions.length === 0) {
            return {
                totalHours: 0,
                totalMinutes: 0,
                totalSessions: 0,
                avgDailyHours: 0,
                totalBreakMinutes: 0,
                sessionsPerDay: [],
            };
        }

        // Group sessions by day
        const dailyMap = new Map<string, { totalMinutes: number; breakMinutes: number; sessions: number }>();
        let totalMinutes = 0;
        let totalBreakMinutes = 0;

        sessions.forEach((s: any) => {
            const date = new Date(s.start_time).toISOString().split('T')[0];
            const netMin = s.net_work_minutes || 0;
            const breakMin = s.total_break_minutes || 0;

            totalMinutes += netMin;
            totalBreakMinutes += breakMin;

            const existing = dailyMap.get(date) || { totalMinutes: 0, breakMinutes: 0, sessions: 0 };
            dailyMap.set(date, {
                totalMinutes: existing.totalMinutes + netMin,
                breakMinutes: existing.breakMinutes + breakMin,
                sessions: existing.sessions + 1,
            });
        });

        const sessionsPerDay = Array.from(dailyMap.entries()).map(([date, data]) => ({
            date,
            ...data,
        }));

        const uniqueDays = dailyMap.size || 1;

        return {
            totalHours: Math.round(totalMinutes / 60 * 10) / 10,
            totalMinutes,
            totalSessions: sessions.length,
            avgDailyHours: Math.round(totalMinutes / uniqueDays / 60 * 10) / 10,
            totalBreakMinutes,
            sessionsPerDay,
        };
    },

    async getWeeklyReport(userId: string, weekStart: Date): Promise<ReportData> {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        return this.getReportByDateRange(userId, weekStart.toISOString(), weekEnd.toISOString());
    },

    async getMonthlyReport(userId: string, monthStart: Date): Promise<ReportData> {
        const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0, 23, 59, 59, 999);
        return this.getReportByDateRange(userId, monthStart.toISOString(), monthEnd.toISOString());
    },

    async getSessionsByDateRange(userId: string, startDate: string, endDate: string) {
        const supabase = getSupabaseClient();

        const { data, error } = await (supabase as any)
            .from('work_sessions')
            .select('*')
            .eq('user_id', userId)
            .gte('start_time', startDate)
            .lte('start_time', endDate)
            .order('start_time', { ascending: true });

        if (error) throw error;

        return (data || []).map((s: any) => ({
            date: new Date(s.start_time).toISOString().split('T')[0],
            startTime: new Date(s.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            endTime: s.end_time ? new Date(s.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
            totalMinutes: s.net_work_minutes || 0,
            breakMinutes: s.total_break_minutes || 0,
            status: s.status,
            ...s
        }));
    },

    async getBreakDistribution(userId: string, startDate: string, endDate: string) {
        const supabase = getSupabaseClient();

        const { data, error } = await (supabase as any)
            .from('breaks')
            .select('*, work_sessions!inner(user_id)')
            .eq('work_sessions.user_id', userId)
            .gte('start_time', startDate)
            .lte('start_time', endDate);

        if (error) {
            console.error('Error fetching break distribution:', error);
            return [];
        }

        const distribution: Record<string, number> = {
            lunch: 0,
            short: 0,
            personal: 0
        };

        (data || []).forEach((b: any) => {
            if (b.start_time && b.end_time) {
                const start = new Date(b.start_time).getTime();
                const end = new Date(b.end_time).getTime();
                const minutes = Math.floor((end - start) / 1000 / 60);
                distribution[b.break_type] = (distribution[b.break_type] || 0) + minutes;
            }
        });

        return [
            { name: "Almuerzo", value: distribution.lunch, color: "#166534" },
            { name: "Descanso", value: distribution.short, color: "#22c55e" },
            { name: "Personal", value: distribution.personal, color: "#86efac" },
        ];
    }
};

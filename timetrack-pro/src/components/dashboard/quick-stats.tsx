"use client";

import { formatHoursMinutes, cn } from "@/lib/utils";
import { ArrowUpRight, TrendingUp, CalendarCheck, Coffee, Clock, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface StatCardProps {
    title: string;
    value: string;
    description: string;
    trend: 'up' | 'down' | 'neutral';
    active?: boolean;
    icon: LucideIcon;
    index: number;
}

function StatCard({ title, value, description, trend, active, icon: Icon, index }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
                "group relative overflow-hidden rounded-[1.5rem] p-8 transition-all duration-300",
                active
                    ? "bg-[#1A5235] text-white shadow-2xl shadow-primary/40 dark:shadow-primary/10"
                    : "bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-50 dark:border-slate-800 shadow-sm hover:shadow-xl hover:translate-y-[-4px] dark:hover:shadow-slate-900/50"
            )}
        >
            <div className="flex justify-between items-start mb-10">
                <p className={cn("text-[11px] font-black uppercase tracking-[0.15em]", active ? "text-white/60" : "text-slate-400 dark:text-slate-500")}>
                    {title}
                </p>
                <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-all",
                    active
                        ? "bg-white/10 text-white"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 group-hover:bg-primary/10 group-hover:text-primary dark:group-hover:text-emerald-400 border border-slate-100 dark:border-slate-700"
                )}>
                    <ArrowUpRight className={cn("h-5 w-5", !active && trend === 'down' && "rotate-90 text-red-500")} />
                </div>
            </div>

            <h3 className="text-5xl font-black tracking-tighter mb-6">
                {value}
            </h3>

            <div className="flex items-center gap-2">
                {active ? (
                    <div className="flex items-center gap-2 rounded-lg bg-white/10 px-2 py-1 text-[10px] font-bold text-white border border-white/5">
                        <TrendingUp className="h-3 w-3" />
                        <span>{description}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-[10px] font-bold">
                        <span className="text-slate-400 dark:text-slate-500 capitalize">{description}</span>
                    </div>
                )}
            </div>

            {/* Background Icon Watermark */}
            <div className={cn(
                "absolute -right-8 -bottom-8 h-32 w-32 opacity-[0.03] transition-transform group-hover:scale-110 group-hover:rotate-12",
                active ? "text-white" : "text-slate-900 dark:text-white"
            )}>
                <Icon className="h-full w-full" />
            </div>
        </motion.div>
    );
}

export default function QuickStats() {
    const [stats, setStats] = useState({
        todayMinutes: 0,
        weeklyHours: 0,
        weeklyBreakMinutes: 0,
        monthlyBalance: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            // Obtener estadísticas del día actual
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayDateString = today.toISOString().split('T')[0];

            const { data: todayData } = await supabase
                .from('v_daily_stats')
                .select('*')
                .eq('user_id', user.id)
                .eq('work_date', todayDateString)
                .maybeSingle();

            const todayMinutes = (todayData as any)?.net_work_minutes || 0;

            // Obtener estadísticas semanales usando la vista
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            const weekStart = startOfWeek.toISOString().split('T')[0];

            const { data: weekData } = await supabase
                .from('v_daily_stats')
                .select('*')
                .eq('user_id', user.id)
                .gte('work_date', weekStart)
                .lte('work_date', todayDateString);

            const weeklyMinutes = (weekData as any[])?.reduce((acc: number, s: any) => acc + (s.total_work_minutes || 0), 0) || 0;
            const weeklyBreakMinutes = (weekData as any[])?.reduce((acc: number, s: any) => acc + (s.total_break_minutes || 0), 0) || 0;

            setStats({
                todayMinutes,
                weeklyHours: Math.round(weeklyMinutes / 60),
                weeklyBreakMinutes,
                monthlyBalance: 0 // TODO: Calcular balance mensual
            });
            setLoading(false);
        };

        loadStats();

        // Actualizar cada 30 segundos
        const interval = setInterval(loadStats, 30000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-48 rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 animate-pulse" />
                ))}
            </div>
        );
    }

    const todayPercentage = Math.round((stats.todayMinutes / 480) * 100); // 480 = 8 horas

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                index={0}
                title="Horas Hoy"
                value={formatHoursMinutes(stats.todayMinutes)}
                description={`${todayPercentage}% de la meta diaria`}
                trend="up"
                active={true}
                icon={TrendingUp}
            />
            <StatCard
                index={1}
                title="Total Semanal"
                value={`${stats.weeklyHours}h`}
                description="Esta semana"
                trend="up"
                icon={CalendarCheck}
            />
            <StatCard
                index={2}
                title="Pausas Semanales"
                value={formatHoursMinutes(stats.weeklyBreakMinutes)}
                description="Total de pausas"
                trend="neutral"
                icon={Coffee}
            />
            <StatCard
                index={3}
                title="Balance Mensual"
                value={stats.monthlyBalance >= 0 ? `+${stats.monthlyBalance}h` : `${stats.monthlyBalance}h`}
                description="Horas a favor"
                trend={stats.monthlyBalance >= 0 ? "up" : "down"}
                icon={Clock}
            />
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Target, Zap, Award } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export function AnalyticsMetrics() {
    const [metrics, setMetrics] = useState({
        avgProductivity: 0,
        bestDay: "Cargando...",
        goalCompletion: 0,
        weeklyTrend: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMetrics = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get last 30 days of data
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const { data: userData } = await supabase
                .from('users')
                .select('expected_hours_per_day')
                .eq('id', user.id)
                .single();

            const expectedMinutes = (userData?.expected_hours_per_day || 8) * 60;

            const { data: dailyStats } = await supabase
                .from('v_daily_stats')
                .select('*')
                .eq('user_id', user.id)
                .gte('work_date', thirtyDaysAgo.toISOString().split('T')[0])
                .order('work_date', { ascending: false });

            if (dailyStats && dailyStats.length > 0) {
                // Calculate average productivity
                const avgProd = dailyStats.reduce((acc: number, s: any) => {
                    const productivity = Math.min((s.net_work_minutes / expectedMinutes) * 100, 100);
                    return acc + productivity;
                }, 0) / dailyStats.length;

                // Find best day
                const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                const dayProductivity: Record<string, number[]> = {};

                dailyStats.forEach((s: any) => {
                    const dayOfWeek = new Date(s.work_date).getDay();
                    const dayName = daysOfWeek[dayOfWeek];
                    if (!dayProductivity[dayName]) dayProductivity[dayName] = [];
                    dayProductivity[dayName].push(s.net_work_minutes);
                });

                let bestDay = 'Lunes';
                let maxAvg = 0;
                Object.entries(dayProductivity).forEach(([day, minutes]) => {
                    const avg = minutes.reduce((a, b) => a + b, 0) / minutes.length;
                    if (avg > maxAvg) {
                        maxAvg = avg;
                        bestDay = day;
                    }
                });

                // Calculate goal completion
                const totalMinutes = dailyStats.reduce((acc: number, s: any) => acc + (s.net_work_minutes || 0), 0);
                const expectedTotal = dailyStats.length * expectedMinutes;
                const goalCompletion = Math.min((totalMinutes / expectedTotal) * 100, 100);

                // Calculate weekly trend (last 7 days vs previous 7 days)
                const last7 = dailyStats.slice(0, 7);
                const prev7 = dailyStats.slice(7, 14);
                const last7Avg = last7.reduce((acc: number, s: any) => acc + (s.net_work_minutes || 0), 0) / 7;
                const prev7Avg = prev7.length > 0 ? prev7.reduce((acc: number, s: any) => acc + (s.net_work_minutes || 0), 0) / 7 : last7Avg;
                const weeklyTrend = prev7Avg > 0 ? ((last7Avg - prev7Avg) / prev7Avg) * 100 : 0;

                setMetrics({
                    avgProductivity: Math.round(avgProd),
                    bestDay,
                    goalCompletion: Math.round(goalCompletion),
                    weeklyTrend: Math.round(weeklyTrend * 10) / 10,
                });
            }
            setLoading(false);
        };

        loadMetrics();
    }, []);

    const metricsData = [
        {
            label: "Productividad Media",
            value: `${metrics.avgProductivity}%`,
            icon: Zap,
            trend: metrics.avgProductivity >= 80 ? "up" : metrics.avgProductivity >= 60 ? "neutral" : "down",
            trendValue: `${metrics.avgProductivity}%`,
            description: "últimos 30 días"
        },
        {
            label: "Día Más Productivo",
            value: metrics.bestDay,
            icon: Award,
            trend: "neutral",
            trendValue: "-",
            description: "Consistente"
        },
        {
            label: "Cumplimiento Meta",
            value: `${metrics.goalCompletion}%`,
            icon: Target,
            trend: metrics.goalCompletion >= 90 ? "up" : metrics.goalCompletion >= 70 ? "neutral" : "down",
            trendValue: `${metrics.goalCompletion}%`,
            description: "vs objetivo mes"
        },
        {
            label: "Tendencia Semanal",
            value: `${metrics.weeklyTrend >= 0 ? '+' : ''}${metrics.weeklyTrend}%`,
            icon: TrendingUp,
            trend: metrics.weeklyTrend > 0 ? "up" : metrics.weeklyTrend < 0 ? "down" : "neutral",
            trendValue: `${Math.abs(metrics.weeklyTrend)}%`,
            description: "vs semana anterior"
        },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-48 rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metricsData.map((metric, i) => (
                <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative overflow-hidden rounded-[1.5rem] bg-white dark:bg-slate-900 p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:hover:shadow-slate-900/50 border border-slate-50 dark:border-slate-800"
                >
                    <div className="flex justify-between items-start mb-10">
                        <p className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                            {metric.label}
                        </p>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all group-hover:bg-[#1A5235]/10 group-hover:text-[#1A5235] dark:group-hover:text-emerald-400 border border-slate-100 dark:border-slate-700">
                            <metric.icon className="h-5 w-5" />
                        </div>
                    </div>

                    <h3 className="text-5xl font-black tracking-tighter mb-6 text-slate-800 dark:text-white">
                        {metric.value}
                    </h3>

                    <div className="flex items-center gap-2 text-[10px] font-bold">
                        <span className={cn(
                            "flex items-center gap-1 rounded-md px-1.5 py-0.5 border",
                            metric.trend === 'up'
                                ? "bg-green-50 dark:bg-emerald-900/30 text-[#1A5235] dark:text-emerald-400 border-green-100 dark:border-emerald-900/50"
                                : metric.trend === 'down'
                                    ? "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 border-red-100 dark:border-red-900/50"
                                    : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700"
                        )}>
                            {metric.trend === 'up' && '▲'}
                            {metric.trend === 'down' && '▼'}
                            {metric.trend === 'neutral' && '•'}
                            {' '}{metric.trendValue}
                        </span>
                        <span className="text-slate-400 dark:text-slate-500 capitalize">{metric.description}</span>
                    </div>

                    {/* Background Icon Watermark */}
                    <div className="absolute -right-8 -bottom-8 h-32 w-32 opacity-[0.03] transition-transform group-hover:scale-110 group-hover:rotate-12 text-slate-900 dark:text-white pointer-events-none">
                        <metric.icon className="h-full w-full" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

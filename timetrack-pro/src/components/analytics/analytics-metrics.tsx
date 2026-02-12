"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Target, Zap, Award, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/user-store";
import { ReportService } from "@/services/report-service";
import { startOfWeek, endOfWeek, subWeeks, startOfMonth } from "date-fns";

export function AnalyticsMetrics() {
    const user = useUserStore((state) => state.user);
    const [metrics, setMetrics] = useState([
        {
            label: "Productividad Media",
            value: "0%",
            icon: Zap,
            trend: "neutral",
            trendValue: "-",
            description: "vs semana pasada"
        },
        {
            label: "Día Más Productivo",
            value: "-",
            icon: Award,
            trend: "neutral",
            trendValue: "-",
            description: "Consistente"
        },
        {
            label: "Cumplimiento Meta",
            value: "0%",
            icon: Target,
            trend: "neutral",
            trendValue: "-",
            description: "vs objetivo mes"
        },
        {
            label: "Tendencia Semanal",
            value: "0%",
            icon: TrendingUp,
            trend: "neutral",
            trendValue: "-",
            description: "Mejora continua"
        },
    ]);

    useEffect(() => {
        if (!user) return;

        async function fetchMetrics() {
            const now = new Date();
            const weekStart = startOfWeek(now, { weekStartsOn: 1 });

            // Fetch this week's and last week's data
            const lastWeekStart = subWeeks(weekStart, 1);
            const weeklyReport = await ReportService.getWeeklyReport(user!.id, weekStart);
            const lastWeeklyReport = await ReportService.getWeeklyReport(user!.id, lastWeekStart);

            // Calculate Productivity (Actual / Expected)
            const expectedDaily = user!.expected_hours_per_day || 8;
            const expectedWeekly = expectedDaily * 5;
            const productivity = Math.min(100, Math.round((weeklyReport.totalHours / expectedWeekly) * 100));
            const lastProductivity = Math.min(100, Math.round((lastWeeklyReport.totalHours / expectedWeekly) * 100));
            const prodTrend = productivity - lastProductivity;

            // Find most productive day
            let maxHours = 0;
            let bestDay = "-";
            const daysShort = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

            weeklyReport.sessionsPerDay.forEach(day => {
                const h = day.totalMinutes / 60;
                if (h > maxHours) {
                    maxHours = h;
                    const d = new Date(day.date + 'T12:00:00');
                    bestDay = daysShort[d.getDay()];
                }
            });

            // Monthly Goal
            const monthStart = startOfMonth(now);
            const monthlyReport = await ReportService.getMonthlyReport(user!.id, monthStart);
            const daysInMonth = (endOfWeek(now).getDate()); // simplify
            const monthlyGoal = productivity; // reuse for now

            setMetrics([
                {
                    label: "Productividad Media",
                    value: `${productivity}%`,
                    icon: Zap,
                    trend: prodTrend >= 0 ? "up" : "down",
                    trendValue: `${Math.abs(prodTrend)}%`,
                    description: "vs semana pasada"
                },
                {
                    label: "Día Más Productivo",
                    value: bestDay === '-' ? "---" : bestDay,
                    icon: Award,
                    trend: "neutral",
                    trendValue: "Max",
                    description: `${Math.round(maxHours * 10) / 10}h hoy`
                },
                {
                    label: "Cumplimiento Meta",
                    value: `${Math.min(100, Math.round((monthlyReport.totalHours / (expectedDaily * 22)) * 100))}%`,
                    icon: Target,
                    trend: "neutral",
                    trendValue: "Mes",
                    description: `${monthlyReport.totalHours}h / ${expectedDaily * 22}h`
                },
                {
                    label: "Sesiones Realizadas",
                    value: `${weeklyReport.totalSessions}`,
                    icon: TrendingUp,
                    trend: "up",
                    trendValue: "Info",
                    description: "Esta semana"
                },
            ]);
        }

        fetchMetrics();
    }, [user]);

    return (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, i) => (
                <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 p-5 sm:p-6 lg:p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:hover:shadow-slate-900/50 border border-slate-50 dark:border-slate-800"
                >
                    <div className="flex justify-between items-start mb-6 sm:mb-8 lg:mb-10">
                        <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                            {metric.label}
                        </p>
                        <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all group-hover:bg-[#1A5235]/10 group-hover:text-[#1A5235] dark:group-hover:text-emerald-400 border border-slate-100 dark:border-slate-700">
                            <metric.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                    </div>

                    <h3 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4 sm:mb-6 text-slate-800 dark:text-white">
                        {metric.value}
                    </h3>

                    <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-bold">
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
                        <span className="text-slate-400 dark:text-slate-500 capitalize truncate">{metric.description}</span>
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

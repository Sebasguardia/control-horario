"use client";

import { useEffect, useState } from "react";
import { formatHoursMinutes, cn } from "@/lib/utils";
import { ArrowUpRight, TrendingUp, CalendarCheck, Coffee, Clock, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "@/stores/user-store";
import { useSessionStore } from "@/stores/session-store";
import { ReportService } from "@/services/report-service";

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
                "group relative overflow-hidden rounded-[2rem] p-6 sm:p-8 transition-all duration-500",
                active
                    ? "bg-gradient-to-br from-[#1A5235] to-[#166534] text-white shadow-2xl shadow-emerald-500/20 dark:shadow-emerald-900/10"
                    : "bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2"
            )}
        >
            <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="mb-4 sm:mb-6 flex items-start justify-between">
                    <div className={cn(
                        "rounded-2xl p-3 sm:p-4 transition-all duration-300",
                        active
                            ? "bg-white/10 text-white shadow-inner backdrop-blur-md"
                            : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-[#1A5235] group-hover:text-white group-hover:rotate-12"
                    )}>
                        <Icon className="h-5 w-5 sm:h-7 sm:w-7" strokeWidth={2} />
                    </div>
                </div>

                <div>
                    <h3 className={cn(
                        "text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-2 sm:mb-3",
                        active ? "text-emerald-100/70" : "text-slate-400 dark:text-slate-500"
                    )}>{title}</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter">{value}</span>
                    </div>
                </div>

                <div className={cn(
                    "mt-4 sm:mt-6 pt-4 sm:pt-6 border-t",
                    active ? "border-white/10" : "border-slate-50 dark:border-slate-800"
                )}>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-bold">
                        <span className={cn(
                            "flex items-center gap-1.5 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 border transition-colors",
                            trend === 'up'
                                ? (active ? "bg-white/20 text-white border-white/20" : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50")
                                : (active ? "bg-white/20 text-white border-white/20" : "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 border-red-100 dark:border-red-900/50")
                        )}>
                            {trend === 'up' ? '▲' : '▼'} {trend === 'up' ? 'Estable' : 'Objetivo'}
                        </span>
                        <span className={cn(
                            "capitalize font-bold",
                            active ? "text-emerald-100/60" : "text-slate-400 dark:text-slate-500"
                        )}>{description}</span>
                    </div>
                </div>
            </div>

            <div className={cn(
                "absolute -right-4 -top-4 sm:-right-6 sm:-top-6 h-32 w-32 sm:h-40 sm:w-40 opacity-[0.05] transition-all duration-700 group-hover:scale-125 group-hover:rotate-45",
                active ? "text-white" : "text-emerald-900 dark:text-emerald-400"
            )}>
                <Icon className="h-full w-full" />
            </div>
        </motion.div>
    );
}

export default function QuickStats() {
    const user = useUserStore(state => state.user);
    const { currentSession, seconds } = useSessionStore();
    const [stats, setStats] = useState({
        todayHours: 0,
        weekHours: 0,
        todayMinutes: 0,
        weekMinutes: 0,
        weekBreaks: 0,
        monthBalance: 0
    });
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            if (!user) return;
            setIsLoadingStats(true);
            try {
                const now = new Date();

                // Today's range
                const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
                const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

                // Week start (Monday)
                const weekStart = new Date(now);
                const day = weekStart.getDay();
                const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
                weekStart.setDate(diff);
                weekStart.setHours(0, 0, 0, 0);

                const [todayReport, weeklyReport, monthlyReport] = await Promise.all([
                    ReportService.getReportByDateRange(user.id, todayStart, todayEnd),
                    ReportService.getWeeklyReport(user.id, weekStart),
                    ReportService.getMonthlyReport(user.id, new Date(now.getFullYear(), now.getMonth(), 1))
                ]);

                // Calculate monthly expected hours until today
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                let expectedHours = 0;
                const currentDay = now.getDate();
                const dailyGoal = user.expected_hours_per_day || 8;

                // Simple calculation: count week days (Mon-Fri) passed in result
                let cursor = new Date(startOfMonth);
                while (cursor.getDate() <= currentDay) {
                    const day = cursor.getDay();
                    if (day !== 0 && day !== 6) { // Mon-Fri
                        expectedHours += dailyGoal;
                    }
                    cursor.setDate(cursor.getDate() + 1);
                }

                const monthBalance = monthlyReport.totalHours - expectedHours;

                setStats({
                    todayHours: todayReport.totalHours,
                    weekHours: weeklyReport.totalHours,
                    todayMinutes: todayReport.totalMinutes,
                    weekMinutes: weeklyReport.totalMinutes,
                    weekBreaks: weeklyReport.totalBreakMinutes,
                    monthBalance: monthBalance
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setIsLoadingStats(false);
            }
        }

        if (user) {
            fetchStats();
        } else {
            // If no user yet, don't show the skeleton as "loading stats" 
            // but we might still be loading the user. 
            // For now, let's just ensure we don't get stuck.
            setIsLoadingStats(false);
        }
    }, [user, currentSession?.status]);

    if (isLoadingStats && stats.todayMinutes === 0 && user) {
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-48 w-full animate-pulse rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800" />
                ))}
            </div>
        );
    }

    // Active session contribution (in minutes)
    const activeMinutes = currentSession ? Math.floor(seconds / 60) : 0;
    const totalTodayMinutes = stats.todayMinutes + activeMinutes;
    const totalWeekMinutes = stats.weekMinutes + activeMinutes;

    // Formatting
    const formatH = (h: number) => {
        const hours = Math.floor(h);
        const mins = Math.round((h - hours) * 60);
        return `${hours}h ${mins}m`;
    };

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                index={0}
                title="Horas Hoy"
                value={formatHoursMinutes(totalTodayMinutes)}
                description={`${Math.round((totalTodayMinutes / 60 / (user?.expected_hours_per_day || 8)) * 100)}% de la meta`}
                trend="up"
                active={true}
                icon={TrendingUp}
            />
            <StatCard
                index={1}
                title="Total Semanal"
                value={formatHoursMinutes(totalWeekMinutes)}
                description="Acumulado"
                trend="up"
                icon={CalendarCheck}
            />
            <StatCard
                index={2}
                title="Pausas Semanales"
                value={formatHoursMinutes(stats.weekBreaks)}
                description="Total descansos"
                trend="neutral"
                icon={Coffee}
            />
            <StatCard
                index={3}
                title="Balance Mensual"
                value={stats.monthBalance > 0 ? `+${Math.floor(stats.monthBalance)}h ${Math.round((stats.monthBalance - Math.floor(stats.monthBalance)) * 60)}m` : `${Math.floor(stats.monthBalance)}h ${Math.round((stats.monthBalance - Math.floor(stats.monthBalance)) * 60)}m`}
                description="Acumulado vs Meta"
                trend={stats.monthBalance >= 0 ? 'up' : 'down'}
                icon={Clock}
                active={stats.monthBalance < 0} // Highlight if negative (owing hours)
            />
        </div>
    );
}

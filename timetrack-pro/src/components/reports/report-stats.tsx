"use client";

import { formatHoursMinutes, cn } from "@/lib/utils";
import { Clock, TrendingUp, Calendar, Coffee, AlertCircle, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "@/stores/user-store";

interface ReportStatsProps {
    sessions: any[];
}

export function ReportStats({ sessions }: ReportStatsProps) {
    const user = useUserStore(state => state.user);
    const totalMinutes = sessions.reduce((acc, s) => acc + (s.totalMinutes || 0), 0);
    const totalBreaks = sessions.reduce((acc, s) => acc + (s.breakMinutes || 0), 0);
    const avgMinutes = sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0;

    // Balance calculation
    // Assuming 5 days a week work for the "Target" calculation roughly, or based on sessions count?
    // Using sessions count implies target is only for days worked.
    // Ideally we'd compare against working days in period, but for now matching mock logic:
    const targetMinutesPerDay = (user?.expected_hours_per_day || 8) * 60;
    const totalTargetMinutes = sessions.length * targetMinutesPerDay;
    const balance = totalMinutes - totalTargetMinutes;

    const stats = [
        {
            label: "Tiempo Trabajado",
            value: formatHoursMinutes(totalMinutes),
            icon: Clock,
            trend: "up",
            trendValue: "Total",
            desc: `${sessions.length} jornadas`
        },
        {
            label: "Promedio Diario",
            value: formatHoursMinutes(avgMinutes),
            icon: TrendingUp,
            trend: "neutral",
            trendValue: "Media",
            desc: "Tiempo neto"
        },
        {
            label: "Tiempo en Pausas",
            value: `${totalBreaks}m`,
            icon: Coffee,
            trend: "down",
            trendValue: "Pausas",
            desc: "Acumulado"
        },
        {
            label: "Balance Periodo",
            value: `${balance >= 0 ? '+' : '-'}${formatHoursMinutes(Math.abs(balance))}`,
            icon: AlertCircle,
            trend: balance >= 0 ? "up" : "down",
            trendValue: balance >= 0 ? "Positivo" : "Negativo",
            desc: balance >= 0 ? "A favor" : "Pendiente"
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                        "group relative overflow-hidden rounded-[2rem] p-5 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300 border border-slate-50 dark:border-slate-800",
                        "bg-white dark:bg-slate-900"
                    )}
                >
                    <div className="relative z-10 flex h-full flex-col justify-between">
                        <div className="mb-3 sm:mb-4 flex items-start justify-between">
                            <div className="rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800 p-2.5 sm:p-3.5 text-slate-600 dark:text-slate-400 group-hover:bg-[#1A5235]/10 group-hover:text-[#1A5235] dark:group-hover:text-emerald-400 transition-colors">
                                <stat.icon size={22} className="sm:w-[26px] sm:h-[26px]" strokeWidth={1.5} />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 rounded-full px-2 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider",
                                stat.trend === 'up' ? "bg-green-50 text-[#1A5235] dark:bg-emerald-900/30 dark:text-emerald-400" :
                                    stat.trend === 'down' ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                                        "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            )}>
                                {stat.trendValue}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 sm:mb-2">{stat.label}</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800 dark:text-white">{stat.value}</span>
                            </div>
                            <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 capitalize">{stat.desc}</p>
                        </div>
                    </div>

                    <div className="absolute -right-8 -bottom-8 h-32 w-32 opacity-[0.03] transition-transform group-hover:scale-110 group-hover:rotate-12 text-slate-900 dark:text-white pointer-events-none">
                        <stat.icon className="h-full w-full" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

"use client";

import { formatHoursMinutes, cn } from "@/lib/utils";
import { Clock, TrendingUp, Calendar, Coffee, AlertCircle, LucideIcon } from "lucide-react";
import { mockUser } from "@/mocks/mock-data";
import { motion } from "framer-motion";

interface ReportStatsProps {
    sessions: any[];
}

export function ReportStats({ sessions }: ReportStatsProps) {
    const totalMinutes = sessions.reduce((acc, s) => acc + (s.totalMinutes || 0), 0);
    const totalBreaks = sessions.reduce((acc, s) => acc + (s.breakMinutes || 0), 0);
    const avgMinutes = sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0;

    // Balance calculation
    const targetMinutesPerDay = mockUser.expected_hours_per_day * 60;
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative overflow-hidden rounded-[1.5rem] bg-white dark:bg-slate-900 p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:hover:shadow-slate-900/50 border border-slate-50 dark:border-slate-800"
                >
                    <div className="flex justify-between items-start mb-10">
                        <p className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                            {stat.label}
                        </p>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all group-hover:bg-[#1A5235]/10 group-hover:text-[#1A5235] dark:group-hover:text-emerald-400 border border-slate-100 dark:border-slate-700">
                            <stat.icon className="h-5 w-5" />
                        </div>
                    </div>

                    <h3 className="text-5xl font-black tracking-tighter mb-6 text-slate-800 dark:text-white">
                        {stat.value}
                    </h3>

                    <div className="flex items-center gap-2 text-[10px] font-bold">
                        <span className={cn(
                            "flex items-center gap-1 rounded-md px-1.5 py-0.5 border",
                            stat.trend === 'up'
                                ? "bg-green-50 dark:bg-emerald-900/30 text-[#1A5235] dark:text-emerald-400 border-green-100 dark:border-emerald-900/50"
                                : stat.trend === 'down'
                                    ? "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 border-red-100 dark:border-red-900/50"
                                    : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700"
                        )}>
                            {stat.trend === 'up' && '▲'}
                            {stat.trend === 'down' && '▼'}
                            {stat.trend === 'neutral' && '•'}
                            {' '}{stat.trendValue}
                        </span>
                        <span className="text-slate-400 dark:text-slate-500 capitalize">{stat.desc}</span>
                    </div>

                    {/* Background Icon Watermark */}
                    <div className="absolute -right-8 -bottom-8 h-32 w-32 opacity-[0.03] transition-transform group-hover:scale-110 group-hover:rotate-12 text-slate-900 dark:text-white pointer-events-none">
                        <stat.icon className="h-full w-full" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

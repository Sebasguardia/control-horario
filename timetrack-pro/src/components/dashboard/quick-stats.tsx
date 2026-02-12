"use client";

import { mockStats } from "@/mocks/mock-data";
import { formatHoursMinutes, cn } from "@/lib/utils";
import { ArrowUpRight, TrendingUp, CalendarCheck, Coffee, Clock, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

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
                        <span className={cn(
                            "flex items-center gap-1 rounded-md px-1.5 py-0.5 border",
                            trend === 'up'
                                ? "bg-green-50 dark:bg-emerald-900/30 text-primary dark:text-emerald-400 border-green-100 dark:border-emerald-900/50"
                                : "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 border-red-100 dark:border-red-900/50"
                        )}>
                            {trend === 'up' ? '▲' : '▼'} {trend === 'up' ? '8%' : '3%'}
                        </span>
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
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                index={0}
                title="Horas Hoy"
                value={formatHoursMinutes(400)}
                description="85% de la meta diaria"
                trend="up"
                active={true}
                icon={TrendingUp}
            />
            <StatCard
                index={1}
                title="Total Semanal"
                value={`${mockStats.totalHoursThisWeek}h`}
                description="+2h vs semana pasada"
                trend="up"
                icon={CalendarCheck}
            />
            <StatCard
                index={2}
                title="Pausas Semanales"
                value={formatHoursMinutes(mockStats.breakMinutesThisWeek)}
                description="Promedio estable"
                trend="neutral"
                icon={Coffee}
            />
            <StatCard
                index={3}
                title="Balance Mensual"
                value="+4h"
                description="Horas a favor"
                trend="up"
                icon={Clock}
            />
        </div>
    );
}

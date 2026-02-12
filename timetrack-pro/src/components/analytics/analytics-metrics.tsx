"use client";

import { mockProductivityData } from "@/mocks/mock-data";
import { TrendingUp, Target, Zap, Award, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnalyticsMetrics() {
    const avgProductivity = Math.round(
        mockProductivityData.reduce((acc, d) => acc + d.productivity, 0) / mockProductivityData.length
    );

    const metrics = [
        {
            label: "Productividad Media",
            value: `${avgProductivity}%`,
            icon: Zap,
            trend: "up",
            trendValue: "5%",
            description: "vs semana pasada"
        },
        {
            label: "Día Más Productivo",
            value: "Miércoles",
            icon: Award,
            trend: "neutral",
            trendValue: "-",
            description: "Consistente"
        },
        {
            label: "Cumplimiento Meta",
            value: "87%",
            icon: Target,
            trend: "down",
            trendValue: "2%",
            description: "vs objetivo mes"
        },
        {
            label: "Tendencia Semanal",
            value: "+5.2%",
            icon: TrendingUp,
            trend: "up",
            trendValue: "1.2%",
            description: "Meora continua"
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, i) => (
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

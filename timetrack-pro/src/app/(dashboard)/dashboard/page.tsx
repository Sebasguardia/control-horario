"use client";

import { useEffect } from "react";
import TimeTracker from "@/components/dashboard/time-tracker";
import QuickStats from "@/components/dashboard/quick-stats";
import WeeklyChart from "@/components/dashboard/weekly-chart";
import RecentSessions from "@/components/dashboard/recent-sessions";
import { useTimer } from "@/hooks/use-timer";
import { usePageStore } from "@/stores/page-store";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

import { useUserStore } from "@/stores/user-store";

export default function DashboardPage() {
    const { status, startSession } = useTimer();
    const { title, subtitle, setTitle } = usePageStore();
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        setTitle("Panel Principal", "Gestiona tu tiempo y revisa tu actividad diaria.");
    }, [setTitle]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 lg:space-y-10"
        >
            {/* Header Section */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-2 sm:px-0">
                <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-800 dark:text-white">{title}</h1>
                    {subtitle && (
                        <p className="mt-1 sm:mt-2 text-sm sm:text-base font-bold text-slate-400 dark:text-slate-500">{subtitle}</p>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {status === 'idle' && (
                        <button
                            onClick={() => user && startSession(user.id)}
                            className="flex h-12 lg:h-14 items-center justify-center gap-3 rounded-2xl bg-[#1A5235] px-6 lg:px-10 text-xs lg:text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 dark:shadow-primary/10 transition-all hover:bg-emerald-900 hover:-translate-y-0.5 active:scale-95 w-full sm:w-auto"
                        >
                            <Play className="h-4 w-4 lg:h-5 lg:w-5 fill-current" />
                            Nueva Jornada
                        </button>
                    )}
                </div>
            </div>

            {/* Content Sections */}
            <div className="px-1 sm:px-0 space-y-8 lg:space-y-10">
                <QuickStats />

                <div className="grid grid-cols-1 gap-8 lg:gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-8 h-full">
                        <WeeklyChart />
                    </div>
                    <div className="lg:col-span-4 h-full">
                        <TimeTracker />
                    </div>
                </div>

                <RecentSessions />
            </div>
        </motion.div>
    );
}

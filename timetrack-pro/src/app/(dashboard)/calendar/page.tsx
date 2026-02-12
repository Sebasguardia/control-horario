"use client";

import { useEffect, useState } from "react";
import { CalendarView } from "@/components/calendar/calendar-view";
import { DayDetailModal } from "@/components/calendar/day-detail-modal";
import { usePageStore } from "@/stores/page-store";
import { motion } from "framer-motion";

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1)); // Feb 2026
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const { title, subtitle, setTitle } = usePageStore();

    useEffect(() => {
        setTitle("Calendario", "Vista mensual de tu asistencia.");
    }, [setTitle]);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-10"
            >
                {/* Header Section */}
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-lg font-medium text-slate-500 dark:text-slate-400">
                                {subtitle}
                            </p>
                        )}
                    </div>


                </div>

                <div className="rounded-[1.5rem] bg-[#F7F8F9] dark:bg-slate-900 p-1 border border-slate-100/50 dark:border-slate-800/50">
                    <CalendarView
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        setSelectedDay={setSelectedDay}
                    />
                </div>
            </motion.div>

            <DayDetailModal
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
            />
        </>
    );
}

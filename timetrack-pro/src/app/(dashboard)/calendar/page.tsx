"use client";

import { useEffect, useState, useCallback } from "react";
import { CalendarView } from "@/components/calendar/calendar-view";
import { DayDetailModal } from "@/components/calendar/day-detail-modal";
import { usePageStore } from "@/stores/page-store";
import { motion } from "framer-motion";
import { useUserStore } from "@/stores/user-store";
import { ReportService } from "@/services/report-service";

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [sessions, setSessions] = useState<any[]>([]);
    const [holidays, setHolidays] = useState<any[]>([]);
    const { title, subtitle, setTitle } = usePageStore();
    const user = useUserStore(state => state.user);

    useEffect(() => {
        setTitle("Calendario", "Vista mensual de tu asistencia.");
    }, [setTitle]);

    const fetchHolidays = useCallback(async () => {
        try {
            const res = await fetch(`/api/holidays?countryCode=PE`);
            if (!res.ok) return;
            // The API we have now returns { isHoliday, holidayName, upcomingHolidays }
            // But for the calendar, we need ALL holidays of the year.
            // Let's create a more general API or just use the one that fetches all for the year.
            // Actually, Nager.Date has /PublicHolidays/{year}/{countryCode}
            const year = currentDate.getFullYear();
            const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/PE`);
            if (response.ok) {
                const data = await response.json();
                setHolidays(data);
            }
        } catch (error) {
            console.error("Error fetching holidays:", error);
        }
    }, [currentDate]);

    const fetchSessions = useCallback(async () => {
        if (!user) return;
        try {
            const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
            const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();
            const data = await ReportService.getSessionsByDateRange(user.id, start, end);
            setSessions(data);
        } catch (error) {
            console.error("Error fetching sessions:", error);
        }
    }, [user, currentDate]);

    useEffect(() => {
        fetchSessions();
        fetchHolidays();
    }, [fetchSessions, fetchHolidays]);

    const selectedSession = sessions.find(s => s.date === selectedDay?.split('T')[0]) || null;

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 lg:space-y-10"
            >
                <div className="px-2 sm:px-0">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg font-medium text-slate-500 dark:text-slate-400">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="px-1 sm:px-0 rounded-[2rem] bg-[#F7F8F9] dark:bg-slate-900 p-1 border border-slate-100/50 dark:border-slate-800/50">
                    <CalendarView
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        selectedDay={selectedDay}
                        setSelectedDay={setSelectedDay}
                        sessions={sessions}
                        holidays={holidays}
                    />
                </div>
            </motion.div>

            <DayDetailModal
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                session={selectedSession}
            />
        </>
    );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, X, CalendarHeart, AlertCircle } from "lucide-react";

interface HolidayInfo {
    isHoliday: boolean;
    holidayName: string | null;
    upcomingHolidays: { date: string; localName: string; name: string }[];
}

export default function HolidayBanner() {
    const [holiday, setHoliday] = useState<HolidayInfo | null>(null);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const fetchHoliday = async () => {
            try {
                const res = await fetch("/api/holidays?countryCode=PE");
                if (!res.ok) return;
                const data = await res.json();
                setHoliday(data);
            } catch {
                // Silently fail
            }
        };
        fetchHoliday();
    }, []);

    if (!holiday || dismissed) return null;

    // Case 1: Today IS a holiday
    if (holiday.isHoliday) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative overflow-hidden rounded-[1.5rem] bg-emerald-500 p-[1px] shadow-lg shadow-emerald-500/20"
                >
                    <div className="rounded-[1.5rem] bg-emerald-600/10 backdrop-blur-md px-6 py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-white">
                            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <PartyPopper className="h-4 w-4" />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">¡Hoy es Feriado!</span>
                                <p className="text-sm font-black leading-tight">{holiday.holidayName}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setDismissed(true)}
                            className="h-8 w-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-all"
                        >
                            <X className="h-4 w-4 text-white/70" />
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    // Case 2: Upcoming holidays
    if (holiday.upcomingHolidays?.length > 0) {
        const next = holiday.upcomingHolidays[0];
        const nextDate = new Date(next.date + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const daysUntil = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntil > 14) return null;

        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-emerald-100/50 dark:border-emerald-900/20"
                >
                    <div className="h-8 w-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <CalendarHeart className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/80 dark:text-emerald-400/80">
                            Próximo Feriado: {daysUntil === 1 ? "Mañana" : `en ${daysUntil} días`}
                        </p>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                            {next.localName} — {nextDate.toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                        </p>
                    </div>
                    <button onClick={() => setDismissed(true)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <X className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                </motion.div>
            </AnimatePresence>
        );
    }

    return null;
}

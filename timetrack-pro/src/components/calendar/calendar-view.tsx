"use client";

import { formatHoursMinutes, cn } from "@/lib/utils";
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Coffee,
    Target,
    TrendingUp,
    Calendar as CalendarIcon,
    AlertCircle
} from "lucide-react";
import { Dispatch, SetStateAction, useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/stores/user-store";
import { ReportService } from "@/services/report-service";
import { DayDetailModal } from "./day-detail-modal";

const DAYS_OF_WEEK = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

interface CalendarViewProps {
    currentDate: Date;
    setCurrentDate: Dispatch<SetStateAction<Date>>;
    selectedDay: string | null;
    setSelectedDay: Dispatch<SetStateAction<string | null>>;
    sessions: any[];
    holidays?: any[];
}

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday = 0
}

export function CalendarView({ currentDate, setCurrentDate, selectedDay, setSelectedDay, sessions, holidays = [] }: CalendarViewProps) {
    const user = useUserStore(state => state.user);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const monthName = currentDate.toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric",
    });

    const prevMonth = () => setCurrentDate(new Date(year, month - 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1));

    // Map sessions for easy access
    const sessionsMap = useMemo(() => {
        const map: Record<string, any> = {};
        sessions.forEach(s => {
            map[s.date] = s;
        });
        return map;
    }, [sessions]);

    // Map holidays for easy access
    const holidaysMap = useMemo(() => {
        const map: Record<string, any> = {};
        holidays.forEach(h => {
            map[h.date] = h;
        });
        return map;
    }, [holidays]);

    const days = useMemo(() => {
        const result = [];
        for (let i = 0; i < firstDay; i++) {
            result.push(null);
        }
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const session = sessionsMap[dateStr];
            const holiday = holidaysMap[dateStr];
            result.push({ day: d, dateStr, session, holiday });
        }
        return result;
    }, [year, month, daysInMonth, firstDay, sessionsMap, holidaysMap]);

    // Monthly stats
    const stats = useMemo(() => {
        const currentMonthSessions = sessions; // Already filtered by fetch
        const totalMinutes = currentMonthSessions.reduce((acc, s) => acc + (s.totalMinutes || 0), 0);
        const totalBreaks = currentMonthSessions.reduce((acc, s) => acc + (s.breakMinutes || 0), 0);

        // Count unique days
        const uniqueDaysSet = new Set(currentMonthSessions.map(s => s.date));
        const workedDays = uniqueDaysSet.size;

        const expectedHours = user?.expected_hours_per_day || 8;
        const expectedMinutes = workedDays * (expectedHours * 60);
        const balance = totalMinutes - expectedMinutes;

        return {
            workedDays: workedDays,
            totalTime: formatHoursMinutes(totalMinutes),
            totalBreaks: `${totalBreaks}m`,
            balance: balance,
            balanceFormatted: `${balance >= 0 ? '+' : ''}${formatHoursMinutes(Math.abs(balance))}`
        };
    }, [sessions, user]);

    // Calculate monthly highlights
    const highlights = useMemo(() => {
        const activeSessions = days.filter(d => d?.session).map(d => d!.session);
        if (!activeSessions.length) return null;

        const maxMinutes = Math.max(...activeSessions.map(s => s.totalMinutes));
        const bestDay = days.find(d => d?.session?.totalMinutes === maxMinutes);

        const avgMinutes = activeSessions.reduce((acc, s) => acc + s.totalMinutes, 0) / activeSessions.length;

        // Simple frequency map for start times
        const startTimes = activeSessions.map(s => s.startTime);
        const modeStartTime = startTimes.sort((a, b) =>
            startTimes.filter(v => v === a).length - startTimes.filter(v => v === b).length
        ).pop();

        return {
            bestDayStr: bestDay ? (() => {
                const [y, m, d] = bestDay.dateStr.split('-').map(Number);
                return new Date(y, m - 1, d).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' });
            })() : '-',
            bestDayHours: formatHoursMinutes(maxMinutes),
            avgDaily: formatHoursMinutes(avgMinutes),
            typicalStart: modeStartTime || '-'
        };
    }, [days]);

    const selectedSession = useMemo(() => {
        return selectedDay ? sessionsMap[selectedDay] : null;
    }, [selectedDay, sessionsMap]);

    return (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Calendar Main Section */}
            <div className="flex-1 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 lg:p-8 shadow-sm">
                {/* Header */}
                <div className="relative mb-6 sm:mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 sm:gap-5">
                        <div className="flex h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                            <span className="text-xl sm:text-2xl font-black tracking-tighter">{currentDate.getDate()}</span>
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black capitalize text-slate-900 dark:text-white tracking-tight leading-none mb-1">{monthName}</h2>
                            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 capitalize">{year}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                        <button
                            onClick={prevMonth}
                            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white hover:shadow-sm transition-all active:scale-95"
                        >
                            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />
                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="px-3 sm:px-4 h-9 sm:h-10 flex items-center justify-center rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all active:scale-95"
                        >
                            Hoy
                        </button>
                        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />
                        <button
                            onClick={nextMonth}
                            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white hover:shadow-sm transition-all active:scale-95"
                        >
                            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                    </div>
                </div>

                {/* Weekday Labels */}
                <div className="mb-3 sm:mb-4 grid grid-cols-7 gap-2 sm:gap-3 lg:gap-4">
                    {DAYS_OF_WEEK.map((day) => (
                        <div key={day} className="py-2 sm:py-3 text-center text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg sm:rounded-xl">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-2 sm:gap-3 lg:gap-4 relative min-h-[250px] sm:min-h-[300px]">

                    {days.map((item, i) => {
                        if (!item) return <div key={`empty-${i}`} className="aspect-square bg-slate-50/50 dark:bg-slate-800/20 rounded-lg sm:rounded-xl" />;

                        const { day, dateStr, session, holiday } = item;
                        const dateObj = new Date(year, month, day);
                        const isToday = new Date().toDateString() === dateObj.toDateString();
                        const isWeekend = dateObj.getDay() === 0; // Only Sunday is treated as weekend visually
                        const isFuture = dateObj > new Date();

                        // Calculate balance if session exists
                        const targetMinutes = (user?.expected_hours_per_day || 8) * 60;
                        const balance = session ? (session.totalMinutes - targetMinutes) : 0;
                        const efficiency = session ? Math.min((session.totalMinutes / targetMinutes) * 100, 100) : 0;

                        return (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.005 }}
                                key={dateStr}
                                onClick={() => setSelectedDay(dateStr)}
                                className={cn(
                                    "group relative flex aspect-[1/1] flex-col items-center justify-between rounded-xl sm:rounded-2xl p-2 sm:p-3 transition-all duration-300 overflow-visible",
                                    session
                                        ? "bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:shadow-emerald-900/10 dark:hover:shadow-black/40 hover:-translate-y-1 z-0 hover:z-20"
                                        : holiday
                                            ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 shadow-sm hover:shadow-md"
                                            : isWeekend
                                                ? "bg-slate-50/50 dark:bg-slate-900/30 border border-transparent"
                                                : "bg-white/40 dark:bg-slate-800/40 border border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800",
                                    isToday && "ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-slate-900 z-10"
                                )}
                            >
                                <div className="flex w-full items-start justify-between">
                                    <span className={cn(
                                        "text-xs sm:text-sm font-black",
                                        session || holiday ? "text-slate-700 dark:text-white" : "text-slate-400 dark:text-slate-600",
                                        isToday && "text-primary dark:text-emerald-400",
                                        holiday && !session && "text-amber-600 dark:text-amber-400"
                                    )}>{day}</span>

                                    <div className="flex gap-1">
                                        {holiday && (
                                            <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-amber-500 animate-pulse" title={holiday.localName} />
                                        )}
                                        {session && (
                                            <div className={cn(
                                                "h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full",
                                                balance >= 0 ? "bg-emerald-500" : "bg-amber-500"
                                            )} />
                                        )}
                                    </div>
                                </div>

                                {session ? (
                                    <div className="w-full space-y-0.5 sm:space-y-1">
                                        <div className="flex h-0.5 sm:h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                                            <div
                                                className={cn("h-full rounded-full", balance >= 0 ? "bg-emerald-500" : "bg-amber-500")}
                                                style={{ width: `${efficiency}%` }}
                                            />
                                        </div>
                                        <p className="text-[8px] sm:text-[10px] font-black text-slate-600 dark:text-slate-300 text-center">
                                            {formatHoursMinutes(session.totalMinutes)}
                                        </p>
                                    </div>
                                ) : holiday ? (
                                    <p className="text-[7px] sm:text-[9px] font-black text-amber-600 dark:text-amber-500 text-center leading-tight truncate w-full">
                                        {holiday.localName}
                                    </p>
                                ) : !isFuture && !isWeekend ? (
                                    <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-red-100 dark:bg-red-900/20" />
                                ) : null}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Monthly Highlights Section */}
                {highlights && (
                    <div className="mt-6 sm:mt-8 lg:mt-10 pt-6 sm:pt-8 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-4 sm:mb-6 opacity-60">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Destacados del Mes</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                            <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/30 p-4 sm:p-5 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/20 transition-all">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Mejor Día</span>
                                <div className="flex items-end justify-between">
                                    <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-white capitalize truncate">{highlights.bestDayStr}</p>
                                    <span className="text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">{highlights.bestDayHours}</span>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/30 p-4 sm:p-5 border border-slate-100 dark:border-slate-800 hover:border-blue-500/20 transition-all">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Promedio</span>
                                <div className="flex items-end gap-2">
                                    <p className="text-lg sm:text-xl font-black text-slate-800 dark:text-white">{highlights.avgDaily}</p>
                                    <span className="text-[10px] font-medium text-slate-500 mb-1">/ día</span>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/30 p-4 sm:p-5 border border-slate-100 dark:border-slate-800 hover:border-amber-500/20 transition-all">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Inicio Habitual</span>
                                <div className="flex items-end gap-2">
                                    <p className="text-lg sm:text-xl font-black text-slate-800 dark:text-white">{highlights.typicalStart}</p>
                                    <span className="text-[10px] font-medium text-slate-500 mb-1">hrs</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Monthly Summary Sidebar */}
            <div className="w-full lg:w-96 space-y-4 sm:space-y-6">
                <div className="rounded-[2rem] sm:rounded-[2.5rem] bg-[#1A5235] p-6 sm:p-8 text-white shadow-2xl shadow-emerald-900/20 overflow-hidden relative border border-[#1A5235] dark:border-emerald-800">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#1A5235] dark:bg-emerald-900/50 blur-[60px] opacity-40 pointer-events-none" />

                    <div className="relative z-10">
                        <h3 className="mb-6 sm:mb-8 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Resumen Mensual</h3>

                        <div className="space-y-4 sm:space-y-6">
                            <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white/5 p-4 sm:p-5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                    <span className={cn(
                                        "text-[10px] sm:text-xs font-black px-2 py-1 rounded-lg",
                                        stats.balance >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                                    )}>
                                        {stats.balanceFormatted}
                                    </span>
                                </div>
                                <p className="text-2xl sm:text-3xl font-black tracking-tight">{stats.totalTime}</p>
                                <p className="text-[10px] sm:text-xs font-medium text-slate-400 mt-1">Horas Totales Trabajadas</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div className="rounded-xl sm:rounded-2xl bg-white/5 p-4 sm:p-5 border border-white/5 text-center">
                                    <p className="text-xl sm:text-2xl font-black mb-1">{stats.workedDays}</p>
                                    <p className="text-left font-bold uppercase tracking-widest text-slate-500 text-[10px]">Días</p>
                                </div>
                                <div className="rounded-xl sm:rounded-2xl bg-white/5 p-4 sm:p-5 border border-white/5 text-center">
                                    <p className="text-xl sm:text-2xl font-black mb-1">{stats.totalBreaks}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Pausas</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Rendimiento</p>
                                    <p className="text-base sm:text-lg font-bold">Consistente</p>
                                </div>
                                <Target className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-500 opacity-80" />
                            </div>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((stats.workedDays / 22) * 100, 100)}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-emerald-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-4 sm:mt-6 rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-500/20 bg-emerald-900/20 p-6 sm:p-8 shadow-sm text-white">
                        <h3 className="mb-4 sm:mb-6 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] text-emerald-200/60">Leyenda</h3>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-lg border border-emerald-500/30 bg-white ring-2 ring-emerald-400/20 shadow-sm" />
                                <span className="text-[10px] sm:text-xs font-bold text-emerald-50">Jornada Completada</span>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-lg bg-red-400/20 border border-red-400/30" />
                                <span className="text-[10px] sm:text-xs font-bold text-emerald-50">Ausencia</span>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-lg bg-emerald-900/40 opacity-60 border border-emerald-500/20" />
                                <span className="text-[10px] sm:text-xs font-bold text-emerald-50">No Laborable</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DayDetailModal
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                session={selectedSession}
            />
        </div>
    );
}

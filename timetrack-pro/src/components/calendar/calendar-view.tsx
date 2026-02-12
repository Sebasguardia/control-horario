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
} from "lucide-react";
import { Dispatch, SetStateAction, useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const DAYS_OF_WEEK = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

interface CalendarViewProps {
    currentDate: Date;
    setCurrentDate: Dispatch<SetStateAction<Date>>;
    setSelectedDay: Dispatch<SetStateAction<string | null>>;
}

interface SessionData {
    date: string;
    startTime: string;
    endTime: string | null;
    totalMinutes: number;
    breakMinutes: number;
}

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday = 0
}

export function CalendarView({ currentDate, setCurrentDate, setSelectedDay }: CalendarViewProps) {
    const [sessions, setSessions] = useState<SessionData[]>([]);
    const [expectedHours, setExpectedHours] = useState(8);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const supabase = createClient();

            // Get user data
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: userData } = await supabase
                .from('users')
                .select('expected_hours_per_day')
                .eq('id', user.id)
                .single();

            if (userData) {
                setExpectedHours((userData as any).expected_hours_per_day || 8);
            }

            // Get sessions for the current month
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0);

            const { data: sessionsData } = await supabase
                .from('v_daily_stats')
                .select('*')
                .eq('user_id', user.id)
                .gte('work_date', startDate.toISOString().split('T')[0])
                .lte('work_date', endDate.toISOString().split('T')[0]);

            if (sessionsData) {
                const formattedSessions = sessionsData.map((s: any) => ({
                    date: s.work_date,
                    startTime: s.first_entry || '00:00',
                    endTime: s.last_exit || null,
                    totalMinutes: s.net_work_minutes || 0,
                    breakMinutes: s.total_break_minutes || 0,
                }));
                setSessions(formattedSessions);
            }
            setLoading(false);
        };

        loadData();
    }, [year, month]);

    // Map sessions for easy access
    const sessionsMap = useMemo(() => {
        const map: Record<string, SessionData> = {};
        sessions.forEach(s => {
            map[s.date] = s;
        });
        return map;
    }, [sessions]);

    const days = useMemo(() => {
        const result = [];
        for (let i = 0; i < firstDay; i++) {
            result.push(null);
        }
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const session = sessionsMap[dateStr];
            result.push({ day: d, dateStr, session });
        }
        return result;
    }, [year, month, daysInMonth, firstDay, sessionsMap]);

    // Monthly stats for the current month view
    const stats = useMemo(() => {
        const totalMinutes = sessions.reduce((acc, s) => acc + (s.totalMinutes || 0), 0);
        const totalBreaks = sessions.reduce((acc, s) => acc + (s.breakMinutes || 0), 0);
        const expectedMinutes = sessions.length * (expectedHours * 60);
        const balance = totalMinutes - expectedMinutes;

        return {
            workedDays: sessions.length,
            totalTime: formatHoursMinutes(totalMinutes),
            totalBreaks: `${totalBreaks}m`,
            balance: balance,
            balanceFormatted: `${balance >= 0 ? '+' : ''}${formatHoursMinutes(Math.abs(balance))}`
        };
    }, [sessions, expectedHours]);

    // Calculate monthly highlights from existing data
    const highlights = useMemo(() => {
        if (!sessions.length) return null;

        const maxMinutes = Math.max(...sessions.map(s => s.totalMinutes));
        const bestDay = days.find(d => d?.session?.totalMinutes === maxMinutes);

        const avgMinutes = sessions.reduce((acc, s) => acc + s.totalMinutes, 0) / sessions.length;

        // Simple frequency map for start times to find "typical" start
        const startTimes = sessions.map(s => s.startTime);
        const modeStartTime = startTimes.sort((a, b) =>
            startTimes.filter(v => v === a).length - startTimes.filter(v => v === b).length
        ).pop();

        return {
            bestDayStr: bestDay ? new Date(bestDay.dateStr).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' }) : '-',
            bestDayHours: formatHoursMinutes(maxMinutes),
            avgDaily: formatHoursMinutes(avgMinutes),
            typicalStart: modeStartTime || '-'
        };
    }, [days, sessions]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 lg:flex-row">
            {/* Calendar Main Section */}
            <div className="flex-1 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
                {/* Header */}
                <div className="relative mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-5">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                            <span className="text-2xl font-black tracking-tighter">{currentDate.getDate()}</span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black capitalize text-slate-900 dark:text-white tracking-tight leading-none mb-1">{monthName}</h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 capitalize">{year}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                        <button
                            onClick={prevMonth}
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white hover:shadow-sm transition-all active:scale-95"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />
                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="px-4 h-10 flex items-center justify-center rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all active:scale-95"
                        >
                            Hoy
                        </button>
                        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />
                        <button
                            onClick={nextMonth}
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white hover:shadow-sm transition-all active:scale-95"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Weekday Labels */}
                <div className="mb-4 grid grid-cols-7 gap-3 sm:gap-4">
                    {DAYS_OF_WEEK.map((day) => (
                        <div key={day} className="py-3 text-center text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-3 sm:gap-4">
                    {days.map((item, i) => {
                        if (!item) return <div key={`empty-${i}`} className="aspect-square bg-slate-50/50 dark:bg-slate-800/20 rounded-xl" />;

                        const { day, dateStr, session } = item;
                        const dateObj = new Date(dateStr);
                        const isToday = new Date().toDateString() === dateObj.toDateString();
                        const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
                        const isFuture = dateObj > new Date();

                        // Calculate balance if session exists
                        const targetMinutes = expectedHours * 60;
                        const balance = session ? (session.totalMinutes - targetMinutes) : 0;
                        const efficiency = session ? Math.min((session.totalMinutes / targetMinutes) * 100, 100) : 0;

                        return (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.005 }}
                                key={dateStr}
                                onClick={() => session && setSelectedDay(dateStr)}
                                disabled={!session}
                                className={cn(
                                    "group relative flex aspect-[1/1] flex-col items-center justify-between rounded-2xl p-3 transition-all duration-300 overflow-visible",
                                    session
                                        ? "bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:shadow-emerald-900/10 dark:hover:shadow-black/40 hover:-translate-y-1 z-0 hover:z-20"
                                        : isWeekend
                                            ? "bg-slate-50/50 dark:bg-slate-900/30 border border-transparent"
                                            : "bg-white/40 dark:bg-slate-800/40 border border-slate-50 dark:border-slate-800/50",
                                    isToday && "ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-slate-900 z-10"
                                )}
                            >
                                <div className="flex w-full items-start justify-between">
                                    <span className={cn(
                                        "text-sm font-black",
                                        session ? "text-slate-700 dark:text-white" : "text-slate-400 dark:text-slate-600",
                                        isToday && "text-primary dark:text-emerald-400"
                                    )}>{day}</span>

                                    {session && (
                                        <div className={cn(
                                            "h-2 w-2 rounded-full",
                                            balance >= 0 ? "bg-emerald-500" : "bg-amber-500"
                                        )} />
                                    )}
                                </div>

                                {session ? (
                                    <div className="w-full space-y-1">
                                        <div className="flex h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                                            <div
                                                className={cn("h-full rounded-full", balance >= 0 ? "bg-emerald-500" : "bg-amber-500")}
                                                style={{ width: `${efficiency}%` }}
                                            />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-600 dark:text-slate-300 text-center">
                                            {formatHoursMinutes(session.totalMinutes)}
                                        </p>
                                    </div>
                                ) : !isFuture && !isWeekend ? (
                                    <div className="h-1.5 w-1.5 rounded-full bg-red-100 dark:bg-red-900/20" />
                                ) : null}

                                {/* Enhanced Tooltip */}
                                {session && (
                                    <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-48 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 translate-y-2 group-hover:translate-y-0">
                                        <div className="rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 shadow-xl text-left">
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">
                                                {dateObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}
                                            </p>
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-2xl font-black tracking-tighter">
                                                    {formatHoursMinutes(session.totalMinutes)}
                                                </span>
                                                <span className={cn(
                                                    "text-xs font-bold px-2 py-0.5 rounded-md",
                                                    balance >= 0 ? "bg-emerald-500/20 text-emerald-300 dark:text-emerald-600" : "bg-amber-500/20 text-amber-300 dark:text-amber-600"
                                                )}>
                                                    {balance >= 0 ? '+' : ''}{formatHoursMinutes(balance)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-medium opacity-80">
                                                <Clock className="h-3 w-3" />
                                                {session.startTime} - {session.endTime}
                                            </div>
                                            {session.breakMinutes > 0 && (
                                                <div className="flex items-center gap-2 text-xs font-medium opacity-80 mt-1">
                                                    <Coffee className="h-3 w-3" />
                                                    {session.breakMinutes}m pausa
                                                </div>
                                            )}

                                            {/* Arrow */}
                                            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 h-3 w-3 bg-slate-900 dark:bg-white rotate-45" />
                                        </div>
                                    </div>
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Monthly Highlights Section */}
                {highlights && (
                    <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-6 opacity-60">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Destacados del Mes</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="group relative overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800/30 p-5 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/20 transition-all">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Mejor Día</span>
                                <div className="flex items-end justify-between">
                                    <p className="text-sm font-black text-slate-800 dark:text-white capitalize truncate">{highlights.bestDayStr}</p>
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">{highlights.bestDayHours}</span>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800/30 p-5 border border-slate-100 dark:border-slate-800 hover:border-blue-500/20 transition-all">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Promedio</span>
                                <div className="flex items-end gap-2">
                                    <p className="text-xl font-black text-slate-800 dark:text-white">{highlights.avgDaily}</p>
                                    <span className="text-[10px] font-medium text-slate-500 mb-1">/ día</span>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800/30 p-5 border border-slate-100 dark:border-slate-800 hover:border-amber-500/20 transition-all">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Inicio Habitual</span>
                                <div className="flex items-end gap-2">
                                    <p className="text-xl font-black text-slate-800 dark:text-white">{highlights.typicalStart}</p>
                                    <span className="text-[10px] font-medium text-slate-500 mb-1">hrs</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Monthly Summary Sidebar */}
            <div className="w-full lg:w-96 space-y-6">
                <div className="rounded-[2.5rem] bg-[#1A5235] p-8 text-white shadow-2xl shadow-emerald-900/20 overflow-hidden relative border border-[#1A5235] dark:border-emerald-800">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#1A5235] dark:bg-emerald-900/50 blur-[60px] opacity-40 pointer-events-none" />

                    <div className="relative z-10">
                        <h3 className="mb-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Resumen Mensual</h3>

                        <div className="space-y-6">
                            <div className="group relative overflow-hidden rounded-2xl bg-white/5 p-5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                        <TrendingUp className="h-5 w-5" />
                                    </div>
                                    <span className={cn(
                                        "text-xs font-black px-2 py-1 rounded-lg",
                                        stats.balance >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                                    )}>
                                        {stats.balanceFormatted}
                                    </span>
                                </div>
                                <p className="text-3xl font-black tracking-tight">{stats.totalTime}</p>
                                <p className="text-xs font-medium text-slate-400 mt-1">Horas Totales Trabajadas</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-2xl bg-white/5 p-5 border border-white/5 text-center">
                                    <p className="text-2xl font-black mb-1">{stats.workedDays}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Días</p>
                                </div>
                                <div className="rounded-2xl bg-white/5 p-5 border border-white/5 text-center">
                                    <p className="text-2xl font-black mb-1">{stats.totalBreaks}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Pausas</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/10">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Rendimiento</p>
                                    <p className="text-lg font-bold">Consistente</p>
                                </div>
                                <Target className="h-8 w-8 text-emerald-500 opacity-80" />
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
                    <div className="mt-6 rounded-[2rem] border border-emerald-500/20 bg-emerald-900/20 p-8 shadow-sm text-white">
                        <h3 className="mb-6 text-[11px] font-black uppercase tracking-[0.25em] text-emerald-200/60">Leyenda</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-5 w-5 rounded-lg border border-emerald-500/30 bg-white ring-2 ring-emerald-400/20 shadow-sm" />
                                <span className="text-xs font-bold text-emerald-50">Jornada Completada</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-5 w-5 rounded-lg bg-red-400/20 border border-red-400/30" />
                                <span className="text-xs font-bold text-emerald-50">Ausencia</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-5 w-5 rounded-lg bg-emerald-900/40 opacity-60 border border-emerald-500/20" />
                                <span className="text-xs font-bold text-emerald-50">No Laborable</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

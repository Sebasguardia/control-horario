"use client";

import { useTimer } from "@/hooks/use-timer";
import { formatTime, cn } from "@/lib/utils";
import { Play, Square, Coffee, Clock, Utensils, Moon } from "lucide-react";
import { motion } from "framer-motion";


import { mockUser } from "@/mocks/mock-data";
import { useNotification } from "@/contexts/notification-context";

export default function TimeTracker() {
    const {
        seconds,
        breakSeconds,
        status,
        startSession,
        stopSession,
        startBreak,
        endBreak
    } = useTimer();

    const { addNotification } = useNotification();

    const handleStart = () => {
        startSession();
        addNotification("Jornada Iniciada", "¡Buena suerte con tu trabajo!", "success");
    };

    const handleStop = () => {
        stopSession();

        // Early Exit Check
        const now = new Date();
        const [endHour, endMinute] = mockUser.schedule.end.split(':').map(Number);
        const scheduleEnd = new Date(now);
        scheduleEnd.setHours(endHour, endMinute, 0, 0);

        if (now < scheduleEnd) {
            addNotification(
                "Salida Anticipada",
                `Has finalizado tu jornada a las ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, antes de tu hora de salida programada (${mockUser.schedule.end}).`,
                "warning"
            );
        } else {
            addNotification("Jornada Finalizada", "Tu registro ha sido guardado correctamente.", "success");
        }
    };

    const handleBreakToggle = (type: string) => {
        if (status === 'break') {
            endBreak();
            addNotification("Trabajo Reanudado", "Has vuelto de tu pausa.", "success");
        } else {
            startBreak(type);
            addNotification("Pausa Iniciada", `Pausa de ${type.toLowerCase()} en curso. Disfruta tu descanso.`, "info");
        }
    };

    return (
        <div className="relative h-[450px] flex flex-col justify-center overflow-hidden rounded-[1.5rem] bg-white dark:bg-slate-900 px-8 py-12 text-slate-800 dark:text-white shadow-sm border border-slate-50 dark:border-slate-800 transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50">
            <div className="relative z-10 flex flex-col items-center">
                {/* Header */}
                <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-6">
                    Control de Jornada
                </h3>

                {/* Status Pill */}
                <div className={cn(
                    "mb-8 flex items-center gap-2 rounded-full px-5 py-2 text-[11px] font-black uppercase tracking-wider transition-all border",
                    status === 'running' ? "bg-green-50/50 dark:bg-emerald-900/20 text-primary dark:text-emerald-400 border-green-100 dark:border-emerald-900/50" :
                        status === 'break' ? "bg-amber-50/50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50" :
                            "bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800"
                )}>
                    <div className={cn(
                        "h-2 w-2 rounded-full",
                        status === 'running' ? "bg-primary dark:bg-emerald-400 animate-pulse" :
                            status === 'break' ? "bg-amber-500 dark:bg-amber-400" :
                                "bg-slate-300 dark:bg-slate-600"
                    )} />
                    {status === 'idle' ? "Inactivo" : status === 'break' ? "En Pausa" : "En Marcha"}
                </div>

                {/* Main Timer */}
                <div className="flex flex-col items-center mb-4">
                    <span className="text-7xl font-black tabular-nums tracking-tighter text-[#1A202C] dark:text-white drop-shadow-sm">
                        {formatTime(seconds)}
                    </span>
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500">
                        <Clock className="h-4 w-4 opacity-50" />
                        <span className="uppercase tracking-[0.1em]">Pausas:</span>
                        <span className="text-slate-500 dark:text-slate-400 font-black">{formatTime(breakSeconds)}</span>
                    </div>
                </div>

                {/* Controls Area */}
                <div className="mt-10 w-full max-w-sm space-y-4">
                    {status === 'idle' ? (
                        <button
                            onClick={handleStart}
                            className="group flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#1A5235] px-10 text-[15px] font-black text-white shadow-xl shadow-primary/20 dark:shadow-primary/10 transition-all hover:bg-emerald-900 hover:-translate-y-1 active:scale-95"
                        >
                            <Play className="h-5 w-5 fill-current" />
                            Iniciar Jornada
                        </button>
                    ) : (
                        <>
                            {/* Break Options Grid */}
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    onClick={() => handleBreakToggle('Almuerzo')}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-2 rounded-2xl py-4 transition-all active:scale-95 border",
                                        status === 'break'
                                            ? "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 opacity-50"
                                            : "bg-primary/5 dark:bg-emerald-900/10 border-transparent text-primary dark:text-emerald-400 hover:bg-primary/10 dark:hover:bg-emerald-900/20"
                                    )}
                                    disabled={status === 'break'}
                                >
                                    <Utensils className="h-5 w-5" />
                                    <span className="text-[9px] font-black uppercase tracking-wider">Comida</span>
                                </button>
                                <button
                                    onClick={() => handleBreakToggle('Descanso')}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-2 rounded-2xl py-4 transition-all active:scale-95 border",
                                        status === 'break'
                                            ? "bg-amber-500 dark:bg-amber-600 border-amber-500 dark:border-amber-600 text-white shadow-lg shadow-amber-200 dark:shadow-none"
                                            : "bg-primary/5 dark:bg-emerald-900/10 border-transparent text-primary dark:text-emerald-400 hover:bg-primary/10 dark:hover:bg-emerald-900/20"
                                    )}
                                >
                                    {status === 'break' ? <Play className="h-5 w-5 fill-current" /> : <Coffee className="h-5 w-5" />}
                                    <span className="text-[9px] font-black uppercase tracking-wider">
                                        {status === 'break' ? "Reanudar" : "Descanso"}
                                    </span>
                                </button>
                                <button
                                    onClick={() => handleBreakToggle('Personal')}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-2 rounded-2xl py-4 transition-all active:scale-95 border",
                                        status === 'break'
                                            ? "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 opacity-50"
                                            : "bg-primary/5 dark:bg-emerald-900/10 border-transparent text-primary dark:text-emerald-400 hover:bg-primary/10 dark:hover:bg-emerald-900/20"
                                    )}
                                    disabled={status === 'break'}
                                >
                                    <Moon className="h-5 w-5" />
                                    <span className="text-[9px] font-black uppercase tracking-wider">Otra</span>
                                </button>
                            </div>

                            {/* Finish Button */}
                            <button
                                onClick={handleStop}
                                className="flex h-16 w-full items-center justify-center gap-3 rounded-full bg-red-500 dark:bg-red-600 px-8 text-[15px] font-black text-white shadow-xl shadow-red-200 dark:shadow-red-900/20 transition-all hover:bg-red-600 dark:hover:bg-red-700 hover:-translate-y-1 active:scale-95"
                            >
                                <Square className="h-5 w-5 fill-current" />
                                Finalizar Jornada
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

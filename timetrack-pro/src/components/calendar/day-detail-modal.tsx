"use client";

import { X, CheckCircle2, Clock, Coffee, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Modal } from "@/components/ui/modal";
import { formatHoursMinutes, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useUserStore } from "@/stores/user-store";

interface DayDetailModalProps {
    selectedDay: string | null;
    setSelectedDay: Dispatch<SetStateAction<string | null>>;
    session: any | null; // Using any for now to match Session type, ideally should be WorkSession
}

export function DayDetailModal({ selectedDay, setSelectedDay, session }: DayDetailModalProps) {
    const user = useUserStore(state => state.user);

    if (!selectedDay) return null;

    const dateObj = new Date(selectedDay);
    const targetMinutes = (user?.expected_hours_per_day || 8) * 60;
    const netMinutes = session?.totalMinutes || 0;
    const diff = netMinutes - targetMinutes;
    const progress = Math.min(Math.round((netMinutes / targetMinutes) * 100), 100);

    return (
        <Modal
            isOpen={!!selectedDay}
            onClose={() => setSelectedDay(null)}
            title="Detalle del Día"
        >
            <div className="space-y-6">
                {/* Header Card */}
                <div className={cn(
                    "flex items-center gap-5 rounded-[2.5rem] p-8 border transition-colors relative overflow-hidden",
                    session
                        ? "bg-[#1A5235]/5 dark:bg-emerald-900/20 border-[#1A5235]/10 dark:border-emerald-900/30"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700"
                )}>
                    {session ? (
                        <div className="absolute top-0 right-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-[#1A5235]/10 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />
                    ) : null}

                    <div className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-3xl shrink-0 shadow-xl z-10",
                        session
                            ? "bg-[#1A5235] dark:bg-emerald-600 text-white shadow-[#1A5235]/20 dark:shadow-emerald-900/20"
                            : "bg-white dark:bg-slate-700 text-slate-300 dark:text-slate-500 shadow-slate-200 dark:shadow-none"
                    )}>
                        {session ? <CheckCircle2 className="h-8 w-8" /> : <Calendar className="h-8 w-8" />}
                    </div>
                    <div className="z-10">
                        <p className={cn(
                            "text-[10px] font-black uppercase tracking-[0.2em] mb-1",
                            session ? "text-[#1A5235]/60 dark:text-emerald-400/60" : "text-slate-400 dark:text-slate-500"
                        )}>
                            {session ? "Jornada Registrada" : "Sin Actividad"}
                        </p>
                        <p className="text-xl font-black text-slate-800 dark:text-white capitalize leading-tight">
                            {dateObj.toLocaleDateString("es-ES", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                            })}
                        </p>
                    </div>
                </div>

                {session ? (
                    <div className="grid grid-cols-2 gap-5">
                        <div className="rounded-[2rem] border border-slate-100 dark:border-slate-700 p-6 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3">Entrada/Salida</p>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                                <p className="text-sm font-black text-slate-800 dark:text-slate-200">{session.startTime} — {session.endTime}</p>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-[#1A5235]/10 dark:border-emerald-500/20 p-6 bg-[#1A5235]/10 dark:bg-emerald-900/20 shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A5235]/60 dark:text-emerald-400/60 mb-3">Tiempo Total</p>
                            <p className="text-2xl font-black text-[#1A5235] dark:text-emerald-400 tracking-tight">
                                {formatHoursMinutes(netMinutes)}
                            </p>
                        </div>

                        <div className="rounded-[2rem] border border-amber-100 dark:border-amber-900/30 p-6 bg-amber-50/50 dark:bg-amber-900/10">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600/60 dark:text-amber-400/60 mb-3">Pausas</p>
                            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                <Coffee className="h-4 w-4" />
                                <p className="text-lg font-black">{session.breakMinutes} min</p>
                            </div>
                        </div>

                        <div className={cn(
                            "rounded-[2rem] border p-6 transition-all",
                            diff >= 0 ? "bg-emerald-50/30 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/30" : "bg-red-50/30 border-red-100 dark:bg-red-900/10 dark:border-red-900/20"
                        )}>
                            <p className={cn(
                                "text-[10px] font-black uppercase tracking-[0.2em] mb-3",
                                diff >= 0 ? "text-emerald-600/60 dark:text-emerald-400/60" : "text-red-500/60 dark:text-red-400/60"
                            )}>Balance</p>
                            <div className={cn(
                                "text-lg font-black flex items-center gap-1",
                                diff >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
                            )}>
                                <TrendingUp className={cn("h-4 w-4", diff < 0 && "rotate-180")} />
                                {diff >= 0 ? '+' : '-'}{formatHoursMinutes(Math.abs(diff))}
                            </div>
                        </div>

                        <div className="col-span-2 rounded-[2.5rem] bg-[#1A202C] dark:bg-black p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-[#1A5235] dark:bg-emerald-900 blur-3xl opacity-30 pointer-events-none" />

                            <div className="relative z-10 flex justify-between items-end mb-6">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Cumplimiento diario</p>
                                    <p className="text-3xl font-black tracking-tighter">{progress}% <span className="text-sm font-bold opacity-40 align-top">/ 100%</span></p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <Target className="h-5 w-5 text-[#48BB78]" />
                                </div>
                            </div>

                            <div className="relative z-10 h-3 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-[#48BB78] shadow-[0_0_15px_rgba(72,187,120,0.5)]"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 opacity-40">
                        <AlertCircle className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Sin registros para este día</p>
                    </div>
                )}

                <button
                    onClick={() => setSelectedDay(null)}
                    className="w-full rounded-[1.25rem] bg-slate-100 dark:bg-slate-800 py-5 text-xs font-black text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-all uppercase tracking-[0.2em]"
                >
                    Cerrar
                </button>
            </div>
        </Modal>
    );
}

// Subcomponent for Target icon
function Target({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    )
}

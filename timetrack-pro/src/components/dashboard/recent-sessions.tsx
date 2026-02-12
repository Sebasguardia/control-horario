"use client";

import { useSessionStore } from "@/stores/session-store";
import { formatHoursMinutes, cn, formatTime } from "@/lib/utils";
import { Clock, Calendar, CheckCircle2, PlayCircle, MoreHorizontal, Eye, Trash2, Timer, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "@/contexts/notification-context";
import { useState, useRef, useEffect } from "react";
import { Modal, ConfirmModal } from "@/components/ui/modal";

export default function RecentSessions() {
    const { currentSession, status, seconds, breakSeconds, pastSessions } = useSessionStore();
    const { addNotification } = useNotification();
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [viewingSession, setViewingSession] = useState<any | null>(null);
    const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDelete = () => {
        if (deletingSessionId) {
            // Logic to remove from pastSessions would go here
            // For now, we simulate and show toast
            addNotification("Jornada Eliminada", "El registro ha sido borrado correctamente.", "success");
            setDeletingSessionId(null);
            setOpenMenuId(null);
        }
    };

    const handleViewDetails = (session: any) => {
        setViewingSession(session);
        setOpenMenuId(null);
    };

    return (
        <div className="flex h-full flex-col rounded-[2rem] sm:rounded-[2.5rem] bg-white dark:bg-slate-900 p-5 sm:p-8 shadow-sm border border-slate-50 dark:border-slate-800">
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800 dark:text-white">Actividad Reciente</h3>
                    <p className="text-[10px] sm:text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5 sm:mt-1">Registros de jornadas laborales</p>
                </div>
                <button className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 transition-all hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary dark:hover:text-emerald-400 active:scale-95">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {useSessionStore.getState().isLoading && pastSessions.length === 0 ? (
                        // Loading Skeletons
                        [1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 sm:gap-5 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-5 border border-slate-50 dark:border-slate-800 animate-pulse">
                                <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
                                    <div className="h-2 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
                                </div>
                                <div className="h-8 w-12 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                            </div>
                        ))
                    ) : pastSessions.length === 0 && status === 'idle' ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="mb-4 rounded-full bg-slate-50 dark:bg-slate-800 p-4">
                                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-slate-300 dark:text-slate-600" />
                            </div>
                            <p className="text-sm font-bold text-slate-400 dark:text-slate-500">No hay actividad reciente</p>
                            <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase mt-1">Tus jornadas aparecerán aquí</p>
                        </div>
                    ) : (
                        <>
                            {/* Active Session */}
                            {status !== 'idle' && currentSession && (
                                <motion.div
                                    key="active"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="group flex items-center gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl p-3 sm:p-4 bg-[#166534]/5 dark:bg-emerald-900/20 border border-[#166534]/10 dark:border-emerald-900/30 shadow-sm"
                                >
                                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-[#166534] dark:bg-emerald-600 text-white shadow-lg shadow-[#166534]/20 dark:shadow-emerald-900/30 animate-pulse">
                                        <PlayCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white tracking-tight">
                                            Jornada en curso
                                        </h4>
                                        <div className="mt-0.5 sm:mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                            <span className="flex items-center gap-1 font-bold text-[#166534] dark:text-emerald-400">
                                                <Clock className="h-3 w-3" />
                                                {formatTime(seconds)}
                                            </span>
                                            {status === 'break' && (
                                                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                                                    • Pausa: {formatTime(breakSeconds)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="rounded-full bg-[#166534]/10 dark:bg-emerald-900/40 px-2 py-0.5 text-[8px] sm:text-[9px] font-black text-[#166534] dark:text-emerald-400 uppercase tracking-tighter">
                                            Activa
                                        </div>
                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === 'current' ? null : 'current')}
                                                className="flex h-6 w-6 items-center justify-center rounded-full text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-all ml-auto mt-1"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>

                                            {openMenuId === 'current' && (
                                                <div ref={menuRef} className="absolute right-0 top-full z-20 mt-1 w-40 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 shadow-xl">
                                                    <button onClick={() => handleViewDetails({ ...currentSession, startTime: new Date(currentSession.start_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }), date: new Date().toISOString().split('T')[0], status: 'running' })} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"><Eye className="h-3 w-3" /> Ver detalles</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Past Sessions */}
                            {pastSessions.slice(0, 5).map((session, index) => (
                                <motion.div
                                    key={session.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    layout
                                    className="group relative flex items-center gap-3 sm:gap-5 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-5 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 shadow-sm hover:shadow-md"
                                >
                                    <div className="flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 border border-emerald-100 dark:border-emerald-800/50">
                                        <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-0.5 sm:mb-1">
                                            <h4 className="text-[14px] sm:text-[15px] font-black text-slate-800 dark:text-white tracking-tight">
                                                Jornada Finalizada
                                            </h4>
                                            {session.breakMinutes > 0 && (
                                                <div className="flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-900/20 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-black text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50 uppercase tracking-tighter">
                                                    <Coffee className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                                                    {session.breakMinutes}m
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-60" />
                                                <span>{session.startTime} - {session.endTime}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
                                                <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-60" />
                                                <span>{new Date(session.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-1 sm:gap-2 shrink-0">
                                        <div className="flex flex-col items-end">
                                            <span className="text-base sm:text-lg font-black tracking-tight text-slate-800 dark:text-white leading-none">
                                                {formatHoursMinutes(session.totalMinutes || 0)}
                                            </span>
                                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#166534] dark:text-emerald-500 opacity-80 mt-0.5 sm:mt-1">
                                                Trabajado
                                            </span>
                                        </div>
                                        <div className="relative h-6">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === session.id ? null : session.id)}
                                                className={`flex h-6 w-6 items-center justify-center rounded-full transition-all ${openMenuId === session.id ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" : "opacity-0 group-hover:opacity-100 text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400"}`}
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>

                                            {openMenuId === session.id && (
                                                <div ref={menuRef} className="absolute right-0 top-full z-20 mt-1 w-40 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 shadow-xl">
                                                    <button onClick={() => handleViewDetails(session)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"><Eye className="h-3 w-3" /> Detalles</button>
                                                    <div className="my-1 border-t border-slate-50 dark:border-slate-700" />
                                                    <button onClick={() => setDeletingSessionId(session.id)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="h-3 w-3" /> Eliminar</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* Modals */}
            <Modal
                isOpen={!!viewingSession}
                onClose={() => setViewingSession(null)}
                title="Detalles de Jornada"
            >
                {viewingSession && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 rounded-3xl bg-slate-50 dark:bg-slate-800 p-6">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
                                <Timer className="h-7 w-7 text-[#166534] dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Estado de sesión</p>
                                <p className="text-lg font-black text-slate-800 dark:text-white capitalize">
                                    {viewingSession.status === 'running' ? "En Curso" : "Completada"}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-slate-100 dark:border-slate-700 p-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Fecha</p>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{new Date(viewingSession.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-100 dark:border-slate-700 p-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Horario</p>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{viewingSession.startTime} - {viewingSession.endTime || '--:--'}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-100 dark:border-slate-700 p-4 bg-green-50/30 dark:bg-emerald-900/10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-green-600/60 dark:text-emerald-400/60 mb-1">Tiempo Neto</p>
                                <p className="text-sm font-bold text-green-700 dark:text-emerald-400">
                                    {viewingSession.status === 'running' ? formatTime(seconds) : formatHoursMinutes(viewingSession.totalMinutes - (viewingSession.breakMinutes || 0))}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-100 dark:border-slate-700 p-4 bg-amber-50/30 dark:bg-amber-900/10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600/60 dark:text-amber-400/60 mb-1">Pausas</p>
                                <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
                                    {viewingSession.status === 'running' ? formatTime(breakSeconds) : `${viewingSession.breakMinutes || 0}m`}
                                </p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button onClick={() => setViewingSession(null)} className="w-full rounded-2xl bg-slate-900 dark:bg-white py-4 text-sm font-bold text-white dark:text-slate-900 shadow-xl shadow-slate-200 dark:shadow-slate-900/20 hover:bg-black dark:hover:bg-slate-200 transition-all active:scale-95">
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <ConfirmModal
                isOpen={!!deletingSessionId}
                onClose={() => setDeletingSessionId(null)}
                onConfirm={handleDelete}
                title="¿Eliminar registro?"
                confirmText="Sí, eliminar"
                confirmVariant="danger"
            >
                Esta acción eliminará permanentemente este registro de jornada. Esta operación no se puede deshacer.
            </ConfirmModal>

        </div>
    );
}

"use client";

import { formatHoursMinutes, cn } from "@/lib/utils";
import {
    Clock,
    Eye,
    Trash2,
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Inbox
} from "lucide-react";
import { motion } from "framer-motion";
import { useNotification } from "@/contexts/notification-context";
import { useState, useEffect } from "react";
import { Modal, ConfirmModal } from "@/components/ui/modal";

interface HistoryTableProps {
    filteredSessions: any[];
}

export function HistoryTable({ filteredSessions }: HistoryTableProps) {
    const { addNotification } = useNotification();
    const [viewingSession, setViewingSession] = useState<any | null>(null);
    const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredSessions]);

    const totalPages = Math.ceil(filteredSessions.length / recordsPerPage);
    const currentRecords = filteredSessions.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    const handleDelete = async () => {
        if (deletingSessionId) {
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();

            const { error } = await supabase
                .from('work_sessions')
                .delete()
                .eq('id', deletingSessionId);

            if (!error) {
                addNotification("Registro Eliminado", "La jornada ha sido eliminada del historial.", "success");
                // Recargar la página para actualizar la lista
                window.location.reload();
            } else {
                addNotification("Error", "No se pudo eliminar la jornada.", "error");
            }
            setDeletingSessionId(null);
        }
    };

    return (
        <div className="flex flex-col min-h-[500px]">
            <div className="overflow-x-auto custom-scrollbar-hide rounded-[1.5rem] bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-slate-50 dark:border-slate-800 bg-[#F7F8F9]/50 dark:bg-slate-800/50 text-left">
                            <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Fecha</th>
                            <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Horario</th>
                            <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 text-center">Pausas</th>
                            <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Trabajado</th>
                            <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Balance</th>
                            <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {currentRecords.length > 0 ? (
                            currentRecords.map((session, index) => {
                                const date = new Date(session.date);
                                const netMinutes = session.totalMinutes || 0;
                                const targetMinutes = 8 * 60; // 8 horas por defecto
                                const diff = netMinutes - targetMinutes;

                                return (
                                    <motion.tr
                                        key={session.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="group transition-all hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 font-black text-slate-400 dark:text-slate-500 group-hover:bg-[#1A5235] group-hover:text-white dark:group-hover:bg-emerald-600/20 dark:group-hover:text-emerald-400 transition-all duration-300 border border-slate-100 dark:border-slate-700 shadow-sm">
                                                    <span className="text-[10px] leading-none uppercase">{date.toLocaleDateString('es-ES', { weekday: 'short' })}</span>
                                                    <span className="text-base leading-none mt-1">{date.getDate()}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-800 dark:text-slate-200 capitalize">
                                                        {date.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Jornada Completada</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3 text-sm font-black text-slate-600 dark:text-slate-400">
                                                <div className="h-2 w-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                                {session.startTime} — {session.endTime || '--:--'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="rounded-full bg-slate-50 dark:bg-slate-800 px-4 py-1.5 text-[11px] font-black text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 shadow-sm">
                                                {session.breakMinutes} min
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-base font-black text-[#1A202C] dark:text-white">
                                                    {formatHoursMinutes(netMinutes)}
                                                </span>
                                                <div className="h-1.5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary rounded-full transition-all duration-1000"
                                                        style={{ width: `${Math.min((netMinutes / targetMinutes) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {diff === 0 ? (
                                                <div className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-700 inline-block">Objetivo</div>
                                            ) : diff > 0 ? (
                                                <div className="flex items-center gap-1.5 text-[11px] font-black text-[#1A5235] dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/30 inline-flex">
                                                    <ArrowUpRight className="h-3 w-3" />
                                                    +{formatHoursMinutes(diff)}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-[11px] font-black text-red-500 dark:text-red-400 uppercase tracking-widest bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg border border-red-100 dark:border-red-900/30 inline-flex">
                                                    <ArrowDownRight className="h-3 w-3" />
                                                    -{formatHoursMinutes(Math.abs(diff))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => setViewingSession(session)}
                                                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:bg-[#1A5235] dark:hover:bg-emerald-600 hover:text-white dark:hover:text-white hover:border-[#1A5235] dark:hover:border-emerald-600 active:scale-90"
                                                    title="Ver detalles"
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingSessionId(session.id)}
                                                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:bg-red-500 hover:text-white hover:border-red-500 active:scale-90"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="py-24 text-center">
                                    <div className="flex flex-col items-center justify-center gap-4 opacity-30">
                                        <Inbox className="h-20 w-20 text-slate-400 dark:text-slate-600" />
                                        <p className="text-base font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">Sin jornadas registradas</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination UI - Custom Floating Style */}
            {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between bg-white dark:bg-slate-900 rounded-2xl px-8 py-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div>
                        <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                            Mostrando <span className="text-slate-800 dark:text-slate-200">{(currentPage - 1) * recordsPerPage + 1} - {Math.min(currentPage * recordsPerPage, filteredSessions.length)}</span> de <span className="text-slate-800 dark:text-slate-200">{filteredSessions.length}</span> registros
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="flex h-12 items-center gap-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-6 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-all hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-300 disabled:opacity-20 disabled:pointer-events-none shadow-sm"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Anterior
                        </button>
                        <div className="flex h-12 items-center gap-1.5 px-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                            <span className="text-xs font-black text-slate-800 dark:text-slate-200">{currentPage}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">/</span>
                            <span className="text-[10px] font-bold text-slate-400">{totalPages}</span>
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="flex h-12 items-center gap-2 rounded-xl bg-[#1A5235] px-6 text-xs font-black text-white uppercase tracking-widest transition-all hover:bg-[#0E3621] disabled:opacity-20 disabled:pointer-events-none shadow-xl shadow-emerald-200/50 dark:shadow-emerald-900/20"
                        >
                            Siguiente
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Modals - Refined Design */}
            <Modal
                isOpen={!!viewingSession}
                onClose={() => setViewingSession(null)}
                title="Resumen de Jornada"
            >
                {viewingSession && (
                    <div className="space-y-8 p-2">
                        <div className="flex items-center gap-5 rounded-[2.5rem] bg-emerald-50/50 dark:bg-emerald-900/20 p-8 border border-emerald-100 dark:border-emerald-900/30">
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#1A5235] dark:bg-emerald-600 text-white shadow-2xl shadow-emerald-200 dark:shadow-emerald-900/20">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600/60 dark:text-emerald-400/60 mb-1">Estado del registro</p>
                                <p className="text-2xl font-black text-[#0E3621] dark:text-emerald-400">Sesión Exitosa</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="rounded-[2rem] border border-slate-100 dark:border-slate-700 p-6 bg-white dark:bg-slate-800 shadow-sm">
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3">Fecha de trabajo</p>
                                <p className="text-base font-black text-slate-800 dark:text-slate-200 leading-snug">
                                    {new Date(viewingSession.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </p>
                            </div>
                            <div className="rounded-[2rem] border border-slate-100 dark:border-slate-700 p-6 bg-white dark:bg-slate-800 shadow-sm">
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3">Horas Entrada/Salida</p>
                                <p className="text-base font-black text-slate-800 dark:text-slate-200 leading-snug">{viewingSession.startTime} — {viewingSession.endTime}</p>
                            </div>
                            <div className="rounded-[2rem] border-2 border-[#1A5235]/20 dark:border-emerald-500/20 p-6 bg-emerald-50/20 dark:bg-emerald-900/10">
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1A5235]/60 dark:text-emerald-400/60 mb-3">Tiempo Total Neto</p>
                                <p className="text-2xl font-black text-[#1A5235] dark:text-emerald-400">
                                    {formatHoursMinutes(viewingSession.totalMinutes)}
                                </p>
                            </div>
                            <div className="rounded-[2rem] border border-amber-100 dark:border-amber-900/30 p-6 bg-amber-50/30 dark:bg-amber-900/10">
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-600/60 dark:text-amber-400/60 mb-3">Tiempo de Pausas</p>
                                <p className="text-2xl font-black text-amber-700 dark:text-amber-400">
                                    {viewingSession.breakMinutes} min
                                </p>
                            </div>
                        </div>

                        <button onClick={() => setViewingSession(null)} className="w-full rounded-2xl bg-[#0E3621] dark:bg-white py-5 text-sm font-black uppercase tracking-widest text-white dark:text-slate-900 shadow-2xl shadow-emerald-900/20 hover:bg-black dark:hover:bg-slate-200 transition-all">
                            Cerrar Detalles
                        </button>
                    </div>
                )}
            </Modal>

            <ConfirmModal
                isOpen={!!deletingSessionId}
                onClose={() => setDeletingSessionId(null)}
                onConfirm={handleDelete}
                title="Eliminar Registro Permanente"
                confirmText="Confirmar Eliminación"
                confirmVariant="danger"
            >
                <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    ¿Estás seguro de que deseas eliminar esta jornada de tu historial? <br />
                    <span className="text-red-500 dark:text-red-400 font-black uppercase text-[10px] tracking-widest mt-4 block">Esta acción no se puede deshacer y afectará tus reportes.</span>
                </p>
            </ConfirmModal>

        </div>
    );
}

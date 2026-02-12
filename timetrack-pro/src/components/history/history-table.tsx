"use client";

import { formatHoursMinutes, cn } from "@/lib/utils";
import {
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
import { useUserStore } from "@/stores/user-store";

interface HistoryTableProps {
    filteredSessions: any[];
    onDeleteSession: (sessionId: string) => Promise<void>;
}

export function HistoryTable({ filteredSessions, onDeleteSession }: HistoryTableProps) {
    const user = useUserStore(state => state.user);
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
            try {
                await onDeleteSession(deletingSessionId);
                addNotification("Registro Eliminado", "La jornada ha sido eliminada del historial.", "success");
            } catch (error) {
                addNotification("Error", "No se pudo eliminar el registro.", "error");
            } finally {
                setDeletingSessionId(null);
            }
        }
    };

    return (
        <div className="flex flex-col min-h-[500px]">
            {/* Table for Desktop */}
            <div className="hidden lg:block overflow-x-auto custom-scrollbar-hide rounded-[2rem] bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
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
                                const targetMinutes = (user?.expected_hours_per_day || 8) * 60;
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
                        ) : null}
                    </tbody>
                </table>
            </div>

            {/* Cards for Mobile */}
            <div className="lg:hidden space-y-4">
                {currentRecords.length > 0 ? (
                    currentRecords.map((session, index) => {
                        const date = new Date(session.date);
                        const netMinutes = session.totalMinutes || 0;
                        const targetMinutes = (user?.expected_hours_per_day || 8) * 60;
                        const diff = netMinutes - targetMinutes;

                        return (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-100 dark:border-slate-800 shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 flex-col items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 font-black text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700">
                                            <span className="text-[8px] leading-none uppercase">{date.toLocaleDateString('es-ES', { weekday: 'short' })}</span>
                                            <span className="text-sm leading-none mt-1">{date.getDate()}</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                {date.toLocaleDateString("es-ES", { month: "short", year: "numeric" })}
                                            </p>
                                            <p className="text-sm font-black text-slate-800 dark:text-slate-100">
                                                {formatHoursMinutes(netMinutes)} Trabajado
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setViewingSession(session)}
                                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 active:scale-95"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => setDeletingSessionId(session.id)}
                                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 active:scale-95 hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                                        {session.startTime} — {session.endTime || '--:--'}
                                    </div>
                                    <div>
                                        {diff === 0 ? (
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Objetivo</span>
                                        ) : diff > 0 ? (
                                            <span className="text-[9px] font-black text-[#1A5235] dark:text-emerald-400 uppercase tracking-widest">+{formatHoursMinutes(diff)}</span>
                                        ) : (
                                            <span className="text-[9px] font-black text-red-500 dark:text-red-400 uppercase tracking-widest">-{formatHoursMinutes(Math.abs(diff))}</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                ) : null}
            </div>

            {currentRecords.length === 0 && (
                <div className="py-24 text-center rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex flex-col items-center justify-center gap-4 opacity-30">
                        <Inbox className="h-16 w-16 sm:h-20 sm:w-20 text-slate-400 dark:text-slate-600" />
                        <p className="text-sm sm:text-base font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">Sin jornadas registradas</p>
                    </div>
                </div>
            )}

            {/* Pagination UI */}
            {totalPages > 1 && (
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-2xl px-6 sm:px-8 py-5 sm:py-6 border border-slate-100 dark:border-slate-800 shadow-sm gap-4">
                    <div className="text-center sm:text-left">
                        <p className="text-[10px] sm:text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                            Mostrando <span className="text-slate-800 dark:text-slate-200">{(currentPage - 1) * recordsPerPage + 1} - {Math.min(currentPage * recordsPerPage, filteredSessions.length)}</span> de <span className="text-slate-800 dark:text-slate-200">{filteredSessions.length}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="flex-1 sm:flex-none flex h-10 sm:h-12 items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 sm:px-6 text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-all hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-20 shadow-sm"
                        >
                            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Anterior</span>
                        </button>
                        <div className="flex h-10 sm:h-12 items-center gap-1.5 px-3 sm:px-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                            <span className="text-[10px] sm:text-xs font-black text-slate-800 dark:text-slate-200">{currentPage}</span>
                            <span className="text-[10px] font-bold text-slate-400">/</span>
                            <span className="text-[10px] font-bold text-slate-400">{totalPages}</span>
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="flex-1 sm:flex-none flex h-10 sm:h-12 items-center justify-center gap-2 rounded-xl bg-[#1A5235] px-4 sm:px-6 text-[10px] sm:text-xs font-black text-white uppercase tracking-widest transition-all hover:bg-[#0E3621] disabled:opacity-20 shadow-xl shadow-emerald-200/50 dark:shadow-emerald-900/20"
                        >
                            <span className="hidden sm:inline">Siguiente</span>
                            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            <Modal
                isOpen={!!viewingSession}
                onClose={() => setViewingSession(null)}
                title="Resumen de Jornada"
            >
                {viewingSession && (
                    <div className="space-y-6 sm:space-y-8 p-1 sm:p-2">
                        <div className="flex items-center gap-4 sm:gap-5 rounded-[2rem] sm:rounded-[2.5rem] bg-emerald-50/50 dark:bg-emerald-900/20 p-6 sm:p-8 border border-emerald-100 dark:border-emerald-900/30">
                            <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl sm:rounded-3xl bg-[#1A5235] dark:bg-emerald-600 text-white shadow-2xl shadow-emerald-200 dark:shadow-emerald-900/20 shrink-0">
                                <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600/60 dark:text-emerald-400/60 mb-1">Estado del registro</p>
                                <p className="text-lg sm:text-2xl font-black text-[#0E3621] dark:text-emerald-400">Sesión Exitosa</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                            <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 dark:border-slate-700 p-5 sm:p-6 bg-white dark:bg-slate-800 shadow-sm">
                                <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 sm:mb-3">Fecha de trabajo</p>
                                <p className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-200 leading-snug">
                                    {new Date(viewingSession.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </p>
                            </div>
                            <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 dark:border-slate-700 p-5 sm:p-6 bg-white dark:bg-slate-800 shadow-sm">
                                <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 sm:mb-3">Horario</p>
                                <p className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-200 leading-snug">{viewingSession.startTime} — {viewingSession.endTime}</p>
                            </div>
                            <div className="rounded-[1.5rem] sm:rounded-[2rem] border-2 border-[#1A5235]/20 dark:border-emerald-500/20 p-5 sm:p-6 bg-emerald-50/20 dark:bg-emerald-900/10">
                                <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-[#1A5235]/60 dark:text-emerald-400/60 mb-2 sm:mb-3">Tiempo Trabajado</p>
                                <p className="text-xl sm:text-2xl font-black text-[#1A5235] dark:text-emerald-400">
                                    {formatHoursMinutes(viewingSession.totalMinutes)}
                                </p>
                            </div>
                            <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-amber-100 dark:border-amber-900/30 p-5 sm:p-6 bg-amber-50/30 dark:bg-amber-900/10">
                                <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-amber-600/60 dark:text-amber-400/60 mb-2 sm:mb-3">Pausas</p>
                                <p className="text-xl sm:text-2xl font-black text-amber-700 dark:text-amber-400">
                                    {viewingSession.breakMinutes} min
                                </p>
                            </div>
                        </div>

                        <button onClick={() => setViewingSession(null)} className="w-full rounded-2xl bg-[#0E3621] dark:bg-white py-4 sm:py-5 text-xs sm:text-sm font-black uppercase tracking-widest text-white dark:text-slate-900 shadow-xl hover:bg-black dark:hover:bg-slate-200 transition-all active:scale-95">
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

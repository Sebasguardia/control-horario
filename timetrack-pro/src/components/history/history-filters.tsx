"use client";

import { Search, Calendar, FileText, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNotification } from "@/contexts/notification-context";
import { motion, AnimatePresence } from "framer-motion";

interface HistoryFiltersProps {
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onExport: (format: 'CSV' | 'Excel' | 'PDF') => void;
}

export function HistoryFilters({
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    searchTerm,
    setSearchTerm,
    onExport
}: HistoryFiltersProps) {
    const { addNotification } = useNotification();
    const [exportMenuOpen, setExportMenuOpen] = useState(false);
    const exportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
                setExportMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleExportClick = (format: 'CSV' | 'PDF' | 'Excel') => {
        setExportMenuOpen(false);
        onExport(format);
        addNotification("Exportación Exitosa", `El historial se ha exportado como ${format}.`, "success");
    };

    const clearFilters = () => {
        setStartDate("");
        setEndDate("");
        setSearchTerm("");
        addNotification("Filtros Limpiados", "Se han restablecido todos los criterios de búsqueda.", "info");
    };

    return (
        <div className="mb-10 space-y-4">
            <div className="flex flex-wrap items-center gap-6">
                {/* Search Bar - Larger and pill-shaped */}
                <div className="relative flex-1 min-w-[320px]">
                    <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por fecha (ej: enero)..."
                        className="h-14 w-full rounded-full border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 pl-14 pr-6 text-base font-bold text-slate-700 dark:text-slate-200 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 shadow-sm transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    />
                </div>

                {/* Date Filters Area */}
                <div className="flex items-center gap-4 bg-[#F7F8F9] dark:bg-slate-900 p-1.5 rounded-full border border-slate-100 dark:border-slate-800">
                    <div className="relative group">
                        <div className="relative">
                            <Calendar className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="h-11 w-[160px] rounded-full border-none bg-transparent pl-12 pr-4 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 focus:ring-0 transition-all outline-none cursor-pointer dark:[color-scheme:dark]"
                            />
                        </div>
                    </div>

                    <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700" />

                    <div className="relative group">
                        <div className="relative">
                            <Calendar className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="h-11 w-[160px] rounded-full border-none bg-transparent pl-12 pr-4 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 focus:ring-0 transition-all outline-none cursor-pointer dark:[color-scheme:dark]"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 ml-auto">
                    <AnimatePresence>
                        {(startDate || endDate || searchTerm) && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={clearFilters}
                                className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-90 shadow-sm"
                                title="Limpiar filtros"
                            >
                                <X className="h-6 w-6" />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <div className="relative" ref={exportRef}>
                        <button
                            onClick={() => setExportMenuOpen(!exportMenuOpen)}
                            className="flex h-14 items-center gap-3 rounded-full bg-[#1A5235] px-8 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-900/10 transition-all hover:bg-[#0E3621] hover:-translate-y-0.5 active:scale-95"
                        >
                            <FileText className="h-4 w-4" />
                            Exportar
                        </button>

                        <AnimatePresence>
                            {exportMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 top-full z-30 mt-3 w-48 overflow-hidden rounded-[1.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-2xl"
                                >
                                    <p className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 border-b border-slate-50 dark:border-slate-800 mb-1">Formato de salida</p>
                                    {['Excel', 'PDF', 'CSV'].map((format) => (
                                        <button
                                            key={format}
                                            onClick={() => handleExportClick(format as any)}
                                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-[#F7F8F9] dark:hover:bg-slate-800 hover:text-[#1A5235] dark:hover:text-emerald-400 transition-all"
                                        >
                                            <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                                            {format}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

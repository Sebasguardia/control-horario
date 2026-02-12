"use client";

import { Calendar, Download, FileText, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import { useNotification } from "@/contexts/notification-context";
import { motion, AnimatePresence } from "framer-motion";

interface ReportFiltersProps {
    dateRange: string;
    setDateRange: Dispatch<SetStateAction<string>>;
    onExport: (format: 'CSV' | 'Excel' | 'PDF') => void;
    periodLabel: string;
    onNavigate: (direction: number) => void;
}

export function ReportFilters({
    dateRange,
    setDateRange,
    onExport,
    periodLabel,
    onNavigate
}: ReportFiltersProps) {
    const { addNotification } = useNotification();
    const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
    const downloadRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
                setDownloadMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleExportClick = (format: 'CSV' | 'PDF' | 'Excel') => {
        setDownloadMenuOpen(false);
        onExport(format);
        addNotification("Reporte Generado", `El documento ${format} se ha creado correctamente.`, "success");
    };

    const ranges = [
        { id: "week", label: "Semana" },
        { id: "month", label: "Mes" },
        { id: "quarter", label: "Trimestre" }
    ];

    return (
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full">
            {/* Period Segmented Control */}
            <div className="inline-flex rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 w-full sm:w-auto">
                {ranges.map((range) => (
                    <button
                        key={range.id}
                        onClick={() => setDateRange(range.id)}
                        className={`relative flex-1 sm:flex-none flex items-center justify-center rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all ${dateRange === range.id
                            ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                            }`}
                    >
                        {range.label}
                    </button>
                ))}
            </div>

            {/* Navigation & Label */}
            <div className="flex items-center gap-2 flex-1 sm:flex-none">
                <button
                    onClick={() => onNavigate(-1)}
                    className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary transition-all active:scale-90 shadow-sm"
                >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                <div className="flex h-11 sm:h-12 flex-1 sm:min-w-[180px] items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 sm:px-5 text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 shadow-sm">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                    <span className="capitalize truncate">{periodLabel}</span>
                </div>

                <button
                    onClick={() => onNavigate(1)}
                    className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary transition-all active:scale-90 shadow-sm"
                >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
            </div>

            {/* Download/Export Section */}
            <div className="w-full sm:w-auto sm:ml-auto" ref={downloadRef}>
                <div className="relative">
                    <button
                        onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
                        className="flex h-11 sm:h-12 w-full sm:w-auto items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-slate-900 dark:bg-white px-5 sm:px-6 text-xs sm:text-sm font-bold text-white dark:text-slate-900 shadow-xl shadow-slate-200 dark:shadow-slate-900/10 transition-all hover:bg-black dark:hover:bg-slate-100 hover:-translate-y-0.5 active:scale-95"
                    >
                        <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Exportar Reporte</span>
                        <span className="sm:hidden">Exportar</span>
                        <ChevronDown className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform ${downloadMenuOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                        {downloadMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-2xl"
                            >
                                <p className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800 mb-1">Seleccionar Formato</p>
                                {[
                                    { id: 'Excel', label: 'Estructura Excel', desc: '.xlsx', icon: <Download className="h-4 w-4" /> },
                                    { id: 'PDF', label: 'Documento PDF', desc: '.pdf', icon: <FileText className="h-4 w-4" /> },
                                    { id: 'CSV', label: 'Valores CSV', desc: '.csv', icon: <Download className="h-4 w-4" /> },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleExportClick(item.id as any)}
                                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all hover:bg-primary/5 dark:hover:bg-primary/10 group"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">{item.label}</p>
                                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{item.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

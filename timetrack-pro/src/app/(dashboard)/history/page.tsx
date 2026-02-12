"use client";

import { useEffect, useState, useMemo } from "react";
import { HistoryFilters } from "@/components/history/history-filters";
import { HistoryTable } from "@/components/history/history-table";
import { usePageStore } from "@/stores/page-store";
import { motion } from "framer-motion";
import { mockHistorySessions } from "@/mocks/mock-data";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/export-utils";
import { formatHoursMinutes } from "@/lib/utils";

export default function HistoryPage() {
    const { title, subtitle, setTitle } = usePageStore();
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        setTitle("Historial", "Todas tus jornadas de trabajo registradas.");
    }, [setTitle]);

    const filteredSessions = useMemo(() => {
        let result = [...mockHistorySessions];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(session => {
                const dateObj = new Date(session.date);
                const fullDate = dateObj.toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }).toLowerCase();
                return fullDate.includes(term);
            });
        }

        if (startDate) {
            const start = new Date(startDate).getTime();
            result = result.filter(session => new Date(session.date).getTime() >= start);
        }

        if (endDate) {
            const end = new Date(endDate).getTime();
            result = result.filter(session => new Date(session.date).getTime() <= end);
        }

        return result.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }, [startDate, endDate, searchTerm]);

    const handleExport = (format: 'CSV' | 'Excel' | 'PDF') => {
        const exportData = filteredSessions.map(s => ({
            'Fecha': s.date,
            'Entrada': s.startTime,
            'Salida': s.endTime || '-',
            'Pausas (min)': s.breakMinutes || 0,
            'Tiempo Neto': formatHoursMinutes(s.totalMinutes || 0),
            'Estado': 'Completada'
        }));

        const fileName = `historial_jornadas_${new Date().toISOString().split('T')[0]}`;

        if (format === 'CSV') exportToCSV(exportData, fileName);
        if (format === 'Excel') exportToExcel(exportData, fileName);
        if (format === 'PDF') exportToPDF(exportData, fileName, 'Reporte de Historial de Jornadas');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-10"
        >
            {/* Header Section */}
            <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-800 dark:text-white">{title}</h1>
                {subtitle && (
                    <p className="mt-2 text-base font-bold text-slate-400 dark:text-slate-500">{subtitle}</p>
                )}
            </div>

            <div className="space-y-8">
                <HistoryFilters
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onExport={handleExport}
                />

                <div className="rounded-[1.5rem] bg-[#F7F8F9] dark:bg-slate-900 p-1 border border-slate-100/50 dark:border-slate-800/50">
                    <HistoryTable
                        filteredSessions={filteredSessions}
                    />
                </div>
            </div>
        </motion.div>
    );
}

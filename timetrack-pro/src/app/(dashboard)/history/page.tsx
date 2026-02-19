"use client";

import { useEffect, useState, useMemo } from "react";
import { HistoryFilters } from "@/components/history/history-filters";
import { HistoryTable } from "@/components/history/history-table";

import { usePageStore } from "@/stores/page-store";
import { useUserStore } from "@/stores/user-store";
import { useSessionStore } from "@/stores/session-store";
import { ReportService } from "@/services/report-service";
import { SessionService } from "@/services/session-service";
import { motion, AnimatePresence } from "framer-motion";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/export-utils";
import { formatHoursMinutes } from "@/lib/utils";
import { startOfYear, endOfYear } from "date-fns";

export default function HistoryPage() {
    const user = useUserStore(state => state.user);
    const { currentSession } = useSessionStore(); // To trigger refresh if session ends
    const { title, subtitle, setTitle } = usePageStore();
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTitle("Historial", "Todas tus jornadas de trabajo registradas.");
    }, [setTitle]);

    const fetchSessions = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Default range: Current Year for now, or just wider
            const start = startDate ? new Date(startDate) : startOfYear(new Date());
            const end = endDate ? new Date(endDate) : endOfYear(new Date());

            // If no filters, maybe fetch last 100 sessions? 
            // For simplicity, using getSessionsByDateRange which we already have. 
            // If user explicitly sets range, use it. If not, use reasonable default.

            // Adjust end date to cover the full day if manually set
            if (endDate) end.setHours(23, 59, 59, 999);

            const fetchedSessions = await ReportService.getSessionsByDateRange(
                user.id,
                start.toISOString(),
                end.toISOString()
            );

            setSessions(fetchedSessions.sort((a: any, b: any) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()));

        } catch (error) {
            console.error("Failed to fetch history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, [user, currentSession?.status, startDate, endDate]); // Trigger on filter change or session end

    const filteredSessions = useMemo(() => {
        let result = [...sessions];

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

        // Date filters are handled in fetch for efficiency, but if we want strictly client side filtering on the fetched set:
        // Already handled by fetch parameters.

        return result;
    }, [sessions, searchTerm]);

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

    const handleDeleteSession = async (sessionId: string) => {
        if (!user) return;
        await SessionService.deleteSession(sessionId);
        // Refresh local state
        setSessions(prev => prev.filter(s => s.id !== sessionId));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 lg:space-y-10"
        >
            {/* Header Section */}
            <div className="px-2 sm:px-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-800 dark:text-white">{title}</h1>
                {subtitle && (
                    <p className="mt-1 sm:mt-2 text-sm sm:text-base font-bold text-slate-400 dark:text-slate-500">{subtitle}</p>
                )}
            </div>

            <div className="space-y-6 lg:space-y-8 px-1 sm:px-0">

                <HistoryFilters
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onExport={handleExport}
                />

                <div className="rounded-[2rem] bg-[#F7F8F9] dark:bg-slate-900 p-1 border border-slate-100/50 dark:border-slate-800/50">
                    <HistoryTable
                        filteredSessions={filteredSessions}
                        onDeleteSession={handleDeleteSession}
                    />
                </div>
            </div>
        </motion.div>
    );
}

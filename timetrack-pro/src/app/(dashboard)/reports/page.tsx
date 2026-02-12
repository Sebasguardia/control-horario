"use client";

import { useEffect, useState, useMemo } from "react";
import { ReportFilters } from "@/components/reports/report-filters";
import { ReportStats } from "@/components/reports/report-stats";
import { ReportChart } from "@/components/reports/report-chart";
import { usePageStore } from "@/stores/page-store";
import { motion, AnimatePresence } from "framer-motion";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/export-utils";
import { formatHoursMinutes } from "@/lib/utils";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import html2canvas from "html2canvas";
import { createClient } from "@/lib/supabase/client";

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState("month"); // week, month, quarter
    const [anchorDate, setAnchorDate] = useState(new Date());
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { title, subtitle, setTitle } = usePageStore();

    useEffect(() => {
        setTitle("Reportes", "Análisis detallado de tu actividad laboral.");
    }, [setTitle]);

    // Calculate the start and end of the current period based on dateRange and anchorDate
    const periodInfo = useMemo(() => {
        const start = new Date(anchorDate);
        const end = new Date(anchorDate);

        if (dateRange === "week") {
            const day = start.getDay();
            const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday
            start.setDate(diff);
            start.setHours(0, 0, 0, 0);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);

            return {
                start,
                end,
                label: `${start.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`
            };
        } else if (dateRange === "month") {
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            end.setMonth(start.getMonth() + 1, 0);
            end.setHours(23, 59, 59, 999);

            return {
                start,
                end,
                label: start.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
            };
        } else { // quarter
            const quarter = Math.floor(start.getMonth() / 3);
            start.setMonth(quarter * 3, 1);
            start.setHours(0, 0, 0, 0);
            end.setMonth(start.getMonth() + 3, 0);
            end.setHours(23, 59, 59, 999);

            return {
                start,
                end,
                label: `Trimestre Q${quarter + 1} (${start.toLocaleDateString('es-ES', { month: 'short' })} - ${end.toLocaleDateString('es-ES', { month: 'short' })})`
            };
        }
    }, [dateRange, anchorDate]);

    // Load sessions from Supabase
    useEffect(() => {
        const loadSessions = async () => {
            setLoading(true);
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('v_daily_stats')
                .select('*')
                .eq('user_id', user.id)
                .gte('work_date', periodInfo.start.toISOString().split('T')[0])
                .lte('work_date', periodInfo.end.toISOString().split('T')[0]);

            if (data) {
                const formattedSessions = data.map((s: any) => ({
                    id: s.work_date,
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

        loadSessions();
    }, [periodInfo]);

    // Filter sessions based on current period
    const filteredSessions = useMemo(() => {
        return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [sessions]);

    const handleExport = async (format: 'CSV' | 'Excel' | 'PDF') => {
        const exportData = filteredSessions.map(s => ({
            'Fecha': s.date,
            'Entrada': s.startTime,
            'Salida': s.endTime || '-',
            'Pausas (min)': s.breakMinutes || 0,
            'Tiempo Neto': formatHoursMinutes(s.totalMinutes || 0),
            'Estado': 'Completada'
        }));

        const fileName = `reporte_${dateRange}_${periodInfo.label.replace(/ /g, '_')}`;

        if (format === 'CSV') exportToCSV(exportData, fileName);
        if (format === 'Excel') exportToExcel(exportData, fileName);
        if (format === 'PDF') {
            let chartImage = undefined;
            const chartElement = document.getElementById('report-chart-container');
            if (chartElement) {
                const canvas = await html2canvas(chartElement);
                chartImage = canvas.toDataURL('image/png');
            }

            const totalMinutes = filteredSessions.reduce((acc, s) => acc + (s.totalMinutes || 0), 0);
            const totalBreaks = filteredSessions.reduce((acc, s) => acc + (s.breakMinutes || 0), 0);
            const stats = [
                { label: "Tiempo Total", value: formatHoursMinutes(totalMinutes) },
                { label: "Pausas", value: `${totalBreaks}m` },
                { label: "Jornadas", value: String(filteredSessions.length) }
            ];

            exportToPDF(exportData, fileName, `Reporte Laboral - ${periodInfo.label}`, stats, chartImage);
        }
    };

    const navigatePeriod = (direction: number) => {
        const newDate = new Date(anchorDate);
        if (dateRange === "week") newDate.setDate(newDate.getDate() + (direction * 7));
        else if (dateRange === "month") newDate.setMonth(newDate.getMonth() + direction);
        else newDate.setMonth(newDate.getMonth() + (direction * 3));
        setAnchorDate(newDate);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            {/* Header Section */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">{title}</h1>
                    {subtitle && (
                        <p className="mt-1 text-sm font-bold text-slate-400 dark:text-slate-500">{subtitle}</p>
                    )}
                </div>
                <ReportFilters
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    onExport={handleExport}
                    periodLabel={periodInfo.label}
                    onNavigate={navigatePeriod}
                />
            </div>

            {/* Main Content Grid */}
            <div className="space-y-8">
                <ReportStats sessions={filteredSessions} />

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 h-[500px]">
                    <div className="lg:col-span-2 h-full">
                        <ReportChart
                            sessions={filteredSessions}
                            dateRange={dateRange}
                            periodStart={periodInfo.start}
                            periodEnd={periodInfo.end}
                        />
                    </div>
                    <div className="rounded-[1.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm h-full flex flex-col overflow-hidden">
                        <div className="mb-6 flex items-center justify-between shrink-0">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Actividad del Periodo</h3>
                            <span className="rounded-full bg-slate-50 dark:bg-slate-800 px-3 py-1 text-[10px] font-black text-slate-400 dark:text-slate-500">
                                {filteredSessions.length} registros
                            </span>
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto pr-2 no-scrollbar">
                            <AnimatePresence mode="popLayout">
                                {filteredSessions.map((session, i) => {
                                    const date = new Date(session.date);
                                    return (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            key={session.id}
                                            className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group hover:border-primary/20 dark:hover:border-primary/40 hover:bg-white dark:hover:bg-slate-700 transition-all"
                                        >
                                            <div className="h-10 w-10 shrink-0 flex flex-col items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800 group-hover:text-primary dark:group-hover:text-primary transition-colors">
                                                <span className="text-[9px] font-black uppercase leading-none">{date.toLocaleDateString('es-ES', { weekday: 'short' })}</span>
                                                <span className="text-sm font-black leading-none mt-0.5">{date.getDate()}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-black text-slate-800 dark:text-white">
                                                    {session.startTime} - {session.endTime}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Clock className="h-3 w-3 text-slate-300 dark:text-slate-600" />
                                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 capitalize">
                                                        {date.toLocaleDateString("es-ES", { month: "long" })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-black text-primary dark:text-emerald-400">
                                                    {formatHoursMinutes(session.totalMinutes)}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                            {filteredSessions.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                                    <CalendarIcon className="h-12 w-12 mb-3 text-slate-800 dark:text-white" />
                                    <p className="text-xs font-black uppercase tracking-widest text-center text-slate-800 dark:text-white">No hay actividad registrada en este periodo</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

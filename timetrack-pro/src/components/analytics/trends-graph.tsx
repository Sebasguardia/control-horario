"use client";

import { useEffect, useState } from "react";
import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useUserStore } from "@/stores/user-store";
import { ReportService } from "@/services/report-service";
import { format, startOfMonth, endOfMonth, eachWeekOfInterval, startOfWeek, endOfWeek, isSameWeek, subWeeks } from "date-fns";
import { es } from "date-fns/locale";

export function TrendsGraph() {
    const user = useUserStore((state) => state.user);
    const [data, setData] = useState<any[]>([]);
    const [trend, setTrend] = useState(0);

    useEffect(() => {
        if (!user) return;

        async function fetchData() {
            const now = new Date();
            const start = startOfMonth(now);
            const end = endOfMonth(now);

            // Fetch current month data
            const report = await ReportService.getReportByDateRange(user!.id, start.toISOString(), end.toISOString());

            // Fetch previous month to calculate trend
            const prevMonthStart = startOfMonth(subWeeks(start, 1));
            const prevMonthEnd = endOfMonth(prevMonthStart);
            const prevMonthReport = await ReportService.getReportByDateRange(user!.id, prevMonthStart.toISOString(), prevMonthEnd.toISOString());

            // Generate weeks for the month
            const weeks = eachWeekOfInterval({ start, end });

            const chartData = weeks.map((weekStart, index) => {
                const weekEnd = endOfWeek(weekStart);

                // Filter sessions for this week
                const weekSessions = report.sessionsPerDay.filter(day => {
                    const d = new Date(day.date);
                    return d >= weekStart && d <= weekEnd;
                });

                const totalMinutes = weekSessions.reduce((acc, curr) => acc + curr.totalMinutes, 0);
                const hours = Math.round(totalMinutes / 60 * 10) / 10;

                return {
                    week: `Sem ${index + 1}`,
                    hours: hours,
                    target: (user?.expected_hours_per_day || 8) * 5 // Weekly target
                };
            });

            setData(chartData);

            // Calculate trend vs previous month
            const currentHours = report.totalHours;
            const prevHours = prevMonthReport.totalHours;
            if (prevHours > 0) {
                const diff = ((currentHours - prevHours) / prevHours) * 100;
                setTrend(Math.round(diff * 10) / 10);
            } else if (currentHours > 0) {
                setTrend(100);
            } else {
                setTrend(0);
            }
        }

        fetchData();
    }, [user]);

    return (
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 p-5 sm:p-6 lg:p-8 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 h-64 w-64 translate-x-10 -translate-y-10 rounded-full bg-[#1A5235]/5 dark:bg-emerald-900/20 blur-[100px] pointer-events-none" />

            <div className="relative z-10 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-0">
                <div>
                    <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-800 dark:text-white mb-1 sm:mb-2">Tendencia Mensual</h3>
                    <p className="text-xs sm:text-sm font-medium text-slate-400">Comparativa de rendimiento vs objetivos</p>
                </div>
                <div className="text-left sm:text-right">
                    <div className="flex items-center gap-2 justify-start sm:justify-end text-emerald-500 dark:text-emerald-400 mb-1">
                        <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm font-black">+{trend}%</span>
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">vs mes anterior</p>
                </div>
            </div>

            <div className="h-[300px] sm:h-[350px] lg:h-[400px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis
                            dataKey="week"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                            tickFormatter={(v) => `${v}h`}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#ffffff",
                                borderRadius: "1rem",
                                border: "1px solid #e2e8f0",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                padding: "12px 16px",
                                color: "#1e293b"
                            }}
                            itemStyle={{ color: "#1e293b", fontWeight: 700, fontSize: "12px" }}
                            labelStyle={{ color: "#64748b", marginBottom: "4px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 800 }}
                            cursor={{ stroke: "#cbd5e1", strokeWidth: 2 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="hours"
                            stroke="#10B981"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#trendGradient)"
                            name="Horas Trabajadas"
                        />
                        <Line
                            type="monotone"
                            dataKey="target"
                            stroke="#94a3b8"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            dot={false}
                            name="Meta Mensual"
                            opacity={0.5}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

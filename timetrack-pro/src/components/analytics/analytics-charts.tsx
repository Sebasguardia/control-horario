"use client";

import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Area,
    AreaChart,
} from "recharts";
import { useUserStore } from "@/stores/user-store";
import { ReportService } from "@/services/report-service";
import { startOfWeek, endOfWeek, eachDayOfInterval, format, startOfMonth, endOfMonth, eachWeekOfInterval } from "date-fns";
import { es } from "date-fns/locale";

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-xl shadow-slate-200/50 dark:shadow-black/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">{label}</p>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <p className="text-lg font-black text-slate-800 dark:text-white">{payload[0].value}</p>
                </div>
            </div>
        );
    }
    return null;
}

export function AnalyticsCharts() {
    const user = useUserStore((state) => state.user);
    const [weeklyData, setWeeklyData] = useState<any[]>([]);
    const [breakData, setBreakData] = useState<any[]>([]);
    const [productivityData, setProductivityData] = useState<any[]>([]);
    const [monthlyData, setMonthlyData] = useState<any[]>([]);

    useEffect(() => {
        if (!user) return;

        async function fetchData() {
            const now = new Date();
            const weekStart = startOfWeek(now, { weekStartsOn: 1 });
            const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

            const weeklyReport = await ReportService.getWeeklyReport(user!.id, weekStart);

            // 1. Weekly Hours Data
            const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
            const wData = days.map(day => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const dayData = weeklyReport.sessionsPerDay.find(d => d.date === dateStr);
                return {
                    day: format(day, 'EEE', { locale: es }).replace('.', ''),
                    hours: dayData ? Math.round(dayData.totalMinutes / 60 * 10) / 10 : 0
                };
            });
            setWeeklyData(wData);

            // 2. Break Distribution Data
            const monthStart = startOfMonth(now);
            const bData = await ReportService.getBreakDistribution(user!.id, monthStart.toISOString(), now.toISOString());
            setBreakData(bData);

            // 3. Productivity Trend (Hours / Expected)
            const pData = wData.map(d => ({
                day: d.day,
                productivity: Math.min(100, Math.round((d.hours / (user?.expected_hours_per_day || 8)) * 100))
            }));
            setProductivityData(pData);

            // 4. Monthly Trend (Using real monthly data grouped by week)
            const monthEnd = endOfMonth(now);
            const report = await ReportService.getReportByDateRange(user!.id, monthStart.toISOString(), monthEnd.toISOString());
            const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 1 });

            const mData = weeks.map((weekStart, index) => {
                const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
                const weekSessions = report.sessionsPerDay.filter(day => {
                    const d = new Date(day.date);
                    return d >= weekStart && d <= weekEnd;
                });
                const totalMinutes = weekSessions.reduce((acc, curr) => acc + curr.totalMinutes, 0);
                return {
                    week: `Sem ${index + 1}`,
                    hours: Math.round(totalMinutes / 60 * 10) / 10,
                    target: (user?.expected_hours_per_day || 8) * 5
                };
            });
            setMonthlyData(mData);
        }

        fetchData();
    }, [user]);

    return (
        <div className="grid grid-cols-1 gap-6 lg:gap-8 lg:grid-cols-2">
            {/* Productivity Trend */}
            <div className="rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 lg:p-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-800 dark:text-white">Productividad Semanal</h3>
                    <p className="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500">Tendencia de eficiencia diaria</p>
                </div>
                <div className="h-56 sm:h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={productivityData}>
                            <defs>
                                <linearGradient id="prodGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1A5235" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#1A5235" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }}
                                domain={[0, 100]}
                                tickFormatter={(v: number) => `${v}%`}
                                dx={-10}
                            />
                            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#e2e8f0", strokeWidth: 2 }} />
                            <Area
                                type="monotone"
                                dataKey="productivity"
                                stroke="#1A5235"
                                strokeWidth={3}
                                fill="url(#prodGradient)"
                                dot={{ r: 4, fill: "#fff", stroke: "#1A5235", strokeWidth: 2 }}
                                activeDot={{ r: 6, fill: "#1A5235", stroke: "#fff", strokeWidth: 2 }}
                                className="fill-[#1A5235] dark:fill-emerald-600 stroke-[#1A5235] dark:stroke-emerald-500"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Break Distribution */}
            <div className="rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 lg:p-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-800 dark:text-white">Distribución de Pausas</h3>
                    <p className="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500">Tipos de descanso</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
                    <div className="h-56 w-56 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={breakData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    cornerRadius={10}
                                    stroke="none"
                                >
                                    {breakData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    trigger="hover"
                                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-2xl font-black text-slate-800 dark:text-white">Total</span>
                        </div>
                    </div>
                    <div className="space-y-4 w-full sm:w-auto">
                        {breakData.map((type) => (
                            <div key={type.name} className="flex items-center gap-3">
                                <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: type.color }} />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">{type.name}</span>
                                    <span className="text-sm font-black text-slate-800 dark:text-white">{type.value} min</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Daily Hours */}
            <div className="rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 lg:p-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-800 dark:text-white">Horas Diarias</h3>
                    <p className="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500">Vs Meta (8h)</p>
                </div>
                <div className="h-56 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyData} barSize={40}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }}
                                tickFormatter={(v: number) => `${v}h`}
                                dx={-10}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(148, 163, 184, 0.1)', radius: 4 }}
                                content={<ChartTooltip />}
                            />
                            <Bar
                                dataKey="hours"
                                fill="#1A5235"
                                className="fill-[#1A5235] dark:fill-emerald-600"
                                radius={[12, 12, 12, 12]}
                                background={{ fill: 'rgba(241, 245, 249, 0.2)', radius: 12 }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Monthly Trend */}
            <div className="rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 lg:p-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-800 dark:text-white">Evolución Semanal</h3>
                    <p className="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500">Performance del mes</p>
                </div>
                <div className="h-56 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                            <XAxis
                                dataKey="week"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }}
                                tickFormatter={(v: number) => `${v}h`}
                                dx={-10}
                            />
                            <Tooltip content={<ChartTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="hours"
                                stroke="#1A5235"
                                className="stroke-[#1A5235] dark:stroke-emerald-500"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#fff", stroke: "#1A5235", strokeWidth: 2 }}
                                activeDot={{ r: 7, fill: "#1A5235", stroke: "#fff", strokeWidth: 3 }}
                            />
                            <Line
                                type="step"
                                dataKey="target"
                                stroke="#cbd5e1"
                                className="stroke-slate-300 dark:stroke-slate-700"
                                strokeWidth={2}
                                strokeDasharray="4 4"
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

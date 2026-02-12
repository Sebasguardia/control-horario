"use client";

import { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { mockUser } from "@/mocks/mock-data";

interface ReportChartProps {
    sessions: any[];
    dateRange: string;
    periodStart: Date;
    periodEnd: Date;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md">
                <p className="mb-2 text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{label}</p>
                {payload.map((entry, i) => (
                    <div key={i} className="flex items-center gap-3 py-1">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <p className="text-sm font-black text-slate-700 dark:text-slate-300">
                            {entry.value}h {entry.name === "hours" ? "trabajadas" : "meta"}
                        </p>
                    </div>
                ))}
            </div>
        );
    }
    return null;
}

export function ReportChart({ sessions, dateRange, periodStart, periodEnd }: ReportChartProps) {
    const chartData = useMemo(() => {
        if (dateRange === "week") {
            const days = [];
            const temp = new Date(periodStart);
            for (let i = 0; i < 7; i++) {
                const dateStr = temp.toISOString().split('T')[0];
                const session = sessions.find(s => s.date === dateStr);
                days.push({
                    name: temp.toLocaleDateString("es-ES", { weekday: 'short' }),
                    hours: session ? Number((session.totalMinutes / 60).toFixed(1)) : 0,
                    target: mockUser.expected_hours_per_day
                });
                temp.setDate(temp.getDate() + 1);
            }
            return days;
        } else if (dateRange === "month") {
            // Group by weeks
            const weeks = [];
            const temp = new Date(periodStart);
            while (temp <= periodEnd) {
                const weekNum = Math.ceil(temp.getDate() / 7);
                const weekKey = `Sem ${weekNum}`;

                // Get sessions for this week
                const weekEnd = new Date(temp);
                weekEnd.setDate(temp.getDate() + 6);
                if (weekEnd > periodEnd) weekEnd.setTime(periodEnd.getTime());

                const weekSessions = sessions.filter(s => {
                    const d = new Date(s.date);
                    return d >= temp && d <= weekEnd;
                });

                const totalMinutes = weekSessions.reduce((acc, s) => acc + (s.totalMinutes || 0), 0);

                // Calculate target based on 5 workdays per week roughly, or correctly based on days in period
                let workDaysInWeek = 0;
                const d = new Date(temp);
                while (d <= weekEnd) {
                    if (d.getDay() !== 0 && d.getDay() !== 6) workDaysInWeek++;
                    d.setDate(d.getDate() + 1);
                }

                weeks.push({
                    name: weekKey,
                    hours: Number((totalMinutes / 60).toFixed(1)),
                    target: workDaysInWeek * mockUser.expected_hours_per_day
                });

                temp.setDate(temp.getDate() + 7);
                if (weeks.length >= 5) break;
            }
            return weeks;
        } else { // quarter
            // Group by months
            const months = [];
            const temp = new Date(periodStart);
            for (let i = 0; i < 3; i++) {
                const monthStart = new Date(temp);
                const monthEnd = new Date(temp.getFullYear(), temp.getMonth() + 1, 0);

                const monthSessions = sessions.filter(s => {
                    const d = new Date(s.date);
                    return d.getMonth() === temp.getMonth() && d.getFullYear() === temp.getFullYear();
                });

                const totalMinutes = monthSessions.reduce((acc, s) => acc + (s.totalMinutes || 0), 0);

                // Real workdays in month
                let workDaysInMonth = 0;
                const d = new Date(monthStart);
                while (d <= monthEnd) {
                    if (d.getDay() !== 0 && d.getDay() !== 6) workDaysInMonth++;
                    d.setDate(d.getDate() + 1);
                }

                months.push({
                    name: temp.toLocaleDateString("es-ES", { month: 'short' }),
                    hours: Number((totalMinutes / 60).toFixed(1)),
                    target: workDaysInMonth * mockUser.expected_hours_per_day
                });
                temp.setMonth(temp.getMonth() + 1);
            }
            return months;
        }
    }, [sessions, dateRange, periodStart, periodEnd]);

    return (
        <div id="report-chart-container" className="rounded-[1.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm h-full flex flex-col">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white">Carga de Trabajo</h3>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Comparativa de horas vs meta</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Trabajado</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-slate-100 dark:bg-slate-700" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Meta</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barGap={8}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 800 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 800 }}
                            tickFormatter={(v) => `${v}h`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
                        <Bar
                            dataKey="target"
                            fill="#334155"
                            className="fill-slate-100 dark:fill-slate-800"
                            radius={[6, 6, 0, 0]}
                            name="target"
                            barSize={32}
                        />
                        <Bar
                            dataKey="hours"
                            fill="#166534"
                            className="fill-[#166534] dark:fill-emerald-600"
                            radius={[6, 6, 0, 0]}
                            name="hours"
                            barSize={32}
                            animationDuration={1500}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

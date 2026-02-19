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
import { useUserStore } from "@/stores/user-store";

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
    const user = useUserStore(state => state.user);
    const expectedHours = user?.expected_hours_per_day || 8;

    const chartData = useMemo(() => {
        if (dateRange === "week") {
            const days = [];
            const temp = new Date(periodStart);
            for (let i = 0; i < 7; i++) {
                // Manual format YYYY-MM-DD to match session.date exactly
                const y = temp.getFullYear();
                const m = String(temp.getMonth() + 1).padStart(2, '0');
                const d = String(temp.getDate()).padStart(2, '0');
                const dateStr = `${y}-${m}-${d}`;

                // Sum all sessions for this specific day
                const daySessions = sessions.filter(s => s.date === dateStr);
                const totalMinutes = daySessions.reduce((acc, s) => acc + (s.totalMinutes || 0), 0);
                const hours = Number((totalMinutes / 60).toFixed(1));

                days.push({
                    name: temp.toLocaleDateString("es-ES", { weekday: 'short' }),
                    hours: hours,
                    target: expectedHours
                });
                temp.setDate(temp.getDate() + 1);
            }
            return days;
        } else if (dateRange === "month") {
            const weeks = [];
            const temp = new Date(periodStart);
            const end = new Date(periodEnd);

            let currentWeekStart = new Date(temp);
            let weekNum = 1;

            while (currentWeekStart <= end) {
                const currentWeekEnd = new Date(currentWeekStart);
                currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);
                currentWeekEnd.setHours(23, 59, 59, 999);

                const effectiveEnd = currentWeekEnd > end ? end : currentWeekEnd;

                let totalMinutes = 0;
                let daysCount = 0;

                // Sum sessions in this week range using string comparison for safety
                sessions.forEach(s => {
                    const [y, m, d] = s.date.split('-').map(Number);
                    const sessionDate = new Date(y, m - 1, d);

                    if (sessionDate >= currentWeekStart && sessionDate <= effectiveEnd) {
                        totalMinutes += (s.totalMinutes || 0);
                    }
                });

                let iter = new Date(currentWeekStart);
                while (iter <= effectiveEnd) {
                    if (iter.getDay() !== 0 && iter.getDay() !== 6) daysCount++;
                    iter.setDate(iter.getDate() + 1);
                }

                weeks.push({
                    name: `Sem ${weekNum}`,
                    hours: Number((totalMinutes / 60).toFixed(1)),
                    target: expectedHours * daysCount
                });

                currentWeekStart.setDate(currentWeekStart.getDate() + 7);
                weekNum++;
            }
            return weeks;
        } else { // Quarter
            const months = [];
            const temp = new Date(periodStart);
            for (let i = 0; i < 3; i++) {
                const monthStart = new Date(temp.getFullYear(), temp.getMonth() + i, 1);
                const monthEnd = new Date(temp.getFullYear(), temp.getMonth() + i + 1, 0, 23, 59, 59, 999);

                let totalMinutes = 0;
                sessions.forEach(s => {
                    const [y, m, d] = s.date.split('-').map(Number);
                    const sessionDate = new Date(y, m - 1, d);
                    if (sessionDate >= monthStart && sessionDate <= monthEnd) {
                        totalMinutes += (s.totalMinutes || 0);
                    }
                });

                months.push({
                    name: monthStart.toLocaleDateString('es-ES', { month: 'short' }),
                    hours: Number((totalMinutes / 60).toFixed(1)),
                    target: expectedHours * 22
                });
            }
            return months;
        }
    }, [sessions, dateRange, periodStart, periodEnd, expectedHours]);

    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={dateRange === 'week' ? 40 : 20}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }}
                        dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9', opacity: 0.4 }} />
                    <Bar
                        dataKey="hours"
                        name="hours"
                        radius={[6, 6, 6, 6]}
                        fill="#1A5235"
                        className="fill-[#1A5235] dark:fill-emerald-600"
                    />
                    <Bar
                        dataKey="target"
                        name="target"
                        radius={[6, 6, 6, 6]}
                        fill="#e2e8f0"
                        className="fill-slate-200 dark:fill-slate-700"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

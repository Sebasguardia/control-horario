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
    Cell
} from "recharts";
import { useUserStore } from "@/stores/user-store";
import { ReportService } from "@/services/report-service";
import { useSessionStore } from "@/stores/session-store";

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md">
                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{label}</p>
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#166534]" />
                    <p className="text-sm font-black text-slate-700 dark:text-slate-200">
                        {payload[0].value} horas trabajadas
                    </p>
                </div>
            </div>
        );
    }
    return null;
}

export default function WeeklyChart() {
    const user = useUserStore(state => state.user);
    const { currentSession } = useSessionStore(); // To trigger re-fetch
    const [data, setData] = useState<any[]>([]);
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    useEffect(() => {
        if (!user) return;

        async function fetchData() {
            setIsLoadingStats(true);
            try {
                const now = new Date();
                const weekStart = new Date(now);
                const day = weekStart.getDay();
                const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
                weekStart.setDate(diff);
                weekStart.setHours(0, 0, 0, 0);

                const report = await ReportService.getWeeklyReport(user!.id, weekStart);

                // Transform sessionsPerDay to chart format
                const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
                const chartData = days.map((dayName, index) => {
                    const targetDate = new Date(weekStart);
                    targetDate.setDate(weekStart.getDate() + index);
                    const dateStr = targetDate.toISOString().split('T')[0];

                    const dayData = report.sessionsPerDay.find(d => d.date === dateStr);
                    const hours = dayData ? Math.round(dayData.totalMinutes / 60 * 10) / 10 : 0;

                    return {
                        name: dayName,
                        hours: hours,
                        date: dateStr
                    };
                });

                setData(chartData);
            } catch (error) {
                console.error("Error fetching chart data:", error);
            } finally {
                setIsLoadingStats(false);
            }
        }

        if (user) {
            fetchData();
        } else {
            setIsLoadingStats(false);
        }
    }, [user, currentSession?.status]);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (isLoadingStats && data.length === 0 && user) {
        const skeletonHeights = ['60%', '40%', '80%', '50%', '70%', '45%', '90%'];
        return (
            <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-sm h-full animate-pulse border border-slate-50 dark:border-slate-800">
                <div className="h-6 w-48 bg-slate-100 dark:bg-slate-800 rounded mb-8" />
                <div className="flex items-end justify-between h-[300px] gap-4 px-4">
                    {skeletonHeights.map((height, i) => (
                        <div key={i} className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-xl" style={{ height }} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-[2rem] sm:rounded-[2.5rem] bg-white dark:bg-slate-900 p-5 sm:p-8 shadow-sm h-full border border-slate-50 dark:border-slate-800">
            <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold tracking-tight text-slate-800 dark:text-white">Rendimiento Semanal</h3>
            <div className="h-[300px] sm:h-[400px] w-full min-h-0">
                {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barSize={20}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                                dx={-10}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9', opacity: 0.4 }} />
                            <Bar dataKey="hours" radius={[6, 6, 6, 6]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.hours >= (user?.expected_hours_per_day || 8) ? '#166534' : '#cbd5e1'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}

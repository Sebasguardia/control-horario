"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
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

interface WeeklyData {
    day: string;
    hours: number;
}

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
    const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadWeeklyData = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            // Obtener inicio de semana (domingo)
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            startOfWeek.setHours(0, 0, 0, 0);

            // Obtener datos de la semana
            const { data } = await supabase
                .from('v_daily_stats')
                .select('work_date, total_work_minutes')
                .eq('user_id', user.id)
                .gte('work_date', startOfWeek.toISOString().split('T')[0])
                .order('work_date', { ascending: true });

            // Crear array con todos los días de la semana
            const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
            const weekData: WeeklyData[] = daysOfWeek.map((day, index) => {
                const date = new Date(startOfWeek);
                date.setDate(startOfWeek.getDate() + index);
                const dateStr = date.toISOString().split('T')[0];

                const dayData = data?.find(d => d.work_date === dateStr);
                return {
                    day,
                    hours: dayData ? Math.round((dayData.total_work_minutes || 0) / 60 * 10) / 10 : 0
                };
            });

            setWeeklyData(weekData);
            setLoading(false);
        };

        loadWeeklyData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[450px] flex-col rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 animate-pulse" />
        );
    }

    return (
        <div className="flex h-[450px] flex-col rounded-[1.5rem] bg-white dark:bg-slate-900 p-10 border border-slate-50 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50">
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black tracking-tight text-slate-800 dark:text-white uppercase tracking-widest text-sm">Resumen Semanal</h3>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 capitalize">Análisis de horas por jornada</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-[#166534]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Jornada</span>
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.2} />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }}
                            dy={15}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: "#1e293b", opacity: 0.1, radius: 20 }}
                        />
                        <Bar
                            dataKey="hours"
                            radius={[20, 20, 20, 20]}
                            barSize={50}
                        >
                            {weeklyData.map((_entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={index % 2 === 0 ? "#166534" : "#4ade80"}
                                    fillOpacity={0.9}
                                    className="transition-all duration-500 hover:fill-opacity-100"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

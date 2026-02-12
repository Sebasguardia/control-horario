"use client";

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
import { mockMonthlyData } from "@/mocks/mock-data";
import { TrendingUp } from "lucide-react";

export function TrendsGraph() {
    return (
        <div className="rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 p-8 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 h-64 w-64 translate-x-10 -translate-y-10 rounded-full bg-[#1A5235]/5 dark:bg-emerald-900/20 blur-[100px] pointer-events-none" />

            <div className="relative z-10 mb-8 flex items-end justify-between">
                <div>
                    <h3 className="text-xl font-black tracking-tight text-slate-800 dark:text-white mb-2">Tendencia Mensual</h3>
                    <p className="text-sm font-medium text-slate-400">Comparativa de rendimiento vs objetivos</p>
                </div>
                <div className="text-right hidden sm:block">
                    <div className="flex items-center gap-2 justify-end text-emerald-500 dark:text-emerald-400 mb-1">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-black">+12.5%</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">vs mes anterior</p>
                </div>
            </div>

            <div className="h-[400px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockMonthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

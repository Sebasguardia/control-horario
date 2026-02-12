"use client";

import { motion } from "framer-motion";
import {
    LayoutDashboard, History, Calendar, FileBarChart,
    PieChart, Settings, Timer, Play, Pause, ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";

export const InteractiveDemo = () => {
    const [seconds, setSeconds] = useState(31335); // 08:42:15 en segundos
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let interval: any = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(sec => sec + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <section className="py-24 md:py-40 bg-white dark:bg-slate-950 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
                    <p className="text-[10px] md:text-sm font-black uppercase tracking-[0.4rem] text-emerald-600 mb-6 font-mono md:tracking-[0.6em]">Prueba la Experiencia</p>
                    <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-7xl leading-none underline decoration-emerald-500/20 underline-offset-[12px]">
                        Tu productividad <br /> en tiempo real.
                    </h2>
                </div>

                {/* Dashboard Frame (Laptop/Browser Style) */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative max-w-6xl mx-auto rounded-[2rem] md:rounded-[3rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.1)] dark:shadow-[0_80px_160px_-40px_rgba(0,0,0,0.6)] overflow-hidden"
                >
                    {/* Browser Toolbar Icons */}
                    <div className="h-10 md:h-14 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center px-6 md:px-8 gap-2">
                        <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-slate-200 dark:bg-slate-800" />
                        <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-slate-200 dark:bg-slate-800" />
                        <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-slate-200 dark:bg-slate-800" />
                    </div>

                    <div className="flex h-auto lg:h-[750px] flex-col lg:flex-row">
                        {/* Sidebar (Desktop only) */}
                        <div className="w-full lg:w-72 border-r border-slate-100 dark:border-slate-800 p-8 hidden lg:block">
                            <div className="mb-12">
                                <img
                                    src="https://i.ibb.co/V0m9W2wc/imagen-2026-02-11-234121829.png"
                                    alt="Logo"
                                    className="h-12 w-auto object-contain"
                                />
                            </div>

                            <nav className="space-y-6">
                                {[
                                    { icon: LayoutDashboard, label: "Dashboard", active: true },
                                    { icon: History, label: "Historial" },
                                    { icon: Calendar, label: "Calendario" },
                                    { icon: FileBarChart, label: "Reportes" },
                                    { icon: PieChart, label: "Analytics" },
                                    { icon: Settings, label: "Ajustes" }
                                ].map((item) => (
                                    <div key={item.label} className={`flex items-center gap-4 group cursor-pointer ${item.active ? 'text-emerald-500' : 'text-slate-400'}`}>
                                        <item.icon size={20} className={item.active ? 'text-emerald-500' : 'group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors'} />
                                        <span className={`text-[15px] font-bold ${item.active ? 'font-black' : 'group-hover:text-slate-900 dark:group-hover:text-white transition-colors'}`}>{item.label}</span>
                                        {item.active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                                    </div>
                                ))}
                            </nav>
                        </div>

                        {/* Main Panel */}
                        <div className="flex-1 p-6 md:p-8 lg:p-12 bg-slate-50 dark:bg-slate-950/50 relative">
                            {/* Header Stats */}
                            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
                                {[
                                    { label: "Hoy", value: "08:42h", color: "emerald" },
                                    { label: "Semana", value: "38:15h", color: "slate" },
                                    { label: "Pausas", value: "00:45h", color: "orange" }
                                ].map((stat) => (
                                    <div key={stat.label} className="rounded-2xl md:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 md:p-6">
                                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
                                        <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Main Timer Display */}
                            <div className="rounded-[2.5rem] md:rounded-[4rem] bg-slate-900 dark:bg-black p-8 md:p-12 lg:p-20 text-center text-white relative overflow-hidden group mb-8 md:mb-12 shadow-2xl">
                                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3rem] md:tracking-[0.5em] text-emerald-400 mb-6 md:mb-8 opacity-70">Temporizador Dinámico</p>
                                <motion.span
                                    className="text-5xl sm:text-7xl lg:text-[120px] font-black tabular-nums tracking-tighter leading-none"
                                    animate={{ opacity: isActive ? [0.8, 1, 0.8] : 1 }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    {formatTime(seconds)}
                                </motion.span>

                                <div className="mt-16 flex justify-center gap-6">
                                    <button
                                        onClick={() => setIsActive(!isActive)}
                                        className={`flex h-20 w-56 items-center justify-center gap-4 rounded-3xl transition-all font-black text-xl hover:scale-105 active:scale-95 ${isActive ? 'bg-slate-800 border-2 border-slate-700 hover:bg-slate-700' : 'bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/10'}`}
                                    >
                                        {isActive ? (
                                            <>
                                                <Pause className="fill-current" /> Pausar Día
                                            </>
                                        ) : (
                                            <>
                                                <Play className="fill-current" /> Continuar
                                            </>
                                        )}
                                    </button>
                                    <button className="h-20 w-20 flex items-center justify-center rounded-3xl bg-slate-50 text-slate-900 hover:bg-white transition-all hover:scale-105 active:scale-95">
                                        <ChevronRight size={32} />
                                    </button>
                                </div>

                                {/* Background glow effect */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-1000" />
                            </div>

                            {/* Bottom Chart Section */}
                            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden">
                                <div className="max-w-[200px]">
                                    <h5 className="text-xl font-black text-slate-900 dark:text-white mb-2 leading-tight">Actividad Semanal</h5>
                                    <p className="text-sm font-bold text-slate-400">Progreso automático basado en tus logs diarios.</p>
                                </div>
                                <div className="flex-1 flex justify-between items-end h-24 gap-4 w-full">
                                    {[20, 45, 60, 40, 75, 90, 85].map((h, i) => (
                                        <div key={i} className="flex-1 h-full flex flex-col items-center gap-2">
                                            <div
                                                className="w-full bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg relative overflow-hidden group/bar"
                                                style={{ height: `${h}%` }}
                                            >
                                                <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 rounded-full" />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase">{["L", "M", "M", "J", "V", "S", "D"][i]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

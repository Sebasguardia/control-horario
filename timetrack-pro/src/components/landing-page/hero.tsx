"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Timer, Zap, Layout } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-56 lg:pb-32 overflow-hidden bg-white dark:bg-slate-950">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-emerald-600/5 blur-[150px]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid items-center gap-16 lg:grid-cols-2">

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 mb-8"
                        >
                            <Zap className="h-4 w-4 text-emerald-500 fill-emerald-500" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Control de tiempo de nueva generación</span>
                        </motion.div>

                        <h1 className="text-6xl font-black leading-[0.95] tracking-tighter text-slate-900 dark:text-white sm:text-7xl lg:text-[90px]">
                            Domina tu jornada <br />
                            <span className="text-emerald-600 italic">sin esfuerzo.</span>
                        </h1>

                        <p className="mt-8 max-w-lg text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400 md:text-xl">
                            La herramienta definitiva para profesionales y equipos que buscan precisión, simplicidad y control total sobre sus horarios.
                        </p>

                        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                            <Link href="/register" className="group flex h-16 items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-10 text-lg font-black text-white shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-700 hover:scale-105 active:scale-95">
                                Empezar Gratis
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>

                            <Link href="#" className="flex h-16 items-center justify-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-10 text-lg font-black text-slate-900 dark:text-white transition-all hover:bg-slate-50 dark:hover:bg-slate-800">
                                <Play className="h-4 w-4 fill-current" />
                                Ver Demo
                            </Link>
                        </div>

                        <div className="mt-16 flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-10 w-10 rounded-full border-4 border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                        JS
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-bold text-slate-400">
                                <span className="text-slate-900 dark:text-white font-black">5,000+</span> equipos activos diariamente
                            </p>
                        </div>
                    </motion.div>

                    {/* Dashboard Mockup (Pure CSS/HTML) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 30 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative w-full max-w-[600px] rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                            {/* Mockup Header */}
                            <div className="mb-10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-none">
                                        <Timer className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="h-3 w-32 rounded-full bg-slate-100 dark:bg-slate-800" />
                                        <div className="h-2 w-20 rounded-full bg-slate-50 dark:bg-slate-800/50" />
                                    </div>
                                </div>
                                <div className="h-8 w-24 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
                                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Activo</span>
                                </div>
                            </div>

                            {/* Mockup Timer */}
                            <div className="mb-10 rounded-[2rem] bg-slate-900 dark:bg-black p-10 text-center text-white relative overflow-hidden">
                                <p className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-4 opacity-70 italic">Sesión Actual</p>
                                <span className="relative z-10 text-6xl font-black tabular-nums tracking-tighter">07:42:15</span>
                                <div className="absolute top-[-50%] right-[-20%] h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px]" />
                            </div>

                            {/* Mockup Buttons */}
                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200 dark:shadow-none">
                                    <Zap className="h-5 w-5 fill-current" />
                                </div>
                                <div className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                    <Layout className="h-5 w-5" />
                                </div>
                            </div>

                            {/* Mini Chart Mockup */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end h-32 gap-3 px-2">
                                    {[30, 45, 20, 90, 60, 40, 75].map((h, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-3">
                                            <div
                                                className="w-full bg-emerald-500/10 dark:bg-emerald-500/5 rounded-t-xl relative group"
                                                style={{ height: `${h}%` }}
                                            >
                                                <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 rounded-full" />
                                            </div>
                                            <div className="h-1.5 w-6 rounded-full bg-slate-100 dark:bg-slate-800" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Decorative cards */}
                        <div className="absolute -left-12 bottom-12 z-20 w-44 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 shadow-2xl">
                            <Zap size={24} className="text-emerald-500 mb-4 fill-emerald-500" />
                            <p className="text-2xl font-black text-slate-900 dark:text-white">+32%</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Aumento de Eficiencia</p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export const FinalCTA = () => {
    return (
        <section className="container mx-auto px-6 py-20 pb-48">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="rounded-[4rem] bg-slate-900 dark:bg-[#022C22] p-16 lg:p-32 text-white relative overflow-hidden group text-center"
            >
                {/* Decorative particles */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-10 left-1/4 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <div className="absolute bottom-20 right-1/4 h-3 w-3 rounded-full bg-emerald-500 animate-pulse delay-500" />
                    <div className="absolute top-1/2 right-10 h-2 w-2 rounded-full bg-white animate-pulse delay-1000" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 mb-10 border border-white/10"
                    >
                        <Sparkles size={16} className="text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Eleva tu estándar</span>
                    </motion.div>

                    <h2 className="text-6xl lg:text-[100px] font-black tracking-tighter mb-12 leading-[0.9] text-white">
                        Es hora de ser <br /> <span className="text-emerald-500 italic">el mejor.</span>
                    </h2>

                    <p className="text-xl font-medium text-white/50 mb-16 max-w-2xl leading-relaxed mx-auto">
                        Únete a los profesionales que no dejan nada al azar. <br className="hidden sm:block" /> Empieza ahora y transforma tu gestión horaria para siempre.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                        <Link href="/register" className="h-20 flex items-center justify-center gap-3 rounded-[1.5rem] bg-white px-12 text-xl font-black text-slate-900 shadow-2xl transition-all hover:scale-105 active:scale-95">
                            Comenzar Gratis
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link href="#" className="h-20 flex items-center justify-center rounded-[1.5rem] bg-white/10 border border-white/20 backdrop-blur-xl px-12 text-xl font-black text-white transition-all hover:bg-white/20">
                            Ver Documentación
                        </Link>
                    </div>
                </div>

                {/* Animated background highlights */}
                <div className="absolute top-0 left-0 h-full w-full pointer-events-none overflow-hidden">
                    <div className="absolute -top-1/2 -left-1/4 h-[800px] w-[800px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute -bottom-1/2 -right-1/4 h-[800px] w-[800px] bg-emerald-400/5 rounded-full blur-[100px] animate-pulse delay-1000" />
                </div>
            </motion.div>
        </section>
    );
};

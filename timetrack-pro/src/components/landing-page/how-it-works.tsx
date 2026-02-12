"use client";

import { motion } from "framer-motion";
import { UserPlus, Play, Coffee, FileBarChart } from "lucide-react";

const steps = [
    {
        icon: UserPlus,
        title: "Crea tu cuenta",
        desc: "Registro instantáneo con tu correo para empezar a registrar de inmediato."
    },
    {
        icon: Play,
        title: "Inicia tu jornada",
        desc: "Un solo click para empezar a contar cada segundo de tu productividad."
    },
    {
        icon: Coffee,
        title: "Gestiona pausas",
        desc: "Registra cada descanso con su categoría y mantiene la métrica neta."
    },
    {
        icon: FileBarChart,
        title: "Analiza y exporta",
        desc: "Genera reportes visuales listos para compartir con tu equipo o empresa."
    }
];

export const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-32 bg-slate-50 dark:bg-slate-900 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="mb-16 md:mb-24 text-center">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-[10px] md:text-sm font-black uppercase tracking-[0.4rem] text-emerald-600 mb-6"
                    >
                        Proceso Simplificado
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-6xl"
                    >
                        Optimiza tu flujo en <span className="text-emerald-600 italic">cuatro pasos.</span>
                    </motion.h2>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 hidden lg:block -translate-y-12" />

                    <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                className="relative flex flex-col items-center text-center group"
                            >
                                {/* Step Number / Icon Container */}
                                <div className="mb-8 md:mb-10 relative z-10 h-20 w-20 md:h-24 md:w-24 rounded-[1.5rem] md:rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl flex items-center justify-center transition-all group-hover:bg-emerald-600 group-hover:text-white">
                                    <step.icon size={28} />
                                    <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 h-8 w-8 md:h-10 md:w-10 rounded-full bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center text-xs md:text-sm font-black italic">
                                        0{i + 1}
                                    </div>
                                </div>

                                <h3 className="mb-3 md:mb-4 text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{step.title}</h3>
                                <p className="text-base md:text-lg leading-relaxed text-slate-500 dark:text-slate-400 px-2 md:px-4">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

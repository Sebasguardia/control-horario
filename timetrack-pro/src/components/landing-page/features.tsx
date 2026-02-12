"use client";

import { motion } from "framer-motion";
import { Zap, Clock, Coffee, FileSpreadsheet, BarChart3, Tag } from "lucide-react";

const features = [
    {
        icon: Zap,
        title: "Registro con un click",
        desc: "Entrada y salida instantánea diseñada para que no pierdas ni un segundo."
    },
    {
        icon: Clock,
        title: "Timer en vivo",
        desc: "Visualización en tiempo real de tu jornada activa directamente en tu dashboard."
    },
    {
        icon: Coffee,
        title: "Gestión de pausas",
        desc: "Control total de descansos por categoría: almuerzo, relax o personal."
    },
    {
        icon: FileSpreadsheet,
        title: "Reportes automáticos",
        desc: "Genera documentos PDF y archivos CSV detallados con un solo click."
    },
    {
        icon: BarChart3,
        title: "Gráficos de eficiencia",
        desc: "Visualiza tus patrones de trabajo con estadísticas claras de rendimiento."
    },
    {
        icon: Tag,
        title: "Proyectos y etiquetas",
        desc: "Organiza tu tiempo por clientes, tareas o contextos específicos."
    }
];

export const Features = () => {
    return (
        <section id="features" className="py-32 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-6">
                <div className="mb-16 md:mb-24 text-center">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-[10px] md:text-sm font-black uppercase tracking-[0.4rem] text-emerald-600 mb-6"
                    >
                        Potencia absoluta
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-6xl"
                    >
                        Todo lo que necesitas para <br /> <span className="text-emerald-600 italic">gestionar tu tiempo.</span>
                    </motion.h2>
                </div>

                <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group relative rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 md:p-12 transition-all hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)]"
                        >
                            <div className="mb-8 md:mb-10 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-3xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                                <feature.icon className="h-7 w-7 md:h-9 md:w-9" />
                            </div>
                            <h3 className="mb-4 md:mb-6 text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{feature.title}</h3>
                            <p className="text-base md:text-lg leading-relaxed text-slate-500 dark:text-slate-400">{feature.desc}</p>

                            {/* Accent line */}
                            <div className="absolute bottom-10 left-12 right-12 h-1 bg-emerald-500/0 group-hover:bg-emerald-500/10 rounded-full transition-all" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

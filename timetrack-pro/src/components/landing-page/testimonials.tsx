"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        name: "Carlos Méndez",
        role: "Project Manager @ Nexus Labs",
        initials: "CM",
        text: "TimeTrack Pro ha transformado la forma en que gestionamos los tiempos de entrega. La simplicidad de la interfaz es lo que realmente nos convenció.",
        stars: 5,
        color: "bg-emerald-500"
    },
    {
        name: "Elena Rodríguez",
        role: "Freelance Designer",
        initials: "ER",
        text: "Como freelancer, necesito precisión. Los reportes PDF son impecables y me ahorran horas de administración al final de cada mes.",
        stars: 5,
        color: "bg-slate-900"
    },
    {
        name: "Jorge Sánchez",
        role: "COO @ Forge Agency",
        initials: "JS",
        text: "La mejor invetrsión para nuestro equipo. La visibilidad que tenemos ahora sobre la carga de trabajo es total y muy intuitiva.",
        stars: 5,
        color: "bg-emerald-600"
    }
];

export const Testimonials = () => {
    return (
        <section className="py-32 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-6">
                <div className="mb-24 text-center">
                    <p className="text-sm font-black uppercase tracking-[0.4em] text-emerald-600 mb-6">Testimonios</p>
                    <h2 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-6xl">
                        Lo que dicen <br /> <span className="text-emerald-600 italic">nuestros usuarios.</span>
                    </h2>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="relative rounded-[2.5rem] bg-white dark:bg-slate-900 p-12 border border-slate-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                        >
                            <Quote size={40} className="absolute top-10 right-10 text-slate-100 dark:text-slate-800" />

                            <div className="flex gap-1 mb-6">
                                {[...Array(t.stars)].map((_, i) => (
                                    <Star key={i} size={16} className="text-emerald-500 fill-emerald-500" />
                                ))}
                            </div>

                            <p className="text-xl font-medium leading-relaxed text-slate-600 dark:text-slate-400 mb-10 italic">
                                "{t.text}"
                            </p>

                            <div className="flex items-center gap-4">
                                <div className={`h-14 w-14 rounded-2xl ${t.color} flex items-center justify-center text-white font-black text-xl italic`}>
                                    {t.initials}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 dark:text-white tracking-tight">{t.name}</h4>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

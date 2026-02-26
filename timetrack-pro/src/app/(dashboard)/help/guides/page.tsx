"use strict";
"use client";

import { useEffect } from "react";
import { usePageStore } from "@/stores/page-store";
import {
    BookOpen,
    ArrowLeft,
    Clock,
    PlayCircle,
    CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function GuidesPage() {
    const setTitle = usePageStore((state) => state.setTitle);

    useEffect(() => {
        setTitle("Guías de Inicio Rápido", "Domina la plataforma en pocos minutos.");
    }, [setTitle]);

    const guides = [
        {
            title: "Primeros Pasos",
            duration: "2 min",
            category: "Básico",
            steps: [
                "Configura tu perfil y horario laboral.",
                "Explora el Dashboard principal.",
                "Realiza tu primer registro de entrada."
            ]
        },
        {
            title: "Gestión de Pausas",
            duration: "3 min",
            category: "Intermedio",
            steps: [
                "Cómo iniciar una pausa (almuerzo, café).",
                "Seguimiento del tiempo de descanso.",
                "Retomar la jornada laboral correctamente."
            ]
        },
        {
            title: "Reportes y Exportación",
            duration: "5 min",
            category: "Avanzado",
            steps: [
                "Visualizar tu historial mensual.",
                "Filtrar por fechas específicas.",
                "Exportar tus reportes a PDF o Excel."
            ]
        }
    ];

    return (
        <div className="space-y-8">
            <Link
                href="/help"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Volver al Centro de Ayuda
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                {guides.map((guide, i) => (
                    <div
                        key={i}
                        className="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 p-6 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:border-blue-500/20 transition-all duration-300"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <BookOpen className="h-24 w-24 text-blue-500 -rotate-12 transform translate-x-4 -translate-y-4" />
                        </div>

                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className={
                                    `text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ` +
                                    (guide.category === 'Básico' ? 'bg-emerald-100 text-emerald-600' :
                                        guide.category === 'Intermedio' ? 'bg-amber-100 text-amber-600' :
                                            'bg-purple-100 text-purple-600')
                                }>
                                    {guide.category}
                                </span>
                                <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                                    <Clock className="h-3 w-3" />
                                    {guide.duration}
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {guide.title}
                            </h3>

                            <ul className="space-y-3">
                                {guide.steps.map((step, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                                        <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800 py-3 text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all">
                                <PlayCircle className="h-4 w-4" />
                                Ver Tutorial
                            </button>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

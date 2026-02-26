"use strict";
"use client";

import { useEffect } from "react";
import { usePageStore } from "@/stores/page-store";
import {
    HelpCircle,
    ArrowLeft,
    Search,
    FileText,
    ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function KnowledgeBasePage() {
    const setTitle = usePageStore((state) => state.setTitle);

    useEffect(() => {
        setTitle("Base de Conocimiento", "Artículos detallados y documentación técnica.");
    }, [setTitle]);

    const articles = [
        {
            category: "Configuración",
            items: [
                { title: "Personalizar tu perfil y cuenta", views: 245 },
                { title: "Sincronizar calendario con Google", views: 189 },
                { title: "Configurar notificaciones por correo", views: 132 }
            ]
        },
        {
            category: "Reportes",
            items: [
                { title: "Cómo interpretar tu informe mensual", views: 301 },
                { title: "Entendiendo las métricas de asistencia", views: 275 },
                { title: "Exportación avanzada para nómina", views: 156 }
            ]
        },
        {
            category: "Solución de Problemas",
            items: [
                { title: "No puedo iniciar sesión", views: 420 },
                { title: "Mi ubicación no se detecta correctamente", views: 310 },
                { title: "Error al cargar la página en Firefox", views: 98 }
            ]
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <Link
                    href="/help"
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al Centro de Ayuda
                </Link>
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar artículo..."
                        className="pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm font-medium focus:ring-2 focus:ring-amber-500/50"
                    />
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                {articles.map((section, i) => (
                    <div
                        key={i}
                        className="group overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-amber-500/20 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center gap-3 p-6 border-b border-slate-100 dark:border-slate-800 bg-amber-50/50 dark:bg-amber-900/10">
                            <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-200 flex items-center justify-center">
                                <FileText className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white">{section.category}</h3>
                        </div>

                        <ul className="p-4 space-y-1">
                            {section.items.map((item, idx) => (
                                <li key={idx}>
                                    <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group/item text-left">
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover/item:text-amber-600 dark:group-hover/item:text-amber-400 transition-colors">
                                            {item.title}
                                        </span>
                                        <ExternalLink className="h-3.5 w-3.5 text-slate-300 group-hover/item:text-amber-500 opacity-0 group-hover/item:opacity-100 transition-all transform group-hover/item:translate-x-1" />
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-center">
                            <button className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-amber-600 transition-colors">
                                Ver todos los artículos
                            </button>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

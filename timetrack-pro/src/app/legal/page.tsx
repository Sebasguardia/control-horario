"use strict";
"use client";

import { useEffect, useState } from "react";
import { usePageStore } from "@/stores/page-store";
import {
    Shield,
    Lock,
    FileText,
    Scale,
    Check,
    ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function LegalPage() {
    const setTitle = usePageStore((state) => state.setTitle);
    const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

    useEffect(() => {
        setTitle("Legal", "Términos de Servicio y Privacidad");
    }, [setTitle]);

    const termsContent = [
        {
            title: "1. Aceptación de los Términos",
            content: "Al acceder y utilizar TimeTrack Pro, aceptas estar sujeto a estos Términos de Servicio y a todas las leyes y regulaciones aplicables. Si no estás de acuerdo con alguno de estos términos, tienes prohibido usar o acceder a este sitio."
        },
        {
            title: "2. Licencia de Uso",
            content: "Se concede permiso para descargar temporalmente una copia de los materiales (información o software) en el sitio web de TimeTrack Pro solo para visualización transitoria personal y no comercial. Esta es la concesión de una licencia, no una transferencia de título."
        },
        {
            title: "3. Descargo de Responsabilidad",
            content: "Los materiales en el sitio web de TimeTrack Pro se proporcionan 'tal cual'. TimeTrack Pro no ofrece garantías, expresas o implícitas, y por la presente renuncia y niega todas las demás garantías, incluidas, entre otras, las garantías implícitas o las condiciones de comerciabilidad, idoneidad para un propósito particular o no infracción de propiedad intelectual u otra violación de derechos."
        },
        {
            title: "4. Limitaciones",
            content: "En ningún caso TimeTrack Pro o sus proveedores serán responsables de ningún daño (incluidos, entre otros, daños por pérdida de datos o ganancias, o debido a la interrupción del negocio) que surjan del uso o la incapacidad de usar los materiales en el sitio web de TimeTrack Pro."
        }
    ];

    const privacyContent = [
        {
            title: "1. Información que Recopilamos",
            content: "Recopilamos información que nos proporcionas directamente cuando te registras, como tu nombre, dirección de correo electrónico y datos relacionados con tu horario laboral. También recopilamos automáticamente cierta información técnica cuando utilizas nuestra plataforma."
        },
        {
            title: "2. Uso de la Información",
            content: "Utilizamos la información recopilada para operar, mantener y mejorar nuestros servicios, así como para comunicarnos contigo, responder a tus consultas y enviarte actualizaciones importantes sobre tu cuenta."
        },
        {
            title: "3. Protección de Datos",
            content: "Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger tus datos personales contra el acceso no autorizado, la alteración, la divulgación o la destrucción."
        },
        {
            title: "4. Cookies y Rastreo",
            content: "Utilizamos cookies y tecnologías similares para mejorar tu experiencia de usuario, analizar tendencias y administrar el sitio web. Puedes configurar tu navegador para rechazar todas las cookies, pero esto puede limitar tu uso de algunas funciones."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header with Back Button */}
                <div className="flex items-center justify-between">
                    <Link href="/register" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al Registro
                    </Link>
                    <div className="flex items-center gap-2">
                        <Shield className="h-6 w-6 text-emerald-600" />
                        <span className="text-xl font-black text-slate-800 dark:text-white">Legal</span>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl flex items-center gap-1 shadow-sm">
                        <button
                            onClick={() => setActiveTab('terms')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'terms'
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                        >
                            <Scale className="h-4 w-4" />
                            Términos de Servicio
                        </button>
                        <button
                            onClick={() => setActiveTab('privacy')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'privacy'
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                        >
                            <Shield className="h-4 w-4" />
                            Política de Privacidad
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* TOC Sidebar (Sticky) */}
                    <div className="lg:col-span-1 hidden lg:block">
                        <div className="sticky top-8 space-y-6">
                            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-lg shadow-slate-200/50 dark:shadow-none">
                                <h4 className="font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                    {activeTab === 'terms' ? <FileText className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                    Contenido
                                </h4>
                                <ul className="space-y-3">
                                    {(activeTab === 'terms' ? termsContent : privacyContent).map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                            <Check className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                                            {item.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="text-center">
                                <p className="text-xs text-slate-400">Última actualización: <br /><strong>13 de Febrero, 2026</strong></p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                                    <div className="mb-10 text-center">
                                        <div className={`inline-flex items-center justify-center p-4 rounded-2xl mb-6 ${activeTab === 'terms' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-500'
                                            }`}>
                                            {activeTab === 'terms' ? <Scale className="h-10 w-10" /> : <Shield className="h-10 w-10" />}
                                        </div>
                                        <h2 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white mb-4">
                                            {activeTab === 'terms' ? 'Términos de Servicio' : 'Política de Privacidad'}
                                        </h2>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                                            {activeTab === 'terms'
                                                ? 'Por favor, lee estos términos cuidadosamente antes de usar nuestros servicios.'
                                                : 'Tu privacidad es importante para nosotros. Así es como protegemos tus datos.'}
                                        </p>
                                    </div>

                                    <div className="space-y-12">
                                        {(activeTab === 'terms' ? termsContent : privacyContent).map((section, i) => (
                                            <div key={i} className="relative pl-8 border-l-2 border-slate-100 dark:border-slate-800">
                                                <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700" />
                                                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-3">
                                                    {section.title}
                                                </h3>
                                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                                                    {section.content}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

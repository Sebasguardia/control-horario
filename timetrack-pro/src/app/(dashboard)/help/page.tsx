"use client";

import { useEffect } from "react";
import { usePageStore } from "@/stores/page-store";
import {
    HelpCircle,
    BookOpen,
    MessageCircle,
    ChevronRight,
    Search,
    Clock,
    FileText,
    Shield,
    Zap,
    LifeBuoy
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function HelpPage() {
    const setTitle = usePageStore((state) => state.setTitle);

    useEffect(() => {
        setTitle("Centro de Ayuda", "¿En qué podemos asistirte hoy?");
    }, [setTitle]);

    const faqs = [
        {
            q: "¿Cómo inicio mi jornada laboral?",
            a: "Desde el Dashboard, haz clic en 'Comenzar Jornada'. El contador iniciará automáticamente. Recuerda registrar tu salida al finalizar.",
            icon: Zap
        },
        {
            q: "¿Cómo registro una pausa?",
            a: "Durante una jornada activa, usa el botón de 'Pausa' (ícono de taza). Podrás seleccionar el tipo de descanso: Almuerzo, Café o Personal.",
            icon: Clock
        },
        {
            q: "¿Puedo corregir un registro pasado?",
            a: "Sí, ve a la sección 'Historial', localiza la fecha y usa el menú de opciones (tres puntos) para solicitar una edición.",
            icon: FileText
        },
        {
            q: "¿Qué hago si olvidé marcar mi salida?",
            a: "El sistema cerrará tu jornada tras 12 horas. Deberás justificar el cierre automático al día siguiente en el Dashboard.",
            icon: Shield
        }
    ];

    const resources = [
        {
            title: "Guías de Inicio Rápido",
            desc: "Domina TimeTrack Pro en minutos.",
            icon: BookOpen,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-100 dark:border-blue-900/30"
        },
        {
            title: "Base de Conocimiento",
            desc: "Artículos detallados y tutoriales.",
            icon: HelpCircle,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            border: "border-amber-100 dark:border-amber-900/30"
        },
        {
            title: "Soporte Técnico",
            desc: "Contacta con nuestro equipo experto.",
            icon: LifeBuoy,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            border: "border-emerald-100 dark:border-emerald-900/30"
        }
    ];

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-800 dark:text-white">Ayuda y Soporte</h1>
                <p className="mt-2 text-base font-bold text-slate-400 dark:text-slate-500">Encuentra respuestas, guías y asistencia técnica.</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-10"
            >
                {/* Hero Search Section */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-[#1A5235] dark:bg-emerald-900 p-12 text-center shadow-2xl shadow-[#1A5235]/20 dark:shadow-emerald-900/20 group">
                    <div className="absolute top-0 right-0 h-96 w-96 translate-x-20 -translate-y-20 rounded-full bg-emerald-400 dark:bg-emerald-500 opacity-10 blur-[100px] transition-transform duration-700 group-hover:scale-110 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-10 translate-y-10 rounded-full bg-teal-400 dark:bg-teal-500 opacity-10 blur-[80px] transition-transform duration-700 group-hover:scale-110 pointer-events-none" />

                    <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-3 tracking-tight">¿Tienes alguna pregunta?</h2>
                            <p className="text-emerald-100 dark:text-emerald-200 font-medium">Busca en nuestra documentación o explora los temas populares.</p>
                        </div>

                        <div className="relative group/input">
                            <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full transition-opacity opacity-0 group-hover/input:opacity-100" />
                            <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-full p-2 shadow-xl shadow-black/10 transition-transform group-focus-within/input:scale-[1.02]">
                                <Search className="ml-4 h-6 w-6 text-slate-400 dark:text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Buscar 'cómo exportar PDF'..."
                                    className="flex-1 bg-transparent px-4 py-3 text-lg font-bold text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none"
                                />
                                <button className="rounded-full bg-[#1A5235] dark:bg-emerald-600 px-8 py-3 text-sm font-black text-white transition-all hover:bg-[#14422b] dark:hover:bg-emerald-700 hover:shadow-lg active:scale-95">
                                    BUSCAR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resource Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {resources.map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -4 }}
                            className={cn(
                                "group relative overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 p-8 border border-slate-100 dark:border-slate-800 hover:shadow-xl dark:shadow-none hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300",
                                item.border
                            )}
                        >
                            <div className={cn("mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 group-hover:rotate-3", item.bg, item.color)}>
                                <item.icon className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white">{item.title}</h3>
                            <p className="mt-2 text-sm font-bold text-slate-400 dark:text-slate-500">{item.desc}</p>

                            <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 transition-colors group-hover:text-slate-800 dark:group-hover:text-slate-200">
                                <span>Explorar</span>
                                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="lg:sticky lg:top-8">
                        <span className="inline-block rounded-xl bg-orange-50 dark:bg-orange-900/20 px-4 py-2 text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-6 border border-orange-100 dark:border-orange-900/30">
                            Preguntas Frecuentes
                        </span>
                        <h3 className="text-4xl font-black text-slate-800 dark:text-white leading-tight mb-6">
                            Resolvemos tus dudas <br />
                            <span className="text-slate-300 dark:text-slate-600">al instante.</span>
                        </h3>
                        <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-8 max-w-md">
                            Hemos recopilado las preguntas más comunes de nuestros usuarios para que no pierdas tiempo.
                        </p>
                        <button className="flex items-center gap-3 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-8 py-4 text-sm font-black text-slate-600 dark:text-slate-300 transition-all hover:border-slate-800 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700">
                            <MessageCircle className="h-5 w-5" />
                            CHATEAR CON SOPORTE
                        </button>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 transition-all hover:border-[#1A5235]/20 dark:hover:border-emerald-500/20 hover:shadow-lg dark:hover:shadow-none hover:shadow-[#1A5235]/5"
                            >
                                <div className="flex gap-5">
                                    <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors group-hover:bg-[#1A5235] dark:group-hover:bg-emerald-600 group-hover:text-white">
                                        <faq.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-slate-800 dark:text-white mb-2">{faq.q}</h4>
                                        <p className="text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Contact Banner */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-8 py-16 text-center md:px-16">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 opacity-90" />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h3 className="text-3xl font-black text-white mb-4">¿Necesitas asistencia personalizada?</h3>
                        <p className="text-slate-400 font-medium mb-10 text-lg">Nuestro equipo de soporte está disponible de Lunes a Viernes, de 9:00 a 18:00 hrs.</p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="w-full sm:w-auto rounded-2xl bg-[#1A5235] dark:bg-emerald-600 px-8 py-4 text-sm font-black text-white shadow-xl shadow-[#1A5235]/30 dark:shadow-emerald-900/30 transition-all hover:bg-[#14422b] dark:hover:bg-emerald-700 hover:-translate-y-1 active:scale-95">
                                ABRIR TICKET
                            </button>
                            <button className="w-full sm:w-auto rounded-2xl bg-white/5 border border-white/10 px-8 py-4 text-sm font-black text-white transition-all hover:bg-white/10 hover:-translate-y-1 active:scale-95">
                                ENVIAR EMAIL
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

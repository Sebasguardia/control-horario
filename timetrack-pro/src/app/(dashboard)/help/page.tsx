"use client";

import { useEffect, useState } from "react";
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
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function HelpPage() {
    const setTitle = usePageStore((state) => state.setTitle);
    const [searchQuery, setSearchQuery] = useState("");

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

    const filteredFaqs = faqs.filter(faq =>
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const resources = [
        {
            title: "Guías de Inicio Rápido",
            desc: "Domina TimeTrack Pro en minutos.",
            icon: BookOpen,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-100 dark:border-blue-900/30",
            href: "/help/guides"
        },
        {
            title: "Base de Conocimiento",
            desc: "Artículos detallados y tutoriales.",
            icon: HelpCircle,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            border: "border-amber-100 dark:border-amber-900/30",
            href: "/help/knowledge"
        },
        {
            title: "Soporte Técnico",
            desc: "Contacta con nuestro equipo experto.",
            icon: LifeBuoy,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            border: "border-emerald-100 dark:border-emerald-900/30",
            href: "/help/support"
        }
    ];

    return (
        <div className="space-y-6 lg:space-y-10">
            {/* Header Section */}
            <div className="px-2 sm:px-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-800 dark:text-white">Ayuda y Soporte</h1>
                <p className="mt-1 sm:mt-2 text-sm sm:text-base font-bold text-slate-400 dark:text-slate-500">Encuentra respuestas, guías y asistencia técnica.</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 lg:space-y-10 px-1 sm:px-0"
            >
                {/* Hero Search Section */}
                <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-[#1A5235] dark:bg-emerald-900 p-6 sm:p-10 lg:p-12 text-center shadow-2xl shadow-[#1A5235]/20 dark:shadow-emerald-900/20 group">
                    <div className="absolute top-0 right-0 h-96 w-96 translate-x-20 -translate-y-20 rounded-full bg-emerald-400 dark:bg-emerald-500 opacity-10 blur-[100px] transition-transform duration-700 group-hover:scale-110 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-10 translate-y-10 rounded-full bg-teal-400 dark:bg-teal-500 opacity-10 blur-[80px] transition-transform duration-700 group-hover:scale-110 pointer-events-none" />

                    <div className="relative z-10 max-w-2xl mx-auto space-y-6 sm:space-y-8">
                        <div>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-2 sm:mb-3 tracking-tight">¿Tienes alguna pregunta?</h2>
                            <p className="text-sm sm:text-base text-emerald-100 dark:text-emerald-200 font-medium">Busca en nuestra documentación o explora los temas populares.</p>
                        </div>

                        <div className="relative group/input">
                            <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full transition-opacity opacity-0 group-hover/input:opacity-100" />
                            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white dark:bg-slate-900 rounded-2xl sm:rounded-full p-2 shadow-xl shadow-black/10 transition-transform group-focus-within/input:scale-[1.02] gap-2 sm:gap-0">
                                <div className="flex items-center flex-1">
                                    <Search className="ml-3 sm:ml-4 h-5 w-5 sm:h-6 sm:w-6 text-slate-400 dark:text-slate-500" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Buscar 'cómo exportar PDF'..."
                                        className="flex-1 bg-transparent px-3 sm:px-4 py-2.5 sm:py-3 text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none"
                                    />
                                </div>
                                <button className="rounded-xl sm:rounded-full bg-[#1A5235] dark:bg-emerald-600 px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-black text-white transition-all hover:bg-[#14422b] dark:hover:bg-emerald-700 hover:shadow-lg active:scale-95">
                                    BUSCAR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resource Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {resources.map((item, i) => (
                        <Link href={item.href} key={i}>
                            <motion.div
                                whileHover={{ y: -4 }}
                                className={cn(
                                    "group h-full relative overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-100 dark:border-slate-800 hover:shadow-xl dark:shadow-none hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300",
                                    item.border
                                )}
                            >
                                <div className={cn("mb-4 sm:mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl transition-transform group-hover:scale-110 group-hover:rotate-3", item.bg, item.color)}>
                                    <item.icon className="h-7 w-7 sm:h-8 sm:w-8" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white">{item.title}</h3>
                                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500">{item.desc}</p>

                                <div className="mt-6 sm:mt-8 flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 transition-colors group-hover:text-slate-800 dark:group-hover:text-slate-200">
                                    <span>Explorar</span>
                                    <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                    <div className="lg:sticky lg:top-8">
                        <span className="inline-block rounded-xl bg-orange-50 dark:bg-orange-900/20 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-4 sm:mb-6 border border-orange-100 dark:border-orange-900/30">
                            Preguntas Frecuentes
                        </span>
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 dark:text-white leading-tight mb-4 sm:mb-6">
                            Resolvemos tus dudas <br className="hidden sm:block" />
                            <span className="text-slate-300 dark:text-slate-600">al instante.</span>
                        </h3>
                        <p className="text-base sm:text-lg font-medium text-slate-500 dark:text-slate-400 mb-6 sm:mb-8 max-w-md">
                            Hemos recopilado las preguntas más comunes de nuestros usuarios para que no pierdas tiempo.
                        </p>
                        <Link href="/help/support">
                            <button
                                className="flex items-center justify-center sm:justify-start gap-3 w-full sm:w-auto rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-black text-slate-600 dark:text-slate-300 transition-all hover:border-slate-800 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                                CHATEAR CON SOPORTE
                            </button>
                        </Link>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        {filteredFaqs.length > 0 ? (
                            <Accordion type="single" collapsible className="w-full space-y-4">
                                {filteredFaqs.map((faq, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 sm:px-8 transition-all hover:border-[#1A5235]/20 dark:hover:border-emerald-500/20 hover:shadow-lg dark:hover:shadow-none hover:shadow-[#1A5235]/5"
                                    >
                                        <AccordionItem value={`item-${i}`} className="border-none">
                                            <AccordionTrigger className="hover:no-underline py-6">
                                                <div className="flex gap-4 sm:gap-5 text-left items-center">
                                                    <div className="shrink-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors group-hover:bg-[#1A5235] dark:group-hover:bg-emerald-600 group-hover:text-white">
                                                        <faq.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                                    </div>
                                                    <h4 className="text-base sm:text-lg font-black text-slate-800 dark:text-white">{faq.q}</h4>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-6 pl-[4.5rem] sm:pl-[5.25rem]">
                                                <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                                                    {faq.a}
                                                </p>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </motion.div>
                                ))}
                            </Accordion>
                        ) : (
                            <div className="text-center py-10 opacity-50">
                                <Search className="h-10 w-10 mx-auto mb-2" />
                                <p>No se encontraron resultados</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact Banner */}
                <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-slate-900 px-6 sm:px-8 md:px-16 py-12 sm:py-16 text-center">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 opacity-90" />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-3 sm:mb-4">¿Necesitas asistencia personalizada?</h3>
                        <p className="text-sm sm:text-base lg:text-lg text-slate-400 font-medium mb-8 sm:mb-10">Nuestro equipo de soporte está disponible de Lunes a Viernes, de 9:00 a 18:00 hrs.</p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
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

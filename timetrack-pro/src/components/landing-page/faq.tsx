"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
    {
        q: "¿Puedo usar TimeTrack Pro gratis?",
        a: "Absolutamente. Tenemos un plan gratuito robusto diseñado para profesionales individuales y freelancers que no necesiten exportaciones avanzadas ni soporte prioritario."
    },
    {
        q: "¿Mis datos están seguros?",
        a: "La seguridad es nuestra obsesión. Utilizamos Supabase con encriptación de nivel bancario y tus registros nunca se comparten con terceros ni se utilizan para otros fines."
    },
    {
        q: "¿Funciona en dispositivos móviles?",
        a: "Sí, TimeTrack Pro es una aplicación PWA (Progressive Web App) totalmente responsive que funciona perfectamente en cualquier navegador móvil, iOS o Android."
    },
    {
        q: "¿Puedo exportar mis reportes?",
        a: "Por supuesto. Dependiendo de tu plan, puedes exportar tu historial en formato CSV (compatible con Excel) o PDF profesional generado automáticamente."
    },
    {
        q: "¿Hay integración con otras herramientas?",
        a: "Actualmente ofrecemos exportación nativa. Las integraciones con Zapier y APIs personalizadas están disponibles en nuestro plan Team."
    }
];

export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-32 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-20">
                    <div className="lg:w-1/3">
                        <p className="text-sm font-black uppercase tracking-[0.4em] text-emerald-600 mb-6">Preguntas Frecuentes</p>
                        <h2 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-8 leading-none">
                            Resolvemos tus <br /> <span className="text-emerald-600 italic">dudas.</span>
                        </h2>
                        <p className="text-lg font-medium text-slate-500 dark:text-slate-400">
                            Si no encuentras lo que buscas, nuestro equipo de soporte está listo para ayudarte en cualquier momento.
                        </p>
                    </div>

                    <div className="flex-1 space-y-4">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className="rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    className="flex w-full items-center justify-between p-8 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                >
                                    <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{faq.q}</span>
                                    <div className="shrink-0 h-10 w-10 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center text-emerald-500">
                                        {openIndex === i ? <Minus size={20} /> : <Plus size={20} />}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {openIndex === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="p-8 pt-0 text-lg font-medium text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800/50">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

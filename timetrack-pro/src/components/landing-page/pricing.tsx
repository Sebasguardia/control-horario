"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { useState } from "react";

const plans = [
    {
        name: "Free",
        price: 0,
        desc: "Para profesionales individuales",
        features: [
            { text: "Registro de jornada", included: true },
            { text: "Timer en vivo", included: true },
            { text: "Exportación CSV Básica", included: true },
            { text: "Reportes PDF", included: false },
            { text: "Soporte Prioritario", included: false },
        ]
    },
    {
        name: "Pro",
        price: 9,
        popular: true,
        desc: "Potencia tu registro avanzado",
        features: [
            { text: "Todo lo del Free", included: true },
            { text: "Exportación PDF Ilimitada", included: true },
            { text: "Analytics Avanzados", included: true },
            { text: "Gestión de Proyectos", included: true },
            { text: "Sin Anuncios", included: true },
        ]
    },
    {
        name: "Team",
        price: 29,
        desc: "Colaboración sin límites",
        features: [
            { text: "Todo lo del Pro", included: true },
            { text: "Usuarios Ilimitados", included: true },
            { text: "API Access", included: true },
            { text: "Soporte 24/7", included: true },
            { text: "Consola de Admin", included: true },
        ]
    }
];

export const Pricing = () => {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <section id="pricing" className="py-32 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-6">
                <div className="mb-24 text-center">
                    <p className="text-sm font-black uppercase tracking-[0.4em] text-emerald-600 mb-6">Inversión Inteligente</p>
                    <h2 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-6xl mb-12">
                        Planes que escalan <br /> <span className="text-emerald-600 italic">contigo.</span>
                    </h2>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => setIsYearly(false)}
                            className={`text-sm font-black uppercase tracking-widest ${!isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}
                        >
                            Mensual
                        </button>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="relative h-10 w-20 rounded-full bg-slate-100 dark:bg-slate-800 p-1"
                        >
                            <motion.div
                                animate={{ x: isYearly ? 40 : 0 }}
                                className="h-8 w-8 rounded-full bg-emerald-600"
                            />
                        </button>
                        <button
                            onClick={() => setIsYearly(true)}
                            className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 ${isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}
                        >
                            Anual
                            <span className="rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-600 font-black">-20%</span>
                        </button>
                    </div>
                </div>

                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative flex flex-col rounded-[3rem] p-12 transition-all hover:scale-[1.02] ${plan.popular ? 'bg-slate-900 dark:bg-emerald-900/10 border-2 border-emerald-500 text-white shadow-2xl shadow-emerald-500/20' : 'bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white'}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-10 right-10 rounded-full bg-emerald-600 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
                                    Más Popular
                                </div>
                            )}

                            <h3 className="text-3xl font-black mb-2 tracking-tight">{plan.name}</h3>
                            <p className={`text-lg font-medium mb-12 ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>{plan.desc}</p>

                            <div className="mb-12 flex items-baseline gap-2">
                                <span className="text-7xl font-black tracking-tighter">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={isYearly ? "yearly" : "monthly"}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                        >
                                            ${isYearly ? (plan.price * 12 * 0.8).toFixed(2) : plan.price}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                                <span className={`text-lg font-bold ${plan.popular ? 'opacity-60' : 'text-slate-400'}`}>/ {isYearly ? "año" : "mes"}</span>
                            </div>

                            <ul className="mb-12 space-y-5 flex-1">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className={`flex items-center gap-4 font-bold ${feature.included ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                                        {feature.included ? <Check size={20} className="text-emerald-500 shrink-0" /> : <X size={20} className="shrink-0" />}
                                        <span className="text-[15px]">{feature.text}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`h-16 w-full rounded-[1.2rem] font-black transition-all active:scale-95 ${plan.popular ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-500/20' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'}`}>
                                Comience Ahora
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

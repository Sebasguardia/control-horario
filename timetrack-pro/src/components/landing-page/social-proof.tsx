"use client";

import { motion } from "framer-motion";

const companies = [
    "Acme Corp", "Nexus Labs", "Orbit Studio", "Slate Digital", "Forge Agency",
    "Acme Corp", "Nexus Labs", "Orbit Studio", "Slate Digital", "Forge Agency"
];

export const SocialProof = () => {
    return (
        <section className="bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-12 overflow-hidden">
            <div className="container mx-auto px-6 mb-8 text-center lg:text-left">
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                    Líderes de industria que confían en nosotros
                </p>
            </div>

            <div className="flex relative items-center">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="flex items-center gap-24 whitespace-nowrap px-12"
                >
                    {companies.map((company, i) => (
                        <div key={i} className="flex items-center gap-2 text-2xl font-black italic tracking-tighter text-slate-300 dark:text-slate-700 hover:text-emerald-500 dark:hover:text-emerald-500 transition-colors pointer-events-none">
                            <span>{company}</span>
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </div>
                    ))}
                </motion.div>

                {/* Gradient fades */}
                <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-900 z-10" />
                <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-slate-50 to-transparent dark:from-slate-900 z-10" />
            </div>
        </section>
    );
};

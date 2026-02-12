"use client";

import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, MapPin, Phone } from "lucide-react";

export const Contact = () => {
    return (
        <section id="contact" className="py-32 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-20">
                    <div className="lg:w-1/3">
                        <p className="text-sm font-black uppercase tracking-[0.4em] text-emerald-600 mb-6">Contacto</p>
                        <h2 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-8 leading-none">
                            ¿Necesitas ayuda <br /> <span className="text-emerald-600 italic">personalizada?</span>
                        </h2>
                        <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-12">
                            Nuestro equipo está disponible para resolver tus dudas técnicas o comerciales en menos de 24 horas.
                        </p>

                        <div className="space-y-8">
                            {[
                                { icon: Mail, label: "Email", value: "soporte@timetrack.pro" },
                                { icon: MapPin, label: "Sede Central", value: "Remoto 100% - Digital First" },
                                { icon: Phone, label: "Ventas", value: "+34 900 000 000" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-emerald-500 shrink-0">
                                        <item.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{item.label}</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="rounded-[3rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-8 lg:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none"
                        >
                            <form className="grid gap-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Nombre Completo</label>
                                        <input
                                            type="text"
                                            placeholder="Tu nombre..."
                                            className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Email Corporativo</label>
                                        <input
                                            type="email"
                                            placeholder="ejemplo@empresa.com"
                                            className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Asunto</label>
                                    <select className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer">
                                        <option>Consulta General</option>
                                        <option>Soporte Técnico</option>
                                        <option>Plan Team / Ventas</option>
                                        <option>Otro</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Mensaje</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Cuéntanos cómo podemos ayudarte..."
                                        className="w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
                                    />
                                </div>

                                <button className="h-16 w-full flex items-center justify-center gap-3 rounded-2xl bg-slate-900 dark:bg-emerald-600 text-white font-black text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-200/50 dark:shadow-emerald-900/20">
                                    Enviar Mensaje
                                    <Send size={18} />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

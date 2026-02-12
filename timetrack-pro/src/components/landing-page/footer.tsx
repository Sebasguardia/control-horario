"use client";

import { Timer, Twitter, Linkedin, Instagram, Github, Heart } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="bg-white dark:bg-slate-950 py-32 border-t border-slate-100 dark:border-slate-800">
            <div className="container mx-auto px-6">
                <div className="grid gap-20 lg:grid-cols-12 mb-32">
                    {/* Logo and Tagline */}
                    <div className="lg:col-span-5">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-emerald-600 text-white shadow-xl">
                                <Timer className="h-6 w-6" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter italic uppercase text-slate-900 dark:text-white">TimeTrack Pro</span>
                        </div>
                        <p className="text-xl font-medium text-slate-400 dark:text-slate-500 max-w-sm leading-relaxed mb-10">
                            Elevando el estándar de la gestión de tiempo para la nueva generación de profesionales y equipos de alto rendimiento.
                        </p>
                        <div className="flex gap-10">
                            {[
                                { icon: Twitter, label: "Twitter" },
                                { icon: Linkedin, label: "LinkedIn" },
                                { icon: Instagram, label: "Instagram" },
                                { icon: Github, label: "GitHub" }
                            ].map(social => (
                                <Link key={social.label} href="#" className="text-slate-400 hover:text-emerald-500 transition-colors">
                                    <social.icon size={20} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
                        {[
                            {
                                title: "Producto",
                                links: ["Características", "Cómo funciona", "Precios", "Soporte"]
                            },
                            {
                                title: "Compañía",
                                links: ["Sobre nosotros", "Blog", "Seguridad", "Carreras"]
                            },
                            {
                                title: "Legal",
                                links: ["Privacidad", "Términos", "Cookies", "Licencias"]
                            }
                        ].map((col) => (
                            <div key={col.title}>
                                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white mb-10 opacity-30 dark:opacity-50">
                                    {col.title}
                                </h4>
                                <ul className="space-y-6">
                                    {col.links.map(link => (
                                        <li key={link}>
                                            <Link href="#" className="text-[15px] font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                                                {link}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom line */}
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 dark:border-slate-800/50 pt-10">
                    <p className="text-sm font-bold text-slate-400 dark:text-slate-600 tracking-tight">
                        © {new Date().getFullYear()} TimeTrack Systems LLC. Fabricado con <Heart size={12} className="inline fill-emerald-500 text-emerald-500" /> en remoto.
                    </p>
                    <div className="flex gap-8 mt-6 sm:mt-0">
                        <Link href="#" className="text-sm font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Estado del Sistema</Link>
                        <Link href="#" className="text-sm font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">API Docs</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

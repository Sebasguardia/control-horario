"use client";

import { Timer, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-[100] border-b border-slate-200/50 bg-white/70 backdrop-blur-xl dark:bg-slate-950/70 dark:border-slate-800/50"
        >
            <div className="container mx-auto flex h-20 items-center justify-between px-6">
                <div className="flex items-center gap-2.5">
                    <img
                        src="https://i.ibb.co/V0m9W2wc/imagen-2026-02-11-234121829.png"
                        alt="Logo"
                        className="h-16 w-auto object-contain"
                    />
                </div>

                <nav className="hidden items-center gap-10 lg:flex">
                    {[
                        { name: "Características", id: "features" },
                        { name: "Cómo funciona", id: "how-it-works" },
                        { name: "Precios", id: "pricing" },
                        { name: "Contacto", id: "contact" }
                    ].map((item) => (
                        <Link key={item.id} href={`#${item.id}`} className="text-[14px] font-bold text-slate-500 transition-colors hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400">
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <Sun size={20} className="text-emerald-500" /> : <Moon size={20} className="text-slate-600" />}
                    </button>

                    <Link href="/login" className="hidden sm:block rounded-xl px-4 py-2 text-[14px] font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-slate-900">
                        Iniciar Sesión
                    </Link>
                    <Link href="/register" className="rounded-xl bg-emerald-600 px-6 py-2.5 text-[14px] font-black text-white shadow-xl shadow-emerald-200 transition-all hover:bg-emerald-700 hover:-translate-y-0.5 active:scale-95 dark:shadow-emerald-900/20">
                        Probar Gratis
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
};

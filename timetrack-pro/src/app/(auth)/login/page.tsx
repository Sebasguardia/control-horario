"use client";

import Link from "next/link";
import { Timer, ArrowRight, Loader2, Sun, Moon, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/contexts/notification-context";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { addNotification } = useNotification();
    const { theme, setTheme } = useTheme();
    const supabase = createClient();

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            addNotification("Error", error.message, "error");
            setLoading(false);
            return;
        }

        addNotification("¡Bienvenido!", "Has iniciado sesión correctamente.", "success");
        router.push("/dashboard");
        router.refresh();
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/dashboard` }
        });
        if (error) {
            addNotification("Error", error.message, "error");
            setGoogleLoading(false);
        }
    };

    const bgImage = theme === "dark"
        ? "https://i.ibb.co/5WMJGMmM/imagen-2026-02-12-001014341.png"
        : "https://i.ibb.co/gZn4kjCt/imagen-2026-02-11-231723472.png";

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 transition-colors duration-500 dark:bg-[#020617]">
            {/* FONDO - Capas superpuestas para cambio instantáneo */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://i.ibb.co/gZn4kjCt/imagen-2026-02-11-231723472.png"
                    alt="Light Background"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${theme === 'dark' ? 'opacity-0' : 'opacity-60'}`}
                />
                <img
                    src="https://i.ibb.co/5WMJGMmM/imagen-2026-02-12-001014341.png"
                    alt="Dark Background"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${theme === 'dark' ? 'opacity-40' : 'opacity-0'}`}
                />
            </div>

            {/* CONTROLES SUPERIORES */}
            <div className="absolute left-6 top-6 sm:left-10 sm:top-10 z-40 flex items-center gap-4">
                <Link
                    href="/"
                    className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 shadow-xl transition-all hover:scale-110 active:scale-95"
                >
                    <ArrowLeft size={18} className="sm:size-[20px]" />
                </Link>
                <div className="flex items-center gap-2">
                    <img
                        src="https://i.ibb.co/V0m9W2wc/imagen-2026-02-11-234121829.png"
                        alt="Logo"
                        className="h-10 sm:h-14 w-auto object-contain dark:brightness-200"
                    />
                </div>
            </div>

            <div className="absolute right-6 top-6 sm:right-10 sm:top-10 z-40">
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 shadow-xl transition-all hover:scale-110 active:scale-95"
                >
                    {theme === "dark" ? <Sun size={18} className="text-emerald-500 sm:size-[20px]" /> : <Moon size={18} className="sm:size-[20px]" />}
                </button>
            </div>

            {/* TARJETA */}
            <div className="relative z-10 flex min-h-screen items-center justify-center lg:justify-end px-6 lg:px-24 pt-20 lg:pt-0">
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-[360px] rounded-[2rem] bg-white/90 dark:bg-slate-900/90 p-8 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl border border-white dark:border-slate-800 selection:bg-emerald-100 dark:selection:bg-emerald-900/30"
                >
                    <div className="mb-8">
                        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-1">Iniciar Sesión</h2>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
                            ¿Eres nuevo? <Link href="/register" className="text-emerald-600 dark:text-emerald-500 hover:underline">Crea una cuenta</Link>
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="correo@ejemplo.com"
                                className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-500/5 placeholder:text-slate-300 dark:placeholder:text-slate-700"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Contraseña</label>
                                <Link href="#" className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 hover:underline">¿Olvidaste tu contraseña?</Link>
                            </div>
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="Tu contraseña"
                                className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-500/5 placeholder:text-slate-300 dark:placeholder:text-slate-700"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="h-12 w-full rounded-xl bg-emerald-600 text-sm font-black text-white shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-700 dark:hover:bg-emerald-500 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                <>
                                    Entrar
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
                            <div className="relative flex justify-center text-[10px] font-black uppercase text-slate-400 dark:text-slate-600 tracking-widest bg-white dark:bg-slate-900 px-3 mx-auto w-fit transition-colors">O</div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={googleLoading}
                            className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-900 active:scale-95 shadow-sm"
                        >
                            {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                                <svg className="h-4 w-4" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            )}
                            Google
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
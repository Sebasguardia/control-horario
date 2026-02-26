"use client";

import Link from "next/link";
import { Timer, ArrowRight, Loader2, Check, Sun, Moon, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/contexts/notification-context";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { addNotification } = useNotification();
    const { theme, setTheme } = useTheme();
    const supabase = createClient();

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const fullName = formData.get('full_name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirm_password') as string;
        const position = formData.get('position') as string;
        const department = formData.get('department') as string;
        const city = formData.get('city') as string;
        const gender = formData.get('gender') as string;

        if (password !== confirmPassword) {
            addNotification("Error", "Las contraseñas no coinciden.", "error");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            addNotification("Error", "La contraseña debe tener al menos 6 caracteres.", "error");
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    position: position || null,
                    department: department || null,
                    city: city || null,
                    gender: gender || 'No especificado',
                }
            }
        });

        if (error) {
            addNotification("Error", error.message, "error");
            setLoading(false);
            return;
        }

        setShowSuccessModal(true);
        setLoading(false);
    };

    const bgImage = theme === "dark"
        ? "https://i.ibb.co/gMMMJTDb/imagen-2026-02-12-000820966.png"
        : "https://i.ibb.co/5CB3Q6r/imagen-2026-02-11-232118791.png";

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 transition-colors duration-500 dark:bg-[#020617]">
            {/* FONDO - Capas superpuestas para cambio instantáneo */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://i.ibb.co/5CB3Q6r/imagen-2026-02-11-232118791.png"
                    alt="Light Background"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${theme === 'dark' ? 'opacity-0' : 'opacity-60'}`}
                />
                <img
                    src="https://i.ibb.co/gMMMJTDb/imagen-2026-02-12-000820966.png"
                    alt="Dark Background"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${theme === 'dark' ? 'opacity-40' : 'opacity-0'}`}
                />
            </div>

            {/* CONTROLES SUPERIORES */}
            <div className="absolute right-6 top-6 sm:right-10 sm:top-10 z-40 flex items-center gap-4">
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 shadow-xl transition-all hover:scale-110 active:scale-95"
                >
                    {theme === "dark" ? <Sun size={18} className="text-emerald-500 sm:size-[20px]" /> : <Moon size={18} className="sm:size-[20px]" />}
                </button>
                <div className="flex items-center gap-2">
                    <img
                        src="https://i.ibb.co/V0m9W2wc/imagen-2026-02-11-234121829.png"
                        alt="Logo"
                        className="h-10 sm:h-14 w-auto object-contain dark:brightness-200"
                    />
                </div>
            </div>

            <div className="absolute left-6 top-6 sm:left-10 sm:top-10 z-40">
                <Link
                    href="/"
                    className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 shadow-xl transition-all hover:scale-110 active:scale-95"
                >
                    <ArrowLeft size={18} className="sm:size-[20px]" />
                </Link>
            </div>

            {/* TARJETA */}
            <div className="relative z-10 flex min-h-screen items-center justify-center lg:justify-start px-6 lg:px-24 pt-24 pb-12 lg:py-0">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-[480px] rounded-[2rem] bg-white/90 dark:bg-slate-900/90 p-8 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl border border-white dark:border-slate-800 selection:bg-emerald-100 dark:selection:bg-emerald-900/30"
                >
                    <div className="mb-6">
                        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-1">Crear cuenta</h2>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
                            ¿Ya tienes una? <Link href="/login" className="text-emerald-600 dark:text-emerald-500 hover:underline">Inicia sesión</Link>
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleRegister}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    required
                                    placeholder="Tu Nombre"
                                    className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 text-xs font-bold text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-500/5 placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="correo@empresa.com"
                                    className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 text-xs font-bold text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-500/5 placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Cargo</label>
                                <input
                                    type="text"
                                    name="position"
                                    placeholder="Ej: Developer"
                                    className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 text-xs font-bold text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-500/5 placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Departamento</label>
                                <select name="department" className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 text-xs font-bold text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-500/5 appearance-none">
                                    <option value="">Seleccionar...</option>
                                    <option value="tech">Tecnología</option>
                                    <option value="hr">RRHH</option>
                                    <option value="sales">Ventas</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Ciudad</label>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="Lima"
                                    className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 text-xs font-bold text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-500/5 placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Género</label>
                                <select name="gender" className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 text-xs font-bold text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-500/5 appearance-none">
                                    <option value="">No especificado</option>
                                    <option value="male">Masculino</option>
                                    <option value="female">Femenino</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Contraseña</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    placeholder="••••••••"
                                    className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 text-xs font-bold text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-500/5 placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Repetir</label>
                                <input
                                    type="password"
                                    name="confirm_password"
                                    required
                                    placeholder="••••••••"
                                    className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 text-xs font-bold text-slate-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-500/5 placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 py-1">
                            <button
                                type="button"
                                onClick={() => setAcceptTerms(!acceptTerms)}
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all ${acceptTerms ? 'bg-emerald-600 border-emerald-600' : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`}
                            >
                                {acceptTerms && <Check className="h-2.5 w-2.5 text-white stroke-[4]" />}
                            </button>
                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-500">
                                Acepto los <Link href="/legal" className="text-emerald-600 dark:text-emerald-500 hover:underline">Términos</Link> y <Link href="/legal" className="text-emerald-600 dark:text-emerald-500 hover:underline">Privacidad</Link>.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !acceptTerms}
                            className="h-12 w-full rounded-xl bg-slate-900 dark:bg-emerald-600 text-sm font-black text-white shadow-xl shadow-slate-900/20 dark:shadow-emerald-900/20 transition-all hover:bg-black dark:hover:bg-emerald-500 hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                <>
                                    Crear cuenta
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>

            {/* MODAL DE ÉXITO Y CONFIRMACIÓN */}
            <AnimatePresence>
                {showSuccessModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-slate-900/60"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl border border-white/20"
                        >
                            <div className="relative h-32 w-full bg-[#1A5235] flex items-center justify-center">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Timer size={120} className="text-white" />
                                </div>
                                <div className="h-20 w-20 rounded-3xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white shadow-inner">
                                    <Check size={40} className="stroke-[3]" />
                                </div>
                            </div>

                            <div className="p-10 text-center">
                                <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-4 tracking-tight">¡Casi hemos terminado!</h3>
                                <p className="text-base font-bold text-slate-400 dark:text-slate-500 leading-relaxed mb-8">
                                    Te hemos enviado un correo de confirmación. Por favor, revisa tu <span className="text-slate-800 dark:text-white">bandeja de entrada</span> para activar tu cuenta.
                                </p>

                                <button
                                    onClick={() => router.push("/login")}
                                    className="w-full rounded-2xl bg-[#1A5235] py-4 text-sm font-black text-white uppercase tracking-widest shadow-xl shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-95"
                                >
                                    Ir al Inicio de Sesión
                                </button>

                                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">
                                    TimeTrack Pro • Sistema de Gestión
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


"use client";

import Link from "next/link";
import { Timer, ArrowRight, Loader2, Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/contexts/notification-context";
import { motion } from "framer-motion";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const router = useRouter();
    const { addNotification } = useNotification();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        addNotification("¡Cuenta Creada!", "Bienvenido a TimeTrack Pro.", "success");
        router.push("/dashboard");
        setLoading(false);
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#f4f7fa]">
            {/* FONDO */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://i.ibb.co/5CB3Q6r/imagen-2026-02-11-232118791.png"
                    alt="Background Illustration"
                    className="h-full w-full object-cover opacity-60"
                />
            </div>

            {/* LOGO */}
            <div className="absolute right-10 top-10 z-20 flex items-center gap-2">
                <span className="text-xl font-black tracking-tighter text-slate-900 italic">TimeTrack<span className="text-emerald-600">Pro</span></span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                    <Timer size={20} />
                </div>
            </div>

            {/* TARJETA */}
            <div className="relative z-10 flex min-h-screen items-center justify-start px-6 lg:px-24">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-[480px] rounded-[2rem] bg-white p-8 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] selection:bg-emerald-100"
                >
                    <div className="mb-6">
                        <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Crear cuenta</h2>
                        <p className="text-xs font-bold text-slate-400">
                            ¿Ya tienes una? <Link href="/login" className="text-emerald-600 hover:underline">Inicia sesión</Link>
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleRegister}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Tu Nombre"
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="correo@empresa.com"
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cargo</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Developer"
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Departamento</label>
                                <select className="h-10 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 appearance-none">
                                    <option value="">Seleccionar...</option>
                                    <option value="tech">Tecnología</option>
                                    <option value="hr">RRHH</option>
                                    <option value="sales">Ventas</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Ciudad</label>
                                <input
                                    type="text"
                                    placeholder="Lima"
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Género</label>
                                <select className="h-10 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 appearance-none">
                                    <option value="">No especificado</option>
                                    <option value="male">Masculino</option>
                                    <option value="female">Femenino</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contraseña</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Repetir</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 py-1">
                            <button
                                type="button"
                                onClick={() => setAcceptTerms(!acceptTerms)}
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all ${acceptTerms ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-slate-200'}`}
                            >
                                {acceptTerms && <Check className="h-2.5 w-2.5 text-white stroke-[4]" />}
                            </button>
                            <p className="text-[10px] font-bold text-slate-500">
                                Acepto los <Link href="#" className="text-emerald-600 hover:underline">Términos</Link> y <Link href="#" className="text-emerald-600 hover:underline">Privacidad</Link>.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !acceptTerms}
                            className="h-12 w-full rounded-xl bg-slate-900 text-sm font-black text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-black hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
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
        </div>
    );
}

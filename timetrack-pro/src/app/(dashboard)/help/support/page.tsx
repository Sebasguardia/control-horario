"use strict";
"use client";

import { useEffect, useState } from "react";
import { usePageStore } from "@/stores/page-store";
import {
    LifeBuoy,
    ArrowLeft,
    MessageSquare,
    Mail,
    Phone,
    Send,
    AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useNotification } from "@/contexts/notification-context";

export default function SupportPage() {
    const setTitle = usePageStore((state) => state.setTitle);
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        subject: "",
        category: "technical",
        message: ""
    });

    useEffect(() => {
        setTitle("Soporte Técnico", "Estamos aquí para ayudarte.");
    }, [setTitle]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            addNotification("Ticket Enviado", "Hemos recibido tu solicitud. Te contactaremos pronto.", "success");
            setFormData({ subject: "", category: "technical", message: "" });
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="space-y-8">
            <Link
                href="/help"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Volver al Centro de Ayuda
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Contact Options */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1 space-y-4"
                >
                    <div className="rounded-[2rem] bg-emerald-900 text-white p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <LifeBuoy className="h-40 w-40 -rotate-12 translate-x-10 -translate-y-10" />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-6">Canales de Atención</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/10 rounded-xl">
                                        <MessageSquare className="h-6 w-6 text-emerald-300" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-emerald-100">Chat en Vivo</h4>
                                        <p className="text-sm text-emerald-200/60 mt-1">Lunes a Viernes<br />9:00 - 18:00 hrs</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/10 rounded-xl">
                                        <Mail className="h-6 w-6 text-emerald-300" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-emerald-100">Email</h4>
                                        <p className="text-sm text-emerald-200/60 mt-1">soporte@timetrack.pro<br />Respuesta en 24h</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/10 rounded-xl">
                                        <Phone className="h-6 w-6 text-emerald-300" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-emerald-100">Emergencias</h4>
                                        <p className="text-sm text-emerald-200/60 mt-1">+1 (555) 123-4567<br />Solo incidentes críticos</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Ticket Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2"
                >
                    <div className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Abrir Nuevo Ticket</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">Describe tu problema y nuestro equipo técnico lo revisará lo antes posible.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Asunto</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="Ej: Error al exportar PDF"
                                        className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-4 py-3 text-sm font-bold text-slate-800 dark:text-white focus:border-emerald-500/20 focus:bg-white dark:focus:bg-black focus:outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Categoría</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-4 py-3 text-sm font-bold text-slate-800 dark:text-white focus:border-emerald-500/20 focus:bg-white dark:focus:bg-black focus:outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="technical">Problema Técnico</option>
                                        <option value="billing">Facturación</option>
                                        <option value="account">Cuenta y Acceso</option>
                                        <option value="feature">Sugerencia</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Mensaje Detallado</label>
                                <textarea
                                    name="message"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Describe lo que sucedió..."
                                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-4 py-3 text-sm font-medium text-slate-800 dark:text-white focus:border-emerald-500/20 focus:bg-white dark:focus:bg-black focus:outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/10 px-3 py-2 rounded-lg">
                                    <AlertCircle className="h-4 w-4" />
                                    Tiempo de respuesta estimado: 2 horas
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 rounded-xl bg-[#1A5235] hover:bg-[#14422b] dark:bg-emerald-600 dark:hover:bg-emerald-700 px-8 py-4 text-sm font-black text-white uppercase tracking-widest shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    {loading ? (
                                        "Enviando..."
                                    ) : (
                                        <>
                                            Enviar Ticket
                                            <Send className="h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

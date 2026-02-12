"use client";

import { useEffect, useState } from "react";
import { mockUser } from "@/mocks/mock-data";
import {
    User,
    Clock,
    Bell,
    Shield,
    Trash2,
    Save,
    Camera,
    MapPin,
    Briefcase,
    Building2,
    CheckCircle2,
    ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useConfigStore } from "@/stores/config-store";
import { usePageStore } from "@/stores/page-store";
import { useNotification } from "@/contexts/notification-context";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
    const { addNotification } = useNotification();
    const config = useConfigStore();
    const [activeTab, setActiveTab] = useState("profile");
    const setTitle = usePageStore((state) => state.setTitle);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTitle("Configuración", "Gestiona tu cuenta y preferencias de la plataforma.");

        const loadUser = async () => {
            const supabase = createClient();
            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (authUser) {
                const { data: userData } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', authUser.id)
                    .single();

                setUser(userData || authUser);
            }
            setLoading(false);
        };

        loadUser();
    }, [setTitle]);

    const handleSave = () => {
        addNotification("Ajustes Guardados", "Tu perfil ha sido actualizado con éxito.", "success");
    };

    const tabs = [
        { id: "profile", label: "Perfil", icon: User, desc: "Información personal" },
        { id: "schedule", label: "Horario", icon: Clock, desc: "Jornada laboral" },
        { id: "notifications", label: "Notificaciones", icon: Bell, desc: "Alertas y avisos" },
        { id: "security", label: "Seguridad", icon: Shield, desc: "Contraseña y acceso" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-800 dark:text-white">Ajustes</h1>
                <p className="mt-2 text-base font-bold text-slate-400 dark:text-slate-500">Personaliza tu experiencia en TimeTrack.</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-10 lg:flex-row"
            >
                {/* Tabs Sidebar */}
                <div className="w-full lg:w-80 shrink-0">
                    <div className="lg:sticky lg:top-8 space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "group relative flex w-full items-center gap-4 rounded-[1.5rem] p-4 text-left transition-all duration-300",
                                    activeTab === tab.id
                                        ? "bg-[#1A5235] dark:bg-emerald-600 text-white shadow-xl shadow-[#1A5235]/20 dark:shadow-emerald-900/20 ring-4 ring-[#1A5235]/5 dark:ring-emerald-500/10"
                                        : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-100 dark:border-slate-800"
                                )}
                            >
                                <div className={cn(
                                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors",
                                    activeTab === tab.id ? "bg-white/10 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                                )}>
                                    <tab.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className={cn("text-sm font-black", activeTab === tab.id ? "text-white" : "text-slate-800 dark:text-white")}>{tab.label}</p>
                                    <p className={cn("text-xs font-medium", activeTab === tab.id ? "text-white/60" : "text-slate-400 dark:text-slate-500")}>{tab.desc}</p>
                                </div>
                                {activeTab === tab.id && (
                                    <ChevronRight className="absolute right-5 h-5 w-5 text-white/40" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            {activeTab === "profile" && (
                                <div className="space-y-8">
                                    <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-10 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 h-64 w-64 translate-x-20 -translate-y-20 rounded-full bg-slate-50 dark:bg-slate-800 blur-3xl pointer-events-none" />

                                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
                                            <div className="relative group cursor-pointer">
                                                <div className="h-32 w-32 overflow-hidden rounded-[2rem] bg-slate-100 dark:bg-slate-800 ring-8 ring-white dark:ring-slate-900 shadow-2xl transition-transform group-hover:scale-[1.02] flex items-center justify-center">
                                                    {user?.avatar_url ? (
                                                        <img
                                                            src={user.avatar_url}
                                                            alt="Profile"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-4xl font-black text-slate-400">
                                                            {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]">
                                                    <Camera className="h-8 w-8 text-white" />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{user?.full_name || user?.email || 'Usuario'}</h2>
                                                    <p className="text-base font-medium text-slate-400 dark:text-slate-500">{user?.email}</p>
                                                </div>
                                                <div className="flex flex-wrap gap-3">
                                                    <span className="inline-flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 uppercase tracking-wide">
                                                        <Briefcase className="h-3 w-3" /> {user?.position || 'Sin cargo'}
                                                    </span>
                                                    <span className="inline-flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 uppercase tracking-wide">
                                                        <Building2 className="h-3 w-3" /> {user?.department || 'Sin departamento'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-10 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
                                            <h3 className="text-lg font-black text-slate-800 dark:text-white">Información Personal</h3>
                                            <div className="space-y-5">
                                                <div>
                                                    <label className="mb-2 block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Nombre Completo</label>
                                                    <input type="text" defaultValue={user?.full_name || ''} className="h-14 w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-5 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#1A5235]/30 dark:focus:border-emerald-500/30 focus:ring-4 focus:ring-[#1A5235]/5 dark:focus:ring-emerald-500/10 transition-all" />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Email Profesional</label>
                                                    <input type="email" defaultValue={user?.email || ''} className="h-14 w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-5 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#1A5235]/30 dark:focus:border-emerald-500/30 focus:ring-4 focus:ring-[#1A5235]/5 dark:focus:ring-emerald-500/10 transition-all" />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Género</label>
                                                    <select defaultValue={user?.gender || 'No especificado'} className="h-14 w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-5 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#1A5235]/30 dark:focus:border-emerald-500/30 focus:ring-4 focus:ring-[#1A5235]/5 dark:focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer">
                                                        <option>Masculino</option>
                                                        <option>Femenino</option>
                                                        <option>No especificado</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-10 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
                                            <h3 className="text-lg font-black text-slate-800 dark:text-white">Datos Corporativos</h3>
                                            <div className="space-y-5">
                                                <div>
                                                    <label className="mb-2 block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Ubicación</label>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                                                        <input type="text" defaultValue={user?.city || ''} className="h-14 w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 pl-12 pr-5 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#1A5235]/30 dark:focus:border-emerald-500/30 focus:ring-4 focus:ring-[#1A5235]/5 dark:focus:ring-emerald-500/10 transition-all" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Cargo</label>
                                                    <input type="text" defaultValue={user?.position || ''} className="h-14 w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-5 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#1A5235]/30 dark:focus:border-emerald-500/30 focus:ring-4 focus:ring-[#1A5235]/5 dark:focus:ring-emerald-500/10 transition-all" />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Departamento</label>
                                                    <input type="text" defaultValue={user?.department || ''} className="h-14 w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-5 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#1A5235]/30 dark:focus:border-emerald-500/30 focus:ring-4 focus:ring-[#1A5235]/5 dark:focus:ring-emerald-500/10 transition-all" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button onClick={handleSave} className="flex h-14 items-center gap-3 rounded-full bg-[#1A5235] dark:bg-emerald-600 px-10 text-sm font-black text-white shadow-xl shadow-[#1A5235]/20 dark:shadow-emerald-900/20 hover:bg-[#14422b] dark:hover:bg-emerald-700 hover:-translate-y-1 transition-all active:scale-95 group">
                                            <Save className="h-4 w-4 transition-transform group-hover:rotate-12" />
                                            GUARDAR CAMBIOS
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Los demás tabs permanecen igual */}
                            {activeTab === "schedule" && (
                                <div className="rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 shadow-sm relative overflow-hidden">
                                    <div className="mb-10">
                                        <h3 className="text-2xl font-black text-slate-800 dark:text-white">Configuración de Jornada</h3>
                                        <p className="mt-2 text-base font-medium text-slate-400 dark:text-slate-500">Define tus horarios habituales para automatizar alertas y registros.</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="mb-2 block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Hora de Entrada</label>
                                                <input
                                                    type="time"
                                                    value={config.startTimeHabitual}
                                                    onChange={(e) => config.setConfig({ startTimeHabitual: e.target.value })}
                                                    className="h-16 w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-5 text-xl font-black text-slate-800 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#1A5235]/30 dark:focus:border-emerald-500/30 focus:ring-4 focus:ring-[#1A5235]/5 dark:focus:ring-emerald-500/10 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Hora de Salida</label>
                                                <input
                                                    type="time"
                                                    value={config.endTimeHabitual}
                                                    onChange={(e) => config.setConfig({ endTimeHabitual: e.target.value })}
                                                    className="h-16 w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-5 text-xl font-black text-slate-800 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#1A5235]/30 dark:focus:border-emerald-500/30 focus:ring-4 focus:ring-[#1A5235]/5 dark:focus:ring-emerald-500/10 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="rounded-[2rem] bg-slate-900 dark:bg-black p-8 text-white relative overflow-hidden">
                                                <div className="absolute top-0 right-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-[#1A5235] dark:bg-emerald-600 blur-3xl opacity-30 pointer-events-none" />
                                                <h4 className="text-lg font-black mb-4 relative z-10">Total Semanal</h4>
                                                <div className="flex items-baseline gap-2 relative z-10">
                                                    <span className="text-5xl font-black tracking-tighter">{config.hoursPerDay * config.workDaysPerWeek}h</span>
                                                    <span className="text-slate-400 font-bold">/ semana</span>
                                                </div>
                                                <div className="mt-6 flex flex-col gap-3 relative z-10">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-400 font-medium">Horas diarias</span>
                                                        <span className="font-bold">{config.hoursPerDay}h</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-400 font-medium">Días laborales</span>
                                                        <span className="font-bold">{config.workDaysPerWeek} días</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                        <button onClick={handleSave} className="flex h-14 items-center gap-3 rounded-full bg-[#1A5235] dark:bg-emerald-600 px-10 text-sm font-black text-white shadow-xl shadow-[#1A5235]/20 dark:shadow-emerald-900/20 hover:bg-[#14422b] dark:hover:bg-emerald-700 hover:-translate-y-1 transition-all active:scale-95">
                                            <Save className="h-4 w-4" />
                                            ACTUALIZAR PARAMETROS
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "notifications" && (
                                <div className="rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 shadow-sm">
                                    <div className="mb-10">
                                        <h3 className="text-2xl font-black text-slate-800 dark:text-white">Preferencias de Notificación</h3>
                                        <p className="mt-2 text-base font-medium text-slate-400 dark:text-slate-500">Controla qué alertas recibes y cuáles silenciar.</p>
                                    </div>

                                    <div className="grid gap-4">
                                        {[
                                            { key: "notificationsEnabled" as const, title: "Notificaciones Push", desc: "Recibir alertas en tiempo real en tu navegador" },
                                            { key: "breakReminders" as const, title: "Recordatorios de Pausa", desc: "Te sugeriremos descansar cada 2 horas de trabajo" },
                                            { key: "overtimeAlerts" as const, title: "Alerta de Horas Extra", desc: "Aviso cuando excedes tu jornada laboral diaria" },
                                            { key: "exitReminder" as const, title: "Recordatorio de Salida", desc: "Notificación 15 minutos antes de tu hora de salida" }
                                        ].map((item) => (
                                            <div
                                                key={item.key}
                                                className="group flex items-center justify-between rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer"
                                                onClick={() => config.setConfig({ [item.key]: !config[item.key] })}
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className={cn(
                                                        "flex h-12 w-12 items-center justify-center rounded-2xl transition-colors",
                                                        config[item.key] ? "bg-[#1A5235]/10 dark:bg-emerald-900/10 text-[#1A5235] dark:text-emerald-500" : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600"
                                                    )}>
                                                        <Bell className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-base font-black text-slate-800 dark:text-white">{item.title}</p>
                                                        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">{item.desc}</p>
                                                    </div>
                                                </div>
                                                <div className={cn(
                                                    "relative h-8 w-14 rounded-full transition-all duration-300",
                                                    config[item.key] ? "bg-[#1A5235] dark:bg-emerald-600" : "bg-slate-200 dark:bg-slate-700"
                                                )}>
                                                    <div className={cn(
                                                        "absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-all duration-300",
                                                        config[item.key] ? "left-[30px]" : "left-1"
                                                    )} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === "security" && (
                                <div className="space-y-8">
                                    <div className="rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 shadow-sm">
                                        <div className="mb-10">
                                            <h3 className="text-2xl font-black text-slate-800 dark:text-white">Seguridad y Acceso</h3>
                                            <p className="mt-2 text-base font-medium text-slate-400 dark:text-slate-500">Actualiza tu contraseña y protege tu cuenta.</p>
                                        </div>

                                        <div className="space-y-6 max-w-xl">
                                            <div>
                                                <label className="mb-2 block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Contraseña Actual</label>
                                                <input type="password" placeholder="••••••••" className="h-14 w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-5 text-sm font-bold text-slate-800 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#1A5235]/30 dark:focus:border-emerald-500/30 focus:ring-4 focus:ring-[#1A5235]/5 dark:focus:ring-emerald-500/10 transition-all" />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Nueva Contraseña</label>
                                                <input type="password" placeholder="••••••••" className="h-14 w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-5 text-sm font-bold text-slate-800 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#1A5235]/30 dark:focus:border-emerald-500/30 focus:ring-4 focus:ring-[#1A5235]/5 dark:focus:ring-emerald-500/10 transition-all" />
                                            </div>
                                            <div className="pt-4">
                                                <button className="flex h-14 items-center gap-3 rounded-full bg-slate-900 dark:bg-white px-10 text-sm font-black text-white dark:text-slate-900 shadow-xl shadow-slate-900/20 dark:shadow-white/10 hover:bg-black dark:hover:bg-slate-100 transition-all active:scale-95">
                                                    ACTUALIZAR CREDENCIALES
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-[2.5rem] border border-red-100 dark:border-red-900/30 bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-slate-900 p-10 shadow-sm">
                                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-black text-red-900 dark:text-red-400 mb-2 flex items-center gap-3">
                                                    <Trash2 className="h-5 w-5" />
                                                    Zona de Peligro
                                                </h3>
                                                <p className="text-sm font-bold text-red-900/50 dark:text-red-400/50 max-w-md">Esta acción es irreversible. Todos tus datos, historial y configuraciones serán eliminados permanentemente.</p>
                                            </div>
                                            <button className="flex shrink-0 h-12 items-center gap-3 rounded-full border-2 border-red-200 dark:border-red-800 bg-white dark:bg-black/20 px-8 text-xs font-black text-red-600 dark:text-red-400 transition-all hover:bg-red-600 hover:text-white hover:border-red-600 uppercase tracking-wide">
                                                Eliminar Cuenta
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

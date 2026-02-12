"use client";

import { useEffect, useState } from "react";
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
    Lock,
    Key,
    AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useConfigStore } from "@/stores/config-store";
import { usePageStore } from "@/stores/page-store";
import { useNotification } from "@/contexts/notification-context";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/user-store";
import { UserService } from "@/services/user-service";

export default function SettingsPage() {
    const { addNotification } = useNotification();
    const user = useUserStore(state => state.user);
    const loadUser = useUserStore(state => state.loadUser);
    const router = useRouter();
    const config = useConfigStore();
    const [activeTab, setActiveTab] = useState("profile");
    const setTitle = usePageStore((state) => state.setTitle);

    // Form States
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        position: "",
        department: "",
        city: "",
        schedule_start: "",
        schedule_end: "",
        expected_hours_per_day: 8,
        avatar_url: "",
    });
    const [loading, setLoading] = useState(false);

    // Security States
    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        setTitle("Configuración", "Gestiona tu cuenta y preferencias de la plataforma.");
    }, [setTitle]);

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || "",
                email: user.email || "",
                position: user.position || "",
                department: user.department || "",
                city: user.city || "",
                schedule_start: user.schedule_start || "08:00",
                schedule_end: user.schedule_end || "17:00",
                expected_hours_per_day: user.expected_hours_per_day || 8,
                avatar_url: user.avatar_url || "",
            });
        }
    }, [user]);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setLoading(true);
        try {
            const publicUrl = await UserService.uploadAvatar(user.id, file);
            if (publicUrl) {
                setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
                addNotification("Imagen lista", "No olvides guardar los cambios para actualizar tu perfil.", "success");
            }
        } catch (error) {
            console.error(error);
            addNotification("Error", "No se pudo subir la imagen.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await UserService.updateUserProfile(user.id, {
                full_name: formData.full_name,
                position: formData.position,
                department: formData.department,
                city: formData.city,
                schedule_start: formData.schedule_start,
                schedule_end: formData.schedule_end,
                expected_hours_per_day: formData.expected_hours_per_day,
                avatar_url: formData.avatar_url,
            });
            await loadUser(); // Refresh store
            addNotification("Ajustes Guardados", "Tu perfil ha sido actualizado con éxito.", "success");
        } catch (error) {
            console.error(error);
            addNotification("Error", "No se pudo actualizar el perfil.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            addNotification("Error", "Las contraseñas no coinciden.", "error");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            addNotification("Error", "La contraseña debe tener al menos 6 caracteres.", "error");
            return;
        }

        setLoading(true);
        const { success, error } = await UserService.updatePassword(passwordData.newPassword);
        setLoading(false);

        if (success) {
            addNotification("Contraseña actualizada", "Tu contraseña ha sido cambiada con éxito.", "success");
            setPasswordData({ newPassword: "", confirmPassword: "" });
        } else {
            addNotification("Error", "No se pudo actualizar la contraseña.", "error");
        }
    };

    const handleDeleteAccount = async () => {
        if (!user) return;
        setLoading(true);
        const { success } = await UserService.deleteAccount();
        if (success) {
            addNotification("Cuenta eliminada", "Tu cuenta y datos han sido eliminados correctamente.", "info");
            router.push("/login");
        } else {
            setLoading(false);
            addNotification("Error", "No se pudo eliminar la cuenta.", "error");
        }
    };

    const tabs = [
        { id: "profile", label: "Perfil", icon: User, desc: "Información personal" },
        { id: "schedule", label: "Horario", icon: Clock, desc: "Jornada laboral" },
        { id: "security", label: "Seguridad", icon: Shield, desc: "Contraseña y acceso" },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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
                        >
                            {activeTab === "profile" && (
                                <div className="space-y-8">
                                    <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                                        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                                            <div className="relative group">
                                                <div className="h-32 w-32 rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-xl transition-transform group-hover:scale-105 duration-500">
                                                    {formData.avatar_url ? (
                                                        <img
                                                            src={formData.avatar_url}
                                                            alt="Profile"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center">
                                                            <User className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                                                        </div>
                                                    )}
                                                </div>
                                                <label className="absolute -bottom-2 -right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl bg-[#1A5235] text-white shadow-lg transition-all hover:bg-[#0E3621] hover:scale-110 active:scale-90 ring-4 ring-white dark:ring-slate-900">
                                                    <Camera className="h-5 w-5" />
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleAvatarUpload}
                                                    />
                                                </label>
                                            </div>
                                            <div className="text-center md:text-left">
                                                <h2 className="text-2xl font-black text-slate-800 dark:text-white">{formData.full_name || 'Nuevo Usuario'}</h2>
                                                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 mt-1">Sube una foto para personalizar tu perfil.</p>
                                                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                                                    {formData.position && (
                                                        <span className="rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 uppercase tracking-tighter">
                                                            {formData.position}
                                                        </span>
                                                    )}
                                                    {formData.department && (
                                                        <span className="rounded-full bg-slate-50 dark:bg-slate-800 px-3 py-1 text-[10px] font-black text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 uppercase tracking-tighter">
                                                            {formData.department}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 pl-1">Nombre Completo</label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-slate-600 transition-colors group-focus-within:text-primary dark:group-focus-within:text-emerald-400" />
                                                    <input
                                                        type="text"
                                                        name="full_name"
                                                        value={formData.full_name}
                                                        onChange={handleChange}
                                                        className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-12 py-3.5 text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-300 focus:border-primary/20 dark:focus:border-emerald-500/20 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                                                        placeholder="Tu nombre completo"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 pl-1">Correo Electrónico</label>
                                                <div className="relative group">
                                                    {/* Email disabled as it's auth related */}
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-slate-600" />
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        disabled
                                                        className="w-full rounded-2xl bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent px-12 py-3.5 text-sm font-bold text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 pl-1">Cargo</label>
                                                <div className="relative group">
                                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-slate-600 transition-colors group-focus-within:text-primary" />
                                                    <input
                                                        type="text"
                                                        name="position"
                                                        value={formData.position}
                                                        onChange={handleChange}
                                                        className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-12 py-3.5 text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-300 focus:border-primary/20 focus:bg-white focus:outline-none transition-all"
                                                        placeholder="Ej: Developer"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 pl-1">Departamento</label>
                                                <div className="relative group">
                                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-slate-600 transition-colors group-focus-within:text-primary" />
                                                    <input
                                                        type="text"
                                                        name="department"
                                                        value={formData.department}
                                                        onChange={handleChange}
                                                        className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-12 py-3.5 text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-300 focus:border-primary/20 focus:bg-white focus:outline-none transition-all"
                                                        placeholder="Ej: IT"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 pl-1">Ubicación / Ciudad</label>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-slate-600 transition-colors group-focus-within:text-primary" />
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleChange}
                                                        className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-12 py-3.5 text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-300 focus:border-primary/20 focus:bg-white focus:outline-none transition-all"
                                                        placeholder="Ej: Madrid, España"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "schedule" && (
                                <div className="space-y-8">
                                    <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                                        <div className="mb-8">
                                            <h2 className="text-xl font-black text-slate-800 dark:text-white">Horario Laboral</h2>
                                            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 mt-1">Configura tu jornada esperada para el cálculo de reportes.</p>
                                        </div>

                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 pl-1">Hora Entrada</label>
                                                <input
                                                    type="time"
                                                    name="schedule_start"
                                                    value={formData.schedule_start}
                                                    onChange={handleChange}
                                                    className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-6 py-3.5 text-sm font-bold text-slate-800 dark:text-white focus:border-primary/20 focus:bg-white focus:outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 pl-1">Hora Salida</label>
                                                <input
                                                    type="time"
                                                    name="schedule_end"
                                                    value={formData.schedule_end}
                                                    onChange={handleChange}
                                                    className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-6 py-3.5 text-sm font-bold text-slate-800 dark:text-white focus:border-primary/20 focus:bg-white focus:outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 pl-1">Horas Diarias Esperadas</label>
                                                <input
                                                    type="number"
                                                    name="expected_hours_per_day"
                                                    value={formData.expected_hours_per_day}
                                                    onChange={handleChange}
                                                    className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-6 py-3.5 text-sm font-bold text-slate-800 dark:text-white focus:border-primary/20 focus:bg-white focus:outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "security" && (
                                <div className="space-y-8">
                                    {/* Password Change Section */}
                                    <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                                        <div className="mb-8">
                                            <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                                                <Key className="h-5 w-5 text-emerald-500" />
                                                Cambiar Contraseña
                                            </h2>
                                            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 mt-1">Actualiza tu contraseña periódicamente para mayor seguridad.</p>
                                        </div>

                                        <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 pl-1">Nueva Contraseña</label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-slate-600 transition-colors group-focus-within:text-emerald-500" />
                                                    <input
                                                        type="password"
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                                        className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-12 py-3.5 text-sm font-bold text-slate-800 dark:text-white focus:border-emerald-500/20 focus:bg-white focus:outline-none transition-all"
                                                        placeholder="Mínimo 6 caracteres"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 pl-1">Confirmar Contraseña</label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-slate-600 transition-colors group-focus-within:text-emerald-500" />
                                                    <input
                                                        type="password"
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                        className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent px-12 py-3.5 text-sm font-bold text-slate-800 dark:text-white focus:border-emerald-500/20 focus:bg-white focus:outline-none transition-all"
                                                        placeholder="Repite la contraseña"
                                                    />
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-8 py-4 text-sm font-black text-white uppercase tracking-widest shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                                                >
                                                    {loading ? 'Cambiando...' : 'Actualizar Contraseña'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Danger Zone Section */}
                                    <div className="rounded-[2rem] bg-red-50/50 dark:bg-red-900/10 p-8 shadow-sm border border-red-100 dark:border-red-900/30">
                                        <div className="mb-8">
                                            <h2 className="text-xl font-black text-red-600 dark:text-red-400 flex items-center gap-2">
                                                <AlertTriangle className="h-5 w-5" />
                                                Zona de Peligro
                                            </h2>
                                            <p className="text-sm font-bold text-red-900/40 dark:text-red-400/40 mt-1">Estas acciones son permanentes y no se pueden deshacer.</p>
                                        </div>

                                        {!showDeleteConfirm ? (
                                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/20">
                                                <div>
                                                    <h3 className="text-sm font-black text-slate-800 dark:text-white">Borrar Cuenta Definitivamente</h3>
                                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1">Todos tus registros, horarios y datos de perfil serán eliminados.</p>
                                                </div>
                                                <button
                                                    onClick={() => setShowDeleteConfirm(true)}
                                                    className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-900/30 px-6 py-3 text-xs font-bold text-red-600 dark:text-red-400 transition-all hover:bg-red-600 hover:text-white"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Eliminar Cuenta
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-red-500 animate-in fade-in zoom-in duration-200">
                                                <h3 className="text-lg font-black text-slate-800 dark:text-white">¿Estás absolutamente seguro?</h3>
                                                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 mt-2 italic">
                                                    Esta acción borrará tu perfil y cerrará tu sesión de forma permanente.
                                                </p>
                                                <div className="mt-6 flex flex-wrap gap-4">
                                                    <button
                                                        onClick={handleDeleteAccount}
                                                        disabled={loading}
                                                        className="flex-1 min-w-[150px] flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-4 text-xs font-black text-white uppercase tracking-widest transition-all hover:bg-red-700 active:scale-95 disabled:opacity-50"
                                                    >
                                                        {loading ? 'Borrando...' : 'Sí, borrar definitivamente'}
                                                    </button>
                                                    <button
                                                        onClick={() => setShowDeleteConfirm(false)}
                                                        className="flex-1 min-w-[150px] flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Save Button (Only show for Profile and Schedule) */}
                            {(activeTab === "profile" || activeTab === "schedule") && (
                                <div className="flex justify-end pt-8">
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="flex items-center gap-2 rounded-2xl bg-[#1A5235] px-8 py-4 text-sm font-black text-white uppercase tracking-widest shadow-xl shadow-emerald-900/20 transition-all hover:bg-[#0E3621] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        <Save className="h-5 w-5" />
                                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

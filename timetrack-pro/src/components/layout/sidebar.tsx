"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Clock,
    CalendarDays,
    FileBarChart,
    BarChart3,
    Settings,
    HelpCircle,
    Timer,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNotification } from "@/contexts/notification-context";
import { createClient } from "@/lib/supabase/client";
import { useSessionStore } from "@/stores/session-store";
import { useUserStore } from "@/stores/user-store";
import { useConfigStore } from "@/stores/config-store";

const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Historial", href: "/history", icon: Clock },
    { label: "Calendario", href: "/calendar", icon: CalendarDays },
    { label: "Reportes", href: "/reports", icon: FileBarChart },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

const generalItems = [
    { label: "Configuración", href: "/settings", icon: Settings },
    { label: "Ayuda", href: "/help", icon: HelpCircle },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { addNotification } = useNotification();
    const supabase = createClient();
    const resetSessions = useSessionStore(state => state.reset);
    const userLogout = useUserStore(state => state.logout);
    const resetConfig = useConfigStore(state => state.reset);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        resetSessions();
        userLogout();
        resetConfig();
        addNotification("Sesión Cerrada", "Has salido de tu cuenta correctamente.", "info");
        router.push("/login");
        router.refresh();
    };

    return (
        <aside className="relative flex h-full w-full flex-col bg-transparent">
            {/* Logo Section - Logo y Texto centrados con ajuste a la izquierda */}
            <div className="flex h-24 lg:h-32 w-full items-center justify-center lg:justify-center shrink-0">
                <div className="flex items-center gap-0 -ml-4 lg:-ml-9">
                    <img
                        src="https://i.ibb.co/V0m9W2wc/imagen-2026-02-11-234121829.png"
                        alt="Logo"
                        className="h-12 lg:h-16 w-auto object-contain -mr-4 lg:-mr-6"
                    />
                    <span className="text-xl lg:text-2xl font-[1000] tracking-tighter text-slate-800 dark:text-white italic leading-none relative z-10">
                        TimeTrack<span className="text-emerald-600">Pro</span>
                    </span>
                </div>
            </div>

            {/* Navigation Content - Scrollable area without scrollbar */}
            <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-2 no-scrollbar">
                {/* MENU Section */}
                <div className="mb-8">
                    <p className="mb-6 px-4 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400/80 dark:text-slate-500">
                        Menú
                    </p>
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
                            return (
                                <li key={item.href} className="relative flex items-center">
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active"
                                            className="absolute left-[-20px] top-1/2 h-10 w-2 -translate-y-1/2 rounded-r-full bg-[#166534] dark:bg-[#22c55e]"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "group flex flex-1 items-center gap-4 rounded-xl px-4 py-3.5 text-base font-bold transition-all",
                                            isActive
                                                ? "text-slate-900 dark:text-white bg-white/50 dark:bg-white/10 shadow-sm border border-white/20 dark:border-white/5"
                                                : "text-slate-400/80 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-white/40 dark:hover:bg-white/5"
                                        )}
                                    >
                                        <item.icon className={cn("h-6 w-6 shrink-0", isActive ? "text-[#166534] dark:text-[#22c55e]" : "text-slate-400 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400")} />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* GENERAL Section */}
                <div className="mb-8">
                    <p className="mb-6 px-4 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400/80 dark:text-slate-500">
                        General
                    </p>
                    <ul className="space-y-2">
                        {generalItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href} className="relative flex items-center">
                                    {isActive && (
                                        <div className="absolute left-[-20px] top-1/2 h-10 w-2 -translate-y-1/2 rounded-r-full bg-[#166534] dark:bg-[#22c55e]" />
                                    )}
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "group flex flex-1 items-center gap-4 rounded-xl px-4 py-3.5 text-base font-bold transition-all",
                                            isActive
                                                ? "text-slate-900 dark:text-white bg-white/50 dark:bg-white/10 shadow-sm border border-white/20 dark:border-white/5"
                                                : "text-slate-400/80 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-white/40 dark:hover:bg-white/5"
                                        )}
                                    >
                                        <item.icon className={cn("h-6 w-6 shrink-0", isActive ? "text-[#166534] dark:text-[#22c55e]" : "text-slate-400 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400")} />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                        <li className="relative">
                            <button
                                onClick={handleLogout}
                                className="group flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-base font-bold text-slate-400/80 dark:text-slate-500 transition-all hover:bg-red-50/50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400"
                            >
                                <LogOut className="h-6 w-6 shrink-0 text-slate-400 dark:text-slate-600 group-hover:text-red-500 dark:group-hover:text-red-400" />
                                <span>Cerrar Sesión</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </aside >
    );
}

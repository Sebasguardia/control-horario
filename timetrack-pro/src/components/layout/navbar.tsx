"use client";

import { Bell, Mail, Search, Command, Moon, Sun, CheckCircle2, Coffee, Menu } from "lucide-react";
import { useUserStore } from "@/stores/user-store";
import { useUIStore } from "@/stores/ui-store";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { useNotification } from "@/contexts/notification-context";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const user = useUserStore((state) => state.user);
    const toggleSidebar = useUIStore((state) => state.toggleSidebar);

    const { notifications, unreadCount, markAllAsRead } = useNotification();

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <header className="flex h-full w-full items-center justify-between px-6 lg:px-10 gap-4">
            {/* Left Side: Mobile Menu Toggle + Search Bar */}
            <div className="flex items-center gap-4 flex-1 max-w-md">
                <button
                    onClick={toggleSidebar}
                    aria-label="Abrir menú de navegación"
                    className="lg:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-500 shadow-sm border border-slate-50 dark:border-slate-700 active:scale-95"
                >
                    <Menu size={20} />
                </button>

                <div className="group relative flex-1 hidden sm:block">
                    <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search task"
                        className="h-11 w-full rounded-full border-none bg-white dark:bg-slate-800 px-14 text-base font-bold text-slate-700 dark:text-slate-200 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm focus:ring-2 focus:ring-[#166534]/10 dark:focus:ring-[#166534]/30"
                    />
                    <div className="absolute right-5 top-1/2 hidden md:flex -translate-y-1/2 items-center gap-1 rounded-full border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-[11px] font-black text-slate-400 dark:text-slate-500 shadow-sm uppercase">
                        <Command className="h-3.5 w-3.5" /> F
                    </div>
                </div>
            </div>

            {/* Right Side: Actions + Profile */}
            <div className="flex items-center gap-2 sm:gap-6">
                {/* Communication Icons */}
                <div className="flex items-center gap-2 sm:gap-3 relative">
                    {mounted && (
                        <button
                            onClick={toggleTheme}
                            className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-sm transition-all hover:bg-white/80 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white active:scale-95 border border-slate-50 dark:border-slate-700"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'dark' ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
                        </button>
                    )}



                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            aria-label="Notificaciones"
                            className={cn(
                                "relative flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full shadow-sm transition-all active:scale-95 border",
                                showNotifications
                                    ? "bg-[#1A5235] text-white border-[#1A5235] dark:border-emerald-800"
                                    : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-50 dark:border-slate-700 hover:bg-white/80 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white"
                            )}
                        >
                            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-800 animate-pulse" />
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 top-full mt-4 w-80 sm:w-96 rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Notificaciones</h3>
                                    {unreadCount > 0 && (
                                        <span className="text-[10px] font-bold bg-[#1A5235]/10 text-[#1A5235] dark:text-emerald-400 px-2 py-1 rounded-full">{unreadCount} Nuevas</span>
                                    )}
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-xs font-bold">No tienes notificaciones</p>
                                        </div>
                                    ) : (
                                        notifications.map((notif, i) => (
                                            <div key={i} className={cn(
                                                "p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-0 cursor-pointer group",
                                                !notif.read && "bg-slate-50/50 dark:bg-slate-800/30"
                                            )}>
                                                <div className="flex gap-3">
                                                    <div className={cn(
                                                        "h-10 w-10 rounded-full flex items-center justify-center shrink-0 border",
                                                        notif.type === 'success' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30" :
                                                            notif.type === 'warning' ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30" :
                                                                notif.type === 'error' ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30" :
                                                                    "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30"
                                                    )}>
                                                        {notif.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> :
                                                            notif.type === 'warning' ? <Coffee className="h-4 w-4" /> : // Assuming Coffee for warning for now, can be generic
                                                                <Command className="h-4 w-4" />}
                                                    </div>
                                                    <div>
                                                        <p className={cn(
                                                            "text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#1A5235] dark:group-hover:text-emerald-400 transition-colors",
                                                            !notif.read && "text-slate-900 dark:text-white"
                                                        )}>{notif.title}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5 leading-snug">{notif.message}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 mt-2">{notif.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-center">
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-[#1A5235] dark:hover:text-emerald-400 transition-colors"
                                    >
                                        Marcar todas como leídas
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 sm:gap-4 pl-2 sm:pl-4 border-l border-slate-100 dark:border-slate-800 ml-1 sm:ml-2">
                    {!mounted || !user ? (
                        <div className="flex items-center gap-3 animate-pulse">
                            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-slate-100 dark:bg-slate-800" />
                            <div className="hidden xl:block space-y-2">
                                <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
                                <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="h-9 w-9 sm:h-11 sm:w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white dark:ring-slate-700 shadow-sm border border-slate-100 dark:border-slate-700">
                                <img
                                    src={user?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.full_name}&backgroundColor=166534&textColor=ffffff`}
                                    alt="User"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="hidden xl:block">
                                <p className="text-base font-black text-slate-800 dark:text-slate-200 leading-tight">
                                    {user?.full_name || "Usuario"}
                                </p>
                                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 lowercase">
                                    {user?.email}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from "react";
import { useTimer } from "@/hooks/use-timer";
import { mockUser } from "@/mocks/mock-data";
import toast from "react-hot-toast";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export type NotificationType = "success" | "warning" | "info" | "error";

export interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: NotificationType;
    read: boolean;
}

interface NotificationContextProps {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (title: string, message: string, type: NotificationType) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    checkWorkSchedule: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

// Componente personalizado de Toast - Tamaño Refinado (Compacto)
const CustomToast = ({
    title,
    message,
    type,
    onClose,
    duration
}: {
    title: string;
    message: string;
    type: NotificationType;
    onClose: () => void;
    duration: number;
}) => {
    const { theme } = useTheme();
    const iconConfig = {
        success: { Icon: CheckCircle2, bg: "rgb(22 101 52 / 0.1)", color: "#22c55e", barColor: "#22c55e" },
        error: { Icon: AlertCircle, bg: "rgb(220 38 38 / 0.1)", color: "#ef4444", barColor: "#ef4444" },
        warning: { Icon: AlertTriangle, bg: "rgb(234 88 12 / 0.1)", color: "#f97316", barColor: "#f97316" },
        info: { Icon: Info, bg: "rgb(37 99 235 / 0.1)", color: "#3b82f6", barColor: "#3b82f6" },
    };

    const { Icon, bg, color, barColor } = iconConfig[type];

    return (
        <div
            style={{
                width: '440px',
                maxWidth: '90vw',
                minHeight: '80px',
                position: 'relative',
                backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                borderRadius: '32px',
                border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                paddingRight: '64px', // Espacio real para la X
                boxSizing: 'border-box',
                overflow: 'hidden'
            }}
        >
            <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                style={{ backgroundColor: bg, color: color }}
            >
                <Icon size={24} strokeWidth={2.5} />
            </div>

            <div className="flex-1 min-w-0 pr-5">
                <h4 className="m-0 text-base font-black leading-tight text-slate-900 dark:text-white mb-1">
                    {title}
                </h4>
                <p className="m-0 text-[13px] font-bold leading-normal text-slate-500 dark:text-slate-400">
                    {message}
                </p>
            </div>

            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 100,
                    padding: '8px',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none'
                }}
                className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
            >
                <X size={20} strokeWidth={3} />
            </button>

            {/* Barra de Tiempo - Con radio para no sobresalir */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '20px',
                    right: '64px', // Termina antes de la X
                    height: '4px',
                    borderRadius: '10px',
                    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    overflow: 'hidden',
                    zIndex: 40
                }}
            >
                <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: duration / 1000, ease: "linear" }}
                    style={{
                        height: '100%',
                        backgroundColor: barColor,
                        boxShadow: `0 0 10px ${barColor}80`
                    }}
                />
            </div>
        </div>
    );
};

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const lastSent = useRef<Record<string, number>>({});
    const activeToasts = useRef<string[]>([]); // Tracking de toast IDs activos
    const { status } = useTimer();
    const TOAST_DURATION = 3500;

    const [dailyNotificationsSent, setDailyNotificationsSent] = useState<{
        lateStart: boolean;
        workEnd: boolean;
    }>({
        lateStart: false,
        workEnd: false,
    });

    const addNotification = useCallback((title: string, message: string, type: NotificationType) => {
        const now = Date.now();
        if (lastSent.current[title] && now - lastSent.current[title] < 1500) return;
        lastSent.current[title] = now;

        const newNotification: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            message,
            time: "Ahora",
            type,
            read: false,
        };

        setNotifications((prev) => [newNotification, ...prev]);

        // Gestión de límite (Máximo 5 toasts)
        if (activeToasts.current.length >= 5) {
            const oldestToastId = activeToasts.current.shift();
            if (oldestToastId) toast.dismiss(oldestToastId);
        }

        const toastId = toast.custom((t) => (
            <div
                style={{
                    opacity: t.visible ? 1 : 0,
                    transform: t.visible ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.95)',
                    transition: 'all 300ms cubic-bezier(0.23, 1, 0.32, 1)',
                    pointerEvents: t.visible ? 'auto' : 'none',
                    width: '420px',
                    maxWidth: '90vw'
                }}
            >
                <CustomToast
                    title={title}
                    message={message}
                    type={type}
                    onClose={() => toast.dismiss(t.id)}
                    duration={TOAST_DURATION}
                />
            </div>
        ), {
            duration: TOAST_DURATION,
            position: "top-right",
        });

        activeToasts.current.push(toastId);

        // Limpiar tracking después de la duración
        setTimeout(() => {
            activeToasts.current = activeToasts.current.filter(id => id !== toastId);
        }, TOAST_DURATION + 500);

    }, []);

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const checkWorkSchedule = useCallback(() => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeDecimal = currentHour + currentMinute / 60;

        const [startHourStr, startMinuteStr] = (mockUser.schedule?.start || "08:00").split(':');
        const [endHourStr, endMinuteStr] = (mockUser.schedule?.end || "17:00").split(':');

        const startTimeDecimal = parseInt(startHourStr) + parseInt(startMinuteStr) / 60;
        const endTimeDecimal = parseInt(endHourStr) + parseInt(endMinuteStr) / 60;

        if (
            status === 'idle' &&
            currentTimeDecimal > startTimeDecimal &&
            currentTimeDecimal < startTimeDecimal + 2 &&
            !dailyNotificationsSent.lateStart
        ) {
            addNotification("Inicio de Jornada Pendiente", `Ya ha pasado tu hora de entrada.`, "warning");
            setDailyNotificationsSent(prev => ({ ...prev, lateStart: true }));
        }

        if (
            status === 'running' &&
            currentTimeDecimal >= endTimeDecimal &&
            currentTimeDecimal < endTimeDecimal + 1 &&
            !dailyNotificationsSent.workEnd
        ) {
            addNotification("Fin de Jornada Laboral", `Ya has cumplido tu horario de salida (${mockUser.schedule.end}).`, "success");
            setDailyNotificationsSent(prev => ({ ...prev, workEnd: true }));
        }

    }, [status, dailyNotificationsSent, addNotification]);

    useEffect(() => {
        const interval = setInterval(checkWorkSchedule, 60000);
        checkWorkSchedule();
        return () => clearInterval(interval);
    }, [checkWorkSchedule]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            addNotification,
            markAsRead,
            markAllAsRead,
            checkWorkSchedule
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
}

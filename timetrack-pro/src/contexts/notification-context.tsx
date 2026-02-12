"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from "react";
import { useTimer } from "@/hooks/use-timer";
import { mockUser } from "@/mocks/mock-data";
import toast from "react-hot-toast";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    const iconConfig = {
        success: { Icon: CheckCircle2, bg: "#dcfce7", color: "#166534", barColor: "#22c55e" },
        error: { Icon: AlertCircle, bg: "#fee2e2", color: "#dc2626", barColor: "#ef4444" },
        warning: { Icon: AlertTriangle, bg: "#ffedd5", color: "#ea580c", barColor: "#f97316" },
        info: { Icon: Info, bg: "#dbeafe", color: "#2563eb", barColor: "#3b82f6" },
    };

    const { Icon, bg, color, barColor } = iconConfig[type];

    return (
        <div
            style={{
                width: '380px', // Reducido para que quepa mejor
                minHeight: '100px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                padding: '20px 24px',
                borderRadius: '28px',
                backgroundColor: 'white',
                border: '1px solid #f1f5f9',
                boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}
            className="dark:bg-[#0f172a] dark:border-slate-800"
        >
            <div
                style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: bg,
                    color: color,
                    flexShrink: 0
                }}
            >
                <Icon size={24} />
            </div>

            <div style={{ flex: 1, paddingRight: '35px' }}>
                <p style={{
                    fontSize: '16px', // Título más pequeño
                    fontWeight: 900,
                    color: '#1e293b',
                    lineHeight: 1.2,
                    marginBottom: '2px',
                    margin: 0
                }} className="dark:text-white">
                    {title}
                </p>
                <p style={{
                    fontSize: '13px', // Mensaje más pequeño
                    fontWeight: 700,
                    color: '#94a3b8',
                    lineHeight: 1.4,
                    margin: 0
                }} className="dark:text-slate-500">
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
                    padding: '8px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#cbd5e1',
                    zIndex: 50
                }}
                className="hover:text-slate-500 transition-colors"
            >
                <X size={20} strokeWidth={2.5} />
            </button>

            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '6px', // Línea un poco más delgada para el nuevo tamaño
                backgroundColor: '#f8fafc',
                zIndex: 20,
                overflow: 'hidden'
            }} className="dark:bg-slate-800/20">
                <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: duration / 1000, ease: "linear" }}
                    style={{
                        height: '100%',
                        backgroundColor: barColor,
                        boxShadow: `0 -2px 8px ${barColor}33`
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
                    pointerEvents: t.visible ? 'auto' : 'none'
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

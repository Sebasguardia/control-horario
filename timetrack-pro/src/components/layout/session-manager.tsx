"use client";

import { useEffect, useRef } from "react";
import { useSessionStore } from "@/stores/session-store";
import { useConfigStore } from "@/stores/config-store";
import { useNotification } from "@/contexts/notification-context";
import { mockStats } from "@/mocks/mock-data";

export default function SessionManager() {
    const status = useSessionStore((state) => state.status);
    const config = useConfigStore();
    const { addNotification } = useNotification();
    const lastNotified = useRef<Record<string, number>>({});

    // Timer Tick
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (status === "running" || status === "break") {
            interval = setInterval(() => {
                useSessionStore.getState().tick();
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [status]);

    // Schedule Monitoring
    useEffect(() => {
        if (!config.notificationsEnabled) return;

        const checkSchedule = () => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentTimeStr = currentHour.toString().padStart(2, '0') + ":" +
                currentMinute.toString().padStart(2, '0');

            const dayOfWeek = now.getDay();
            const isWorkday = dayOfWeek >= 1 && dayOfWeek <= 5;
            const session = useSessionStore.getState();

            // 1. Notificación de inicio de jornada (Solo entre la hora de inicio y 2 horas después)
            const [startH, startM] = config.startTimeHabitual.split(':').map(Number);
            const startTimeInMinutes = startH * 60 + startM;
            const currentTimeInMinutes = currentHour * 60 + currentMinute;

            if (
                session.status === 'idle' &&
                isWorkday &&
                currentTimeInMinutes >= startTimeInMinutes &&
                currentTimeInMinutes <= startTimeInMinutes + 120 // Solo avisar durante las primeras 2 horas
            ) {
                if (lastNotified.current['start'] !== now.getDate()) {
                    addNotification(
                        "Recordatorio de Inicio",
                        "Ya es hora de iniciar tu jornada laboral.",
                        "info"
                    );
                    lastNotified.current['start'] = now.getDate();
                }
            }

            // 2. Notificación de fin de jornada (Solo avisar si estamos entre la hora de fin y 3 horas después)
            const [endH, endM] = config.endTimeHabitual.split(':').map(Number);
            const endTimeInMinutes = endH * 60 + endM;

            if (
                session.status !== 'idle' &&
                currentTimeInMinutes >= endTimeInMinutes &&
                currentTimeInMinutes <= endTimeInMinutes + 180
            ) {
                if (lastNotified.current['end'] !== now.getDate()) {
                    addNotification(
                        "Hora de Salida",
                        `Has alcanzado tu hora de fin (${config.endTimeHabitual}). ¡No olvides cerrar jornada!`,
                        "warning"
                    );
                    lastNotified.current['end'] = now.getDate();
                }
            }

            // 3. Límite de horas por día
            const currentHours = session.seconds / 3600;
            if (session.status === 'running' && currentHours >= config.hoursPerDay) {
                if (lastNotified.current['overtime'] !== now.getDate()) {
                    addNotification(
                        "Límite Alcanzado",
                        `Has completado tus ${config.hoursPerDay} horas diarias.`,
                        "error"
                    );
                    lastNotified.current['overtime'] = now.getDate();
                }
            }
        };

        checkSchedule();
        const interval = setInterval(checkSchedule, 60000);
        return () => clearInterval(interval);
    }, [config.notificationsEnabled, config.startTimeHabitual, config.endTimeHabitual, config.hoursPerDay, addNotification, status]);

    return null;
}

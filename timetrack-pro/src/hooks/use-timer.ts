"use client";

import { useSessionStore } from "@/stores/session-store";
import { useMemo } from "react";

export type TimerStatus = "idle" | "running" | "paused" | "break";
export type BreakType = "Almuerzo" | "Descanso" | "Personal";

export function useTimer() {
    // Using selectors to ensure components only re-render when necessary
    // and to be more explicit about dependencies.
    const status = useSessionStore((state) => state.status) as TimerStatus;
    const seconds = useSessionStore((state) => state.seconds);
    const breakSeconds = useSessionStore((state) => state.breakSeconds);
    const currentBreak = useSessionStore((state) => state.currentBreak);

    const startSession = useSessionStore((state) => state.startSession);
    const stopSession = useSessionStore((state) => state.stopSession);
    const startBreak = useSessionStore((state) => state.startBreak);
    const endBreak = useSessionStore((state) => state.endBreak);

    const currentBreakType = useMemo(() =>
        currentBreak?.break_type as BreakType | null,
        [currentBreak]);

    return {
        status,
        seconds,
        breakSeconds,
        currentBreakType,
        startSession,
        stopSession,
        startBreak,
        endBreak,
    };
}

"use client";

import { useSessionStore, EnrichmentStatus } from "@/stores/session-store";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, Loader2, AlertTriangle, PartyPopper } from "lucide-react";

/**
 * SessionContextBadge
 * 
 * Visual feedback component that displays:
 * - Loading spinner while APIs are being queried
 * - Weather condition + temperature
 * - Holiday badge if today is a public holiday
 * - Partial error indicator if one API failed
 */

const weatherIcons: Record<string, React.ReactNode> = {
    Clear: <Sun className="h-4 w-4 text-amber-500" />,
    Clouds: <Cloud className="h-4 w-4 text-slate-400" />,
    Rain: <CloudRain className="h-4 w-4 text-blue-500" />,
    Drizzle: <CloudDrizzle className="h-4 w-4 text-blue-400" />,
    Thunderstorm: <CloudLightning className="h-4 w-4 text-purple-500" />,
    Snow: <CloudSnow className="h-4 w-4 text-cyan-300" />,
};

function getWeatherIcon(condition?: string | null) {
    if (!condition) return <Cloud className="h-4 w-4 text-slate-400" />;
    return weatherIcons[condition] || <Cloud className="h-4 w-4 text-slate-400" />;
}

export default function SessionContextBadge() {
    const enrichmentStatus = useSessionStore((s) => s.enrichmentStatus) as EnrichmentStatus;
    const enrichmentErrors = useSessionStore((s) => s.enrichmentErrors);
    const session = useSessionStore((s) => s.currentSession);
    const status = useSessionStore((s) => s.status);

    // Only show when session is active
    if (status === 'idle') return null;

    return (
        <AnimatePresence mode="wait">
            {/* Loading State */}
            {enrichmentStatus === 'loading' && (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400"
                >
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Consultando clima y festivos...</span>
                </motion.div>
            )}

            {/* Success / Partial data */}
            {(enrichmentStatus === 'success' || enrichmentStatus === 'partial-error') && session && (
                <motion.div
                    key="data"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-wrap items-center gap-2"
                >
                    {/* Weather Badge */}
                    {session.weather_condition && (
                        <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                            {getWeatherIcon(session.weather_condition)}
                            <span>{session.weather_condition}</span>
                            {session.temperature != null && (
                                <span className="text-slate-400 dark:text-slate-500">
                                    {session.temperature}°C
                                </span>
                            )}
                        </div>
                    )}

                    {/* Holiday Badge */}
                    {session.is_holiday && (
                        <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-2.5 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                            <PartyPopper className="h-3.5 w-3.5" />
                            <span>🎉 {session.holiday_name || 'Feriado'}</span>
                        </div>
                    )}

                    {/* Partial Error Indicator */}
                    {enrichmentStatus === 'partial-error' && (
                        <div
                            className="flex items-center gap-1 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 px-2 py-1.5 text-[10px] font-semibold text-orange-600 dark:text-orange-400 cursor-help"
                            title={enrichmentErrors.join('\n')}
                        >
                            <AlertTriangle className="h-3 w-3" />
                            <span>Datos parciales</span>
                        </div>
                    )}
                </motion.div>
            )}

            {/* Full Error State */}
            {enrichmentStatus === 'error' && (
                <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-2.5 py-1.5 text-[10px] font-semibold text-red-600 dark:text-red-400 cursor-help"
                    title={enrichmentErrors.join('\n')}
                >
                    <AlertTriangle className="h-3 w-3" />
                    <span>Contexto no disponible</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

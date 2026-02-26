"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Sun,
    Cloud,
    CloudRain,
    CloudSnow,
    CloudLightning,
    CloudDrizzle,
    Thermometer,
    MapPin,
    Wind,
    Loader2,
    CloudOff,
} from "lucide-react";

interface WeatherData {
    condition: string;
    description: string;
    temperature: number;
    icon: string;
}

const weatherConfig: Record<string, { icon: React.ReactNode; gradient: string; textColor: string }> = {
    Clear: {
        icon: <Sun className="h-8 w-8" />,
        gradient: "from-amber-400 to-orange-500",
        textColor: "text-amber-50",
    },
    Clouds: {
        icon: <Cloud className="h-8 w-8" />,
        gradient: "from-slate-400 to-slate-500",
        textColor: "text-slate-50",
    },
    Rain: {
        icon: <CloudRain className="h-8 w-8" />,
        gradient: "from-blue-500 to-blue-700",
        textColor: "text-blue-50",
    },
    Drizzle: {
        icon: <CloudDrizzle className="h-8 w-8" />,
        gradient: "from-blue-400 to-blue-500",
        textColor: "text-blue-50",
    },
    Thunderstorm: {
        icon: <CloudLightning className="h-8 w-8" />,
        gradient: "from-purple-600 to-indigo-800",
        textColor: "text-purple-50",
    },
    Snow: {
        icon: <CloudSnow className="h-8 w-8" />,
        gradient: "from-cyan-300 to-blue-400",
        textColor: "text-cyan-50",
    },
};

function getConfig(condition: string) {
    return weatherConfig[condition] || weatherConfig["Clouds"];
}

export default function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            try {
                // Get geolocation
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    if (!navigator.geolocation) {
                        reject(new Error("No geolocation"));
                        return;
                    }
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        timeout: 5000,
                        maximumAge: 600000, // 10 min cache
                    });
                });

                const lat = position?.coords?.latitude || -12.0464; // Lima Lat
                const lng = position?.coords?.longitude || -77.0428; // Lima Lng

                const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
                if (!res.ok) throw new Error("API failed");

                const data = await res.json();
                setWeather(data);
            } catch (err) {
                console.warn("[WeatherWidget] Geolocation failed, using Lima fallback:", err);
                try {
                    // Force fetch for Lima if geolocation fails
                    const res = await fetch(`/api/weather?lat=-12.0464&lng=-77.0428`);
                    const data = await res.json();
                    setWeather(data);
                } catch {
                    setError(true);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-5 flex items-center justify-center gap-2 text-slate-400 min-h-[120px]">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-xs font-bold">Cargando clima...</span>
            </div>
        );
    }

    // Error or no data - show minimal card
    if (error || !weather) {
        return (
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 p-5 flex items-center gap-3 min-h-[120px]">
                <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <CloudOff className="h-6 w-6 text-slate-400" />
                </div>
                <div>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">Clima</p>
                    <p className="text-sm font-bold text-slate-500">No disponible</p>
                </div>
            </div>
        );
    }

    const config = getConfig(weather.condition);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${config.gradient} p-5 sm:p-6 shadow-lg min-h-[120px]`}
        >
            {/* Background blur decoration */}
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-black/5 blur-xl" />

            <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-1 opacity-70 mb-1">
                        <MapPin className={`h-3 w-3 ${config.textColor}`} />
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${config.textColor}`}>
                            Lima, PE
                        </p>
                    </div>
                    <div className="flex items-end gap-1.5">
                        <span className={`text-3xl sm:text-4xl font-black ${config.textColor} tracking-tighter`}>
                            {Math.round(weather.temperature)}°
                        </span>
                        <span className={`text-sm font-bold ${config.textColor} opacity-60 mb-1`}>C</span>
                    </div>
                    <p className={`text-xs font-bold ${config.textColor} opacity-80 capitalize mt-1`}>
                        {weather.description}
                    </p>
                </div>

                <div className={`${config.textColor} opacity-90`}>
                    {config.icon}
                </div>
            </div>
        </motion.div>
    );
}

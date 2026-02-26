"use client";

import { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, MapPin, Loader2, CloudOff } from "lucide-react";

interface WeatherData {
    condition: string;
    description: string;
    temperature: number;
    icon: string;
    city: string;
}

const weatherIcons: Record<string, React.ReactNode> = {
    Clear: <Sun className="h-4 w-4 text-amber-500" />,
    Clouds: <Cloud className="h-4 w-4 text-slate-400" />,
    Rain: <CloudRain className="h-4 w-4 text-blue-500" />,
    Drizzle: <CloudDrizzle className="h-4 w-4 text-blue-400" />,
    Thunderstorm: <CloudLightning className="h-4 w-4 text-purple-500" />,
    Snow: <CloudSnow className="h-4 w-4 text-cyan-300" />,
};

import { motion } from "framer-motion";

export default function WeatherHeader() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            let lat = -12.0464; // Fallback Lima
            let lng = -77.0428;

            try {
                // Try to get real user location
                if (navigator.geolocation) {
                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                    });
                    lat = position.coords.latitude;
                    lng = position.coords.longitude;
                }
            } catch (err) {
                console.warn("[WeatherHeader] Using fallback location:", err);
            }

            try {
                const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
                if (res.ok) {
                    const data = await res.json();
                    setWeather(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
    }, []);

    if (loading) return <div className="flex h-10 w-32 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />;
    if (!weather) return null;

    const Icon = weatherIcons[weather.condition] || <Cloud className="h-4 w-4 text-slate-400" />;

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md"
        >
            <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
                    <MapPin className="h-3 w-3" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 truncate max-w-[100px]">
                    {weather.city}
                </span>
            </div>
            <div className="h-4 w-[1px] bg-slate-100 dark:bg-slate-800" />
            <div className="flex items-center gap-2.5">
                <div className="scale-110">{Icon}</div>
                <div className="flex flex-col -space-y-1">
                    <span className="text-sm font-black text-slate-800 dark:text-slate-100">{Math.round(weather.temperature)}°C</span>
                    <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400 dark:text-slate-500">{weather.description}</span>
                </div>
            </div>
        </motion.div>
    );
}

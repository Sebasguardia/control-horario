
import { formatHoursMinutes } from "@/lib/utils";
import { Target, Clock, Coffee, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface HistorySummaryProps {
    sessions: any[];
}

export function HistorySummary({ sessions }: HistorySummaryProps) {
    const totalNet = sessions.reduce((acc, s) => acc + (s.totalMinutes || 0), 0);
    const totalBreaks = sessions.reduce((acc, s) => acc + (s.breakMinutes || 0), 0);
    const avgDaily = sessions.length > 0 ? Math.round(totalNet / sessions.length) : 0;

    const cards = [
        { label: "Jornadas", value: sessions.length, icon: Target, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Tiempo Total", value: formatHoursMinutes(totalNet), icon: Clock, color: "text-primary", bg: "bg-primary/5" },
        { label: "Pausas Totales", value: `${totalBreaks}m`, icon: Coffee, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Promedio Día", value: formatHoursMinutes(avgDaily), icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {cards.map((card, i) => (
                <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm transition-all hover:shadow-md"
                >
                    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4">
                        <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-[1.2rem] ${card.bg} dark:bg-slate-800 ${card.color} transition-transform group-hover:scale-110 shrink-0`}>
                            <card.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div className="text-center sm:text-left overflow-hidden w-full">
                            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 truncate">{card.label}</p>
                            <p className="text-sm sm:text-xl font-black text-slate-800 dark:text-white truncate">{card.value}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

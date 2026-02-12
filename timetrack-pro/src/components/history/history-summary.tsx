import { mockHistorySessions } from "@/mocks/mock-data";
import { formatHoursMinutes } from "@/lib/utils";
import { Target, Clock, Coffee, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function HistorySummary() {
    const totalNet = mockHistorySessions.reduce((acc, s) => acc + (s.totalMinutes || 0), 0);
    const totalBreaks = mockHistorySessions.reduce((acc, s) => acc + (s.breakMinutes || 0), 0);
    const avgDaily = Math.round(totalNet / mockHistorySessions.length);

    const cards = [
        { label: "Jornadas", value: mockHistorySessions.length, icon: Target, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Tiempo Total", value: formatHoursMinutes(totalNet), icon: Clock, color: "text-primary", bg: "bg-primary/5" },
        { label: "Pausas Totales", value: `${totalBreaks}m`, icon: Coffee, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Promedio Día", value: formatHoursMinutes(avgDaily), icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
    ];

    return (
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, i) => (
                <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                >
                    <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-[1.2rem] ${card.bg} ${card.color} transition-transform group-hover:scale-110`}>
                            <card.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{card.label}</p>
                            <p className="text-xl font-black text-slate-800">{card.value}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

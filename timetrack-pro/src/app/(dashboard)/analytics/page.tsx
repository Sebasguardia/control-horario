"use client";

import { useEffect } from "react";
import { AnalyticsMetrics } from "@/components/analytics/analytics-metrics";
import { AnalyticsCharts } from "@/components/analytics/analytics-charts";
import { TrendsGraph } from "@/components/analytics/trends-graph";
import { usePageStore } from "@/stores/page-store";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
    const { title, subtitle, setTitle } = usePageStore();

    useEffect(() => {
        setTitle("Panel Analítico", "Métricas detalladas y tendencias de productividad.");
    }, [setTitle]);

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-800 dark:text-white">{title}</h1>
                {subtitle && (
                    <p className="mt-2 text-base font-bold text-slate-400 dark:text-slate-500">{subtitle}</p>
                )}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
            >
                <AnalyticsMetrics />
                <TrendsGraph />
                <AnalyticsCharts />
            </motion.div>
        </div>
    );
}

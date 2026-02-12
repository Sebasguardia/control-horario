"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });

    // Spring configuration for smooth counting
    const springValue = useSpring(0, {
        stiffness: 100,
        damping: 30,
    });

    // Transform spring to displayable number
    const displayValue = useTransform(springValue, (latest) =>
        Math.floor(latest).toLocaleString()
    );

    useEffect(() => {
        if (inView) {
            springValue.set(value);
        }
    }, [inView, value, springValue]);

    return (
        <span ref={ref} className="tabular-nums">
            <motion.span>{displayValue}</motion.span>{suffix}
        </span>
    );
};

export const Stats = () => {
    return (
        <section className="py-24 bg-emerald-600 dark:bg-emerald-900/20 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4 text-center text-white">
                    {[
                        { value: 5000, suffix: "+", label: "Equipos Activos" },
                        { value: 2000000, suffix: "+", label: "Horas Registradas" },
                        { value: 98, suffix: "%", label: "Satisfacción" },
                        { value: 40, suffix: "%", label: "Productividad" }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <h3 className="text-5xl lg:text-7xl font-black tracking-tighter mb-4 flex items-center gap-1">
                                <Counter value={item.value} suffix={item.suffix} />
                            </h3>
                            <p className="text-sm font-black uppercase tracking-[0.3em] opacity-70 italic">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

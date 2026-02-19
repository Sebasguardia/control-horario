"use client";

import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import { useUIStore } from "@/stores/ui-store";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isSidebarOpen, setSidebarOpen } = useUIStore();
    const pathname = usePathname();

    // Close sidebar on route change (Mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname, setSidebarOpen]);

    return (
        <div className="flex h-screen bg-white dark:bg-black p-2 lg:p-3 gap-2 lg:gap-3 overflow-hidden transition-colors duration-300 relative">

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="bg-slate-900/60 backdrop-blur-sm fixed inset-0 z-[100] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-2 left-2 z-[110] w-[280px] lg:hidden"
                        >
                            <div className="h-full rounded-[1.5rem] bg-[#F7F8F9] dark:bg-slate-900 overflow-hidden border border-transparent dark:border-slate-800/50 relative shadow-2xl">
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    aria-label="Cerrar menú de navegación"
                                    className="absolute top-4 right-4 z-[120] h-10 w-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-md border border-slate-100 dark:border-slate-700 active:scale-95"
                                >
                                    <X size={18} />
                                </button>
                                <Sidebar />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar Section */}
            <div className="hidden lg:flex flex-col w-64 shrink-0 rounded-[1.5rem] bg-[#F7F8F9] dark:bg-slate-900 overflow-hidden transition-all duration-300 border border-transparent dark:border-slate-800/50">
                <Sidebar />
            </div>

            {/* Main Content Viewport */}
            <div className="flex flex-1 flex-col gap-2 lg:gap-3 min-w-0">
                {/* Navbar Section */}
                <div className="h-16 lg:h-20 shrink-0 rounded-[1.5rem] bg-[#F7F8F9] dark:bg-slate-900 flex items-center relative z-20 transition-all duration-300 border border-transparent dark:border-slate-800/50">
                    <Navbar />
                </div>

                {/* Main Viewport Section */}
                <main className="flex-1 rounded-[1.5rem] bg-[#F7F8F9] dark:bg-slate-900 overflow-hidden relative transition-all duration-300 border border-transparent dark:border-slate-800/50">
                    <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-5 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl border border-transparent dark:border-slate-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex shrink-0 items-center justify-between px-6 sm:px-8 pt-6 sm:pt-8 pb-2">
                            <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-800 dark:text-white">{title}</h3>
                            <button
                                onClick={onClose}
                                className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 transition-all hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-200 active:scale-90"
                            >
                                <X className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                        </div>
                        <div className="overflow-y-auto px-6 sm:px-8 pb-6 sm:pb-8 pt-4 no-scrollbar">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

interface ConfirmModalProps extends ModalProps {
    onConfirm: () => void;
    confirmText?: string;
    confirmVariant?: "primary" | "danger";
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, children, confirmText = "Confirmar", confirmVariant = "primary" }: ConfirmModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-6 sm:space-y-8">
                <div className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {children}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onClose}
                        className="order-2 sm:order-1 flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3.5 sm:py-4 text-sm font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className={cn(
                            "order-1 sm:order-2 flex-1 rounded-2xl py-3.5 sm:py-4 text-sm font-bold text-white shadow-xl transition-all active:scale-95",
                            confirmVariant === "danger"
                                ? "bg-red-500 shadow-red-200 dark:shadow-red-900/20 hover:bg-red-600"
                                : "bg-[#1A5235] shadow-primary/20 hover:bg-emerald-900"
                        )}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}


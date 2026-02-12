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
                        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl border border-transparent dark:border-slate-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex shrink-0 items-center justify-between px-8 pt-8 pb-2">
                            <h3 className="text-xl font-black tracking-tight text-slate-800 dark:text-white">{title}</h3>
                            <button
                                onClick={onClose}
                                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 transition-all hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-200 active:scale-90"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="overflow-y-auto px-8 pb-8 pt-4 no-scrollbar">
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
            <div className="space-y-8">
                <div className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {children}
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className={cn(
                            "flex-1 rounded-2xl py-4 text-sm font-bold text-white shadow-xl transition-all active:scale-95",
                            confirmVariant === "danger"
                                ? "bg-red-500 shadow-red-200 dark:shadow-red-900/20 hover:bg-red-600"
                                : "bg-primary shadow-primary/20 hover:bg-primary-dark"
                        )}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}


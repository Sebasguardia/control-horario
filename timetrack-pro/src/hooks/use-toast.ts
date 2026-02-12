"use client";

import { useNotification } from "@/contexts/notification-context";

export function useToast() {
    const { addNotification } = useNotification();

    const showToast = ({
        title,
        description,
        variant = "default",
    }: {
        title: string;
        description?: string;
        variant?: "default" | "destructive" | "success";
    }) => {
        const typeMap = {
            "default": "info",
            "destructive": "error",
            "success": "success"
        } as const;

        addNotification(
            title,
            description || "",
            typeMap[variant]
        );
    };

    return { toast: showToast };
}

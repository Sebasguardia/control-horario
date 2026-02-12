"use client";

import { Toaster as HotToaster } from "react-hot-toast";
import { useTheme } from "@/hooks/use-theme";

export function Toaster() {
    const { theme } = useTheme();

    return (
        <HotToaster
            position="top-right"
            reverseOrder={false}
            gutter={12}
            toastOptions={{
                duration: 4000,
                // Aplicamos estilos mínimos para no romper el layout, pero el diseño real está en CustomToast
                className: "custom-toast-container",
                style: {
                    background: "transparent",
                    boxShadow: "none",
                    border: "none",
                    padding: 0,
                    maxWidth: "none",
                },
            }}
        />
    );
}

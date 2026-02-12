import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import SessionManager from "@/components/layout/session-manager";

import { NotificationProvider } from "@/contexts/notification-context";

export const metadata: Metadata = {
  title: "TimeTrack Pro - Control Horario",
  description: "Sistema de gestión de tiempo laboral. Registra jornadas, gestiona pausas y genera reportes detallados.",
  keywords: ["control horario", "tiempo laboral", "gestión", "productividad"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased font-sans overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NotificationProvider>
            <SessionManager />
            {children}
            <Toaster />
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}

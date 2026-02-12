import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "#166534", // Deep forest green from reference
                    foreground: "#FFFFFF",
                    dark: "#14532D",
                    light: "#22C55E",
                },
                secondary: {
                    DEFAULT: "#F1F5F9",
                    foreground: "#0F172A",
                },
                destructive: {
                    DEFAULT: "#EF4444",
                    foreground: "#FFFFFF",
                },
                muted: {
                    DEFAULT: "#F8FAFC",
                    foreground: "#64748B",
                },
                accent: {
                    DEFAULT: "#DCFCE7", // Minty green accent
                    foreground: "#166534",
                },
                card: {
                    DEFAULT: "#FFFFFF",
                    foreground: "#0F172A",
                },
                sidebar: {
                    DEFAULT: "#FFFFFF",
                    foreground: "#64748B",
                    hover: "#F8FAFC",
                    active: "#166534",
                },
            },
            borderRadius: {
                "3xl": "1.5rem",
                "4xl": "2rem",
                lg: "1rem",
                md: "0.75rem",
                sm: "0.5rem",
            },
            boxShadow: {
                premium: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)",
            }
        },
    },
    plugins: [],
};
export default config;

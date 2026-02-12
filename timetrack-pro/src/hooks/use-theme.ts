import { useThemeStore } from '@/stores/theme-store';

export function useTheme() {
    const theme = useThemeStore((state) => state.theme);
    const setTheme = useThemeStore((state) => state.setTheme);

    return { theme, setTheme };
}

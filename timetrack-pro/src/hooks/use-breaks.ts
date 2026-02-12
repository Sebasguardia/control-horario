import { useSessionStore } from '@/stores/session-store';

export function useBreaks() {
    const currentBreak = useSessionStore((state) => state.currentBreak);
    const startBreak = useSessionStore((state) => state.startBreak);
    const endBreak = useSessionStore((state) => state.endBreak);

    return {
        currentBreak,
        isOnBreak: !!currentBreak,
        startBreak,
        endBreak,
    };
}

import { useSessionStore } from '@/stores/session-store';

export function useSession() {
    const session = useSessionStore((state) => state.currentSession);
    const status = useSessionStore((state) => state.status);
    const startSession = useSessionStore((state) => state.startSession);
    const stopSession = useSessionStore((state) => state.stopSession);
    const startBreak = useSessionStore((state) => state.startBreak);
    const endBreak = useSessionStore((state) => state.endBreak);

    return {
        session,
        status,
        startSession,
        stopSession,
        startBreak,
        endBreak,
        seconds: useSessionStore((state) => state.seconds),
        breakSeconds: useSessionStore((state) => state.breakSeconds),
    };
}

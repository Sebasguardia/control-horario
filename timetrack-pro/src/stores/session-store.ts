import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { WorkSession, Break } from '@/types/models';
import { SessionService } from '@/services/session-service';
import { BreakService } from '@/services/break-service';

interface SessionState {
    currentSession: WorkSession | null;
    currentBreak: Break | null;
    pastSessions: any[];
    seconds: number;
    breakSeconds: number;
    status: 'idle' | 'running' | 'paused' | 'break';
    isLoading: boolean;

    startSession: (userId: string) => Promise<void>;
    stopSession: (notes?: string) => Promise<void>;
    startBreak: (type: string) => Promise<void>;
    endBreak: () => Promise<void>;
    tick: () => void;
    loadSessions: (userId: string) => Promise<void>;
    loadActiveSession: (userId: string) => Promise<void>;
    reset: () => void;
}

export const useSessionStore = create<SessionState>()(
    persist(
        (set, get) => ({
            currentSession: null,
            currentBreak: null,
            pastSessions: [],
            seconds: 0,
            breakSeconds: 0,
            status: 'idle',
            isLoading: false,

            startSession: async (userId: string) => {
                set({ isLoading: true });
                const session = await SessionService.startSession(userId);
                if (session) {
                    set({
                        status: 'running',
                        seconds: 0,
                        breakSeconds: 0,
                        currentSession: session,
                        isLoading: false,
                    });
                } else {
                    set({ isLoading: false });
                }
            },

            stopSession: async (notes?: string) => {
                const state = get();
                if (state.currentSession) {
                    set({ isLoading: true });
                    const updatedSession = await SessionService.endSession(state.currentSession.id, notes);

                    if (updatedSession) {
                        const now = new Date();
                        const newPastSession = {
                            id: updatedSession.id,
                            date: now.toISOString().split('T')[0],
                            startTime: new Date(updatedSession.start_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                            endTime: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                            totalMinutes: updatedSession.net_work_minutes || Math.floor(state.seconds / 60),
                            breakMinutes: updatedSession.total_break_minutes || Math.floor(state.breakSeconds / 60),
                            status: "completed",
                        };
                        set({
                            pastSessions: [newPastSession, ...state.pastSessions],
                            status: 'idle',
                            currentSession: null,
                            currentBreak: null,
                            seconds: 0,
                            breakSeconds: 0,
                            isLoading: false,
                        });
                    } else {
                        set({ status: 'idle', currentSession: null, currentBreak: null, seconds: 0, breakSeconds: 0, isLoading: false });
                    }
                } else {
                    set({ status: 'idle', currentSession: null, currentBreak: null, seconds: 0, breakSeconds: 0 });
                }
            },

            startBreak: async (type: string) => {
                const session = get().currentSession;
                if (!session) return;

                const breakRecord = await BreakService.startBreak(session.id, type as Break['break_type']);
                if (breakRecord) {
                    set({
                        status: 'break',
                        currentBreak: breakRecord,
                    });
                }
            },

            endBreak: async () => {
                const state = get();
                if (!state.currentBreak || !state.currentSession) return;

                const updatedBreak = await BreakService.endBreak(state.currentBreak.id, state.currentSession.id);
                if (updatedBreak) {
                    set({ status: 'running', currentBreak: null });
                }
            },

            tick: () => {
                const { status } = get();
                if (status === 'running') {
                    set((state) => ({ seconds: state.seconds + 1 }));
                } else if (status === 'break') {
                    set((state) => ({ breakSeconds: state.breakSeconds + 1 }));
                }
            },

            loadSessions: async (userId: string) => {
                set({ isLoading: true });
                const sessions = await SessionService.getRecentSessions(userId, 20);
                const formattedSessions = sessions
                    .filter(s => s.status === 'completed' && s.end_time)
                    .map(s => ({
                        id: s.id,
                        date: new Date(s.start_time).toISOString().split('T')[0],
                        startTime: new Date(s.start_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                        endTime: s.end_time ? new Date(s.end_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '--:--',
                        totalMinutes: s.net_work_minutes || 0,
                        breakMinutes: s.total_break_minutes || 0,
                        status: s.status,
                    }));
                set({ pastSessions: formattedSessions, isLoading: false });
            },

            loadActiveSession: async (userId: string) => {
                const session = await SessionService.getActiveSession(userId);
                if (session) {
                    // Calculate elapsed time
                    const startTime = new Date(session.start_time).getTime();
                    const now = Date.now();
                    const elapsedSeconds = Math.floor((now - startTime) / 1000);

                    // Check for active break
                    const activeBreak = await BreakService.getActiveBreak(session.id);

                    set({
                        currentSession: session,
                        status: activeBreak ? 'break' : session.status === 'break' ? 'break' : 'running',
                        seconds: elapsedSeconds,
                        currentBreak: activeBreak,
                    });
                }
            },

            reset: () => {
                set({
                    currentSession: null,
                    currentBreak: null,
                    pastSessions: [],
                    seconds: 0,
                    breakSeconds: 0,
                    status: 'idle',
                    isLoading: false,
                });
            },
        }),
        {
            name: 'timetrack-session-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

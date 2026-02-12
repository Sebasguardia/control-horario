import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { WorkSession, Break } from '@/types/models';
import { mockRecentSessions } from '@/mocks/mock-data';

interface SessionState {
    currentSession: WorkSession | null;
    currentBreak: Break | null;
    pastSessions: any[]; // Using any for simplicity with mock data
    seconds: number;
    breakSeconds: number;
    status: 'idle' | 'running' | 'paused' | 'break';

    startSession: () => void;
    stopSession: () => void;
    startBreak: (type: string) => void;
    endBreak: () => void;
    tick: () => void;
}

// Fallback for random UUID
const getUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 15);
};

export const useSessionStore = create<SessionState>()(
    persist(
        (set, get) => ({
            currentSession: null,
            currentBreak: null,
            pastSessions: mockRecentSessions,
            seconds: 0,
            breakSeconds: 0,
            status: 'idle',

            startSession: () => {
                const now = new Date();
                set({
                    status: 'running',
                    seconds: 0,
                    breakSeconds: 0,
                    currentSession: {
                        id: getUUID(),
                        user_id: 'user-1',
                        start_time: now.toISOString(),
                        end_time: null,
                        total_break_minutes: 0,
                        net_work_minutes: 0,
                        notes: '', // Keep for type compatibility but unused in UI
                        created_at: now.toISOString(),
                        updated_at: now.toISOString()
                    } as any
                });
            },

            stopSession: () => {
                const state = get();
                if (state.currentSession) {
                    const now = new Date();
                    const newPastSession = {
                        id: state.currentSession.id,
                        date: now.toISOString().split('T')[0],
                        startTime: new Date(state.currentSession.start_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                        endTime: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                        totalMinutes: Math.floor(state.seconds / 60) + Math.floor(state.breakSeconds / 60),
                        breakMinutes: Math.floor(state.breakSeconds / 60),
                        status: "completed",
                    };
                    set({
                        pastSessions: [newPastSession, ...state.pastSessions],
                        status: 'idle',
                        currentSession: null,
                        currentBreak: null,
                        seconds: 0,
                        breakSeconds: 0,
                    });
                } else {
                    set({ status: 'idle', currentSession: null, currentBreak: null, seconds: 0, breakSeconds: 0 });
                }
            },

            startBreak: (type) => {
                set({
                    status: 'break',
                    currentBreak: {
                        id: getUUID(),
                        work_session_id: get().currentSession?.id || '',
                        break_type: type as any,
                        start_time: new Date().toISOString(),
                        end_time: null,
                        duration_minutes: 0,
                        notes: null,
                        created_at: new Date().toISOString()
                    }
                });
            },

            endBreak: () => {
                set({ status: 'running', currentBreak: null });
            },

            tick: () => {
                const { status } = get();
                if (status === 'running') {
                    set((state) => ({ seconds: state.seconds + 1 }));
                } else if (status === 'break') {
                    set((state) => ({ breakSeconds: state.breakSeconds + 1 }));
                }
            }
        }),
        {
            name: 'timetrack-session-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

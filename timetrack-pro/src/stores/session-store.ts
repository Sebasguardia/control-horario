import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { WorkSession, Break } from '@/types/models';
import { SessionService } from '@/services/session-service';
import { BreakService } from '@/services/break-service';
import { enrichSessionContext, toEnrichmentData, EnrichmentResult } from '@/services/context-enrichment-service';

export type EnrichmentStatus = 'idle' | 'loading' | 'success' | 'partial-error' | 'error';

interface SessionState {
    currentSession: WorkSession | null;
    currentBreak: Break | null;
    pastSessions: any[];
    seconds: number;
    breakSeconds: number;
    status: 'idle' | 'running' | 'paused' | 'break';
    isLoading: boolean;
    enrichmentStatus: EnrichmentStatus;
    enrichmentErrors: string[];

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
            enrichmentStatus: 'idle',
            enrichmentErrors: [],

            startSession: async (userId: string) => {
                set({ isLoading: true, enrichmentStatus: 'loading', enrichmentErrors: [] });

                // ═══════════════════════════════════════════════════
                // STEP 1: Get user's geolocation (if available)
                // ═══════════════════════════════════════════════════
                let lat: number | undefined;
                let lng: number | undefined;

                try {
                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        if (!navigator.geolocation) {
                            reject(new Error('Geolocation not supported'));
                            return;
                        }
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                            timeout: 5000,
                            maximumAge: 300000, // 5 min cache
                        });
                    });
                    lat = position.coords.latitude;
                    lng = position.coords.longitude;
                } catch (geoError) {
                    console.warn('[Session] Geolocation unavailable:', geoError);
                }

                // ═══════════════════════════════════════════════════
                // STEP 2: Fetch weather + holidays in PARALLEL
                // Uses Promise.allSettled inside enrichSessionContext
                // ═══════════════════════════════════════════════════
                let enrichmentResult: EnrichmentResult | null = null;
                try {
                    enrichmentResult = await enrichSessionContext(lat, lng, 'PE');
                } catch (error) {
                    console.error('[Session] Enrichment failed entirely:', error);
                }

                // ═══════════════════════════════════════════════════
                // STEP 3: Create session with enrichment data
                // Session is ALWAYS created, even if enrichment failed
                // ═══════════════════════════════════════════════════
                const enrichmentData = enrichmentResult
                    ? toEnrichmentData(enrichmentResult)
                    : undefined;

                const session = await SessionService.startSession(userId, enrichmentData);

                if (session) {
                    set({
                        status: 'running',
                        seconds: 0,
                        breakSeconds: 0,
                        currentSession: session,
                        isLoading: false,
                        enrichmentStatus: enrichmentResult?.hasPartialError
                            ? 'partial-error'
                            : enrichmentResult
                                ? 'success'
                                : 'error',
                        enrichmentErrors: enrichmentResult?.errors || ['Enrichment service unavailable'],
                    });
                } else {
                    set({ isLoading: false, enrichmentStatus: 'error', enrichmentErrors: ['Failed to create session'] });
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
                            start_time: updatedSession.start_time,
                            weather_condition: updatedSession.weather_condition,
                            temperature: updatedSession.temperature,
                            is_holiday: updatedSession.is_holiday,
                            holiday_name: updatedSession.holiday_name,
                            notes: updatedSession.notes
                        };
                        set({
                            pastSessions: [newPastSession, ...state.pastSessions],
                            status: 'idle',
                            currentSession: null,
                            currentBreak: null,
                            seconds: 0,
                            breakSeconds: 0,
                            isLoading: false,
                            enrichmentStatus: 'idle',
                            enrichmentErrors: [],
                        });
                    } else {
                        set({ status: 'idle', currentSession: null, currentBreak: null, seconds: 0, breakSeconds: 0, isLoading: false, enrichmentStatus: 'idle', enrichmentErrors: [] });
                    }
                } else {
                    set({ status: 'idle', currentSession: null, currentBreak: null, seconds: 0, breakSeconds: 0, enrichmentStatus: 'idle', enrichmentErrors: [] });
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
                        start_time: s.start_time,
                        weather_condition: s.weather_condition,
                        temperature: s.temperature,
                        is_holiday: s.is_holiday,
                        holiday_name: s.holiday_name,
                        notes: s.notes
                    }))
                    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
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
                    enrichmentStatus: 'idle',
                    enrichmentErrors: [],
                });
            },
        }),
        {
            name: 'timetrack-session-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

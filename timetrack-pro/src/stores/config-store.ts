import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConfigState {
    hoursPerDay: number;
    workDaysPerWeek: number;
    startTimeHabitual: string; // "HH:mm"
    endTimeHabitual: string;   // "HH:mm"

    // Notifications enabled
    notificationsEnabled: boolean;
    breakReminders: boolean;
    overtimeAlerts: boolean;
    exitReminder: boolean;

    setConfig: (config: Partial<Omit<ConfigState, 'setConfig' | 'reset'>>) => void;
    reset: () => void;
}

export const useConfigStore = create<ConfigState>()(
    persist(
        (set) => ({
            hoursPerDay: 8,
            workDaysPerWeek: 5,
            startTimeHabitual: "08:00",
            endTimeHabitual: "17:00",
            notificationsEnabled: true,
            breakReminders: true,
            overtimeAlerts: true,
            exitReminder: true,

            setConfig: (config) => set((state) => ({ ...state, ...config })),
            reset: () => set({
                hoursPerDay: 8,
                workDaysPerWeek: 5,
                startTimeHabitual: "08:00",
                endTimeHabitual: "17:00",
                notificationsEnabled: true,
                breakReminders: true,
                overtimeAlerts: true,
                exitReminder: true,
            }),
        }),
        {
            name: 'timetrack-config',
        }
    )
);

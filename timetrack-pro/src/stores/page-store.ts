import { create } from 'zustand';

interface PageState {
    title: string;
    subtitle: string;
    setTitle: (title: string, subtitle?: string) => void;
}

export const usePageStore = create<PageState>((set) => ({
    title: 'TimeTrack Pro',
    subtitle: 'Gestiona tu tiempo de forma inteligente.',
    setTitle: (title, subtitle = '') => set({ title, subtitle }),
}));

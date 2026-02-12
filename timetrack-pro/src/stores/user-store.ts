import { create } from 'zustand';
import { User } from '@/types/models';
import { UserService } from '@/services/user-service';

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    updateUser: (updates: Partial<User>) => void;
    loadUser: () => Promise<void>;
    saveProfile: (updates: Partial<User>) => Promise<boolean>;
    logout: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    updateUser: (updates) =>
        set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
        })),
    loadUser: async () => {
        set({ isLoading: true });
        const user = await UserService.getCurrentUser();
        set({ user, isAuthenticated: !!user, isLoading: false });
    },
    saveProfile: async (updates: Partial<User>) => {
        const { user } = get();
        if (!user) return false;

        const updated = await UserService.updateUserProfile(user.id, updates);
        if (updated) {
            set({ user: updated });
            return true;
        }
        return false;
    },
    logout: () => set({ user: null, isAuthenticated: false }),
}));

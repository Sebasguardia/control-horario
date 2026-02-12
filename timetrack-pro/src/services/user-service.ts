import { supabase } from '@/lib/supabase/client';
import { User } from '@/types/models';

export const UserService = {
    async getCurrentUser(): Promise<User | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
        return data;
    },

    async updateUserProfile(userId: string, updates: Partial<User>): Promise<User | null> {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            console.error('Error updating profile:', error);
            return null;
        }
        return data;
    }
};

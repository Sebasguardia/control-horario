import { getSupabaseClient } from '@/lib/supabase/client';
import { User } from '@/types/models';

export const UserService = {
    async getCurrentUser(): Promise<User | null> {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            // Handle missing profile (PGRST116)
            if (error.code === 'PGRST116') {
                console.warn('Profile not found, creating new profile for user:', user.id);
                // Create minimal profile
                const { data: newProfile, error: createError } = await (supabase as any)
                    .from('profiles')
                    .insert({
                        id: user.id,
                        email: user.email!,
                        full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
                        avatar_url: user.user_metadata?.avatar_url,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    } as any)
                    .select()
                    .single();

                if (createError) {
                    console.error('Error creating user profile:', JSON.stringify(createError, null, 2));
                    return null;
                }
                return newProfile as User;
            }

            console.error('Error fetching user profile:', JSON.stringify(error, null, 2));
            return null;
        }
        return data as User;
    },

    async getUserById(userId: string): Promise<User | null> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching user profile:', JSON.stringify(error, null, 2));
            return null;
        }
        return data as User;
    },

    async updateUserProfile(userId: string, updates: Partial<User>): Promise<User | null> {
        const supabase = getSupabaseClient();
        const { data, error } = await (supabase as any)
            .from('profiles')
            .update(updates as any)
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            console.error('Error updating profile:', error);
            return null;
        }
        return data as User;
    },

    async uploadAvatar(userId: string, file: File): Promise<string | null> {
        const supabase = getSupabaseClient();
        const fileExt = file.name.split('.').pop();
        const timestamp = Date.now();
        const fileName = `${userId}/${timestamp}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading avatar:', uploadError);
            return null;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return publicUrl;
    },

    async updatePassword(newPassword: string): Promise<{ success: boolean; error?: any }> {
        const supabase = getSupabaseClient();
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            console.error('Error updating password:', error);
            return { success: false, error };
        }

        return { success: true };
    },

    async deleteAccount(): Promise<{ success: boolean; error?: any }> {
        const supabase = getSupabaseClient();

        // Llamamos a la función RPC que borra al usuario de auth.users
        const { error } = await supabase.rpc('delete_user_account');

        if (error) {
            console.error('Error deleting account:', JSON.stringify(error, null, 2));
            return { success: false, error };
        }

        // Cerramos sesión por si quedara rastro en el cliente
        await supabase.auth.signOut();

        return { success: true };
    }
};

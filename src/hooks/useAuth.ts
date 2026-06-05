import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/components/ui/Toast';
import type { RegisterFormData, LoginFormData } from '@/lib/validators';

export function useAuth() {
  const { session, profile, isLoading, signOut, fetchProfile } = useAuthStore();

  const signUp = useCallback(async (data: RegisterFormData) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          role: 'user',
          phone: data.phone,
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        throw new Error('Email sudah terdaftar');
      }
      throw error;
    }

    toast.success('Akun berhasil dibuat!', 'Selamat datang di BeLink');
  }, []);

  const signIn = useCallback(async (data: LoginFormData) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Email atau kata sandi salah');
      }
      throw error;
    }

    toast.success('Berhasil masuk!');
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
    toast.info('Berhasil keluar');
  }, [signOut]);

  const updateProfile = useCallback(
    async (updates: Record<string, any>) => {
      if (!profile) return;

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);

      if (error) throw error;

      await fetchProfile(profile.id);
      toast.success('Profil berhasil diperbarui');
    },
    [profile, fetchProfile],
  );

  return {
    session,
    profile,
    isLoading,
    isAuthenticated: !!session,
    isUser: profile?.role === 'user',
    isMitra: profile?.role === 'mitra_independen' || profile?.role === 'mitra_bengkel',
    isAdmin: profile?.role === 'superadmin',
    signUp,
    signIn,
    signOut: handleSignOut,
    updateProfile,
  };
}

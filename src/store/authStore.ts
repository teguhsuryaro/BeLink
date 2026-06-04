import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useThemeStore } from '@/store/themeStore';
import i18n from '@/lib/i18n';
import type { Profile } from '@/types/user.types';
import type { Session } from '@supabase/supabase-js';

interface AuthState {
  // State
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  profile: null,
  isLoading: true,
  isInitialized: false,

  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),

  initialize: async () => {
    try {
      set({ isLoading: true });

      // Ambil session aktif
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        set({ session });
        await get().fetchProfile(session.user.id);
      }

      // Listen untuk perubahan auth (login/logout)
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        set({ session: newSession });

        if (event === 'SIGNED_IN' && newSession?.user) {
          await get().fetchProfile(newSession.user.id);
        }

        if (event === 'SIGNED_OUT') {
          set({ profile: null, session: null });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  fetchProfile: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data.theme_preference) {
        useThemeStore.getState().setTheme(data.theme_preference as any);
      }
      if (data.language_preference) {
        i18n.changeLanguage(data.language_preference);
      }

      set({ profile: data as Profile });
    } catch (error) {
      console.error('Fetch profile error:', error);
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ session: null, profile: null });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },
}));

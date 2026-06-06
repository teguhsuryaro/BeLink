# 07 - Buat Zustand Stores

## Tujuan
Membuat state management global menggunakan Zustand untuk auth, theme, dan notifikasi.

---

## Langkah-Langkah

### 1. Buat Auth Store

**BUAT FILE**: `src/store/authStore.ts`

```typescript
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
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
```

### 2. Buat Theme Store

**BUAT FILE**: `src/store/themeStore.ts`

```typescript
import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light', // Default: terang

  setTheme: (theme) => {
    set({ theme });

    // Update class di <html> element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Simpan preferensi di localStorage
    localStorage.setItem('belink-theme', theme);
  },

  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(newTheme);
  },

  initializeTheme: () => {
    // Cek localStorage dulu
    const savedTheme = localStorage.getItem('belink-theme') as Theme | null;

    if (savedTheme) {
      get().setTheme(savedTheme);
    } else {
      // Default ke light
      get().setTheme('light');
    }
  },
}));
```

### 3. Buat Notification Store

**BUAT FILE**: `src/store/notificationStore.ts`

```typescript
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Notification } from '@/types/order.types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;

  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  addNotification: (notification: Notification) => void;
  subscribeToNotifications: (userId: string) => () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async (userId: string) => {
    try {
      set({ isLoading: true });

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const notifications = (data || []) as Notification[];
      const unreadCount = notifications.filter((n) => !n.is_read).length;

      set({ notifications, unreadCount });
    } catch (error) {
      console.error('Fetch notifications error:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  },

  markAllAsRead: async (userId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error('Mark all as read error:', error);
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  subscribeToNotifications: (userId: string) => {
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          get().addNotification(payload.new as Notification);
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
```

### 4. Buat Order Store

**BUAT FILE**: `src/store/orderStore.ts`

```typescript
import { create } from 'zustand';
import type { Order } from '@/types/order.types';

interface OrderState {
  // Order aktif saat ini (jika ada)
  activeOrder: Order | null;
  isSearching: boolean;

  // Actions
  setActiveOrder: (order: Order | null) => void;
  setIsSearching: (isSearching: boolean) => void;
  updateOrderStatus: (status: Order['status']) => void;
  clearActiveOrder: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  activeOrder: null,
  isSearching: false,

  setActiveOrder: (order) => set({ activeOrder: order }),
  setIsSearching: (isSearching) => set({ isSearching }),

  updateOrderStatus: (status) =>
    set((state) => ({
      activeOrder: state.activeOrder
        ? { ...state.activeOrder, status }
        : null,
    })),

  clearActiveOrder: () => set({ activeOrder: null, isSearching: false }),
}));
```

---

## Validasi

- [ ] File `src/store/authStore.ts` sudah ada
- [ ] File `src/store/themeStore.ts` sudah ada
- [ ] File `src/store/notificationStore.ts` sudah ada
- [ ] File `src/store/orderStore.ts` sudah ada
- [ ] Jalankan `npm run dev` — tidak ada error TypeScript

---

**Selesai? Lanjut ke `08-setup-query-client.md`**

# 01 - Auth Hooks dan Store

## Tujuan
Membuat custom hook `useAuth` yang menyederhanakan penggunaan auth di komponen.

---

## Buat File

**BUAT FILE**: `src/hooks/useAuth.ts`

```typescript
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
```

---

## Buat Hooks Tambahan

### useTheme

**BUAT FILE**: `src/hooks/useTheme.ts`

```typescript
import { useThemeStore } from '@/store/themeStore';

export function useTheme() {
  const { theme, setTheme, toggleTheme } = useThemeStore();

  return {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    setTheme,
    toggleTheme,
  };
}
```

### useLanguage

**BUAT FILE**: `src/hooks/useLanguage.ts`

```typescript
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export function useLanguage() {
  const { i18n, t } = useTranslation();

  const currentLanguage = i18n.language as 'id' | 'en';

  const setLanguage = useCallback(
    (lang: 'id' | 'en') => {
      i18n.changeLanguage(lang);
    },
    [i18n],
  );

  const toggleLanguage = useCallback(() => {
    const newLang = currentLanguage === 'id' ? 'en' : 'id';
    i18n.changeLanguage(newLang);
  }, [currentLanguage, i18n]);

  return {
    language: currentLanguage,
    isIndonesian: currentLanguage === 'id',
    isEnglish: currentLanguage === 'en',
    setLanguage,
    toggleLanguage,
    t,
  };
}
```

### useGeolocation

**BUAT FILE**: `src/hooks/useGeolocation.ts`

```typescript
import { useState, useCallback } from 'react';

interface GeolocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  isLoading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    error: null,
    isLoading: false,
  });

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation tidak didukung di browser ini',
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null,
          isLoading: false,
        });
      },
      (error) => {
        let errorMsg = 'Gagal mendeteksi lokasi';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Izin lokasi ditolak. Aktifkan GPS di pengaturan browser.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Informasi lokasi tidak tersedia';
            break;
          case error.TIMEOUT:
            errorMsg = 'Waktu deteksi lokasi habis. Coba lagi.';
            break;
        }
        setState((prev) => ({ ...prev, error: errorMsg, isLoading: false }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  }, []);

  return {
    ...state,
    getCurrentPosition,
  };
}
```

---

## Validasi

- [ ] File `src/hooks/useAuth.ts` sudah ada
- [ ] File `src/hooks/useTheme.ts` sudah ada
- [ ] File `src/hooks/useLanguage.ts` sudah ada
- [ ] File `src/hooks/useGeolocation.ts` sudah ada
- [ ] Jalankan `npm run dev` — tidak ada error

---

**Selesai? Lanjut ke `02-halaman-landing-page.md`**

# 02 - Toggle Online/Offline

## Tujuan
Implementasi toggle online/offline mitra yang mengontrol apakah mitra muncul di pencarian user.

---

## Instruksi

### Buat Hook useMitraStatus

**BUAT FILE**: `src/hooks/useMitraStatus.ts`

```typescript
import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { toast } from '@/components/ui/Toast';
import { MIN_DEPOSIT_BALANCE } from '@/lib/constants';
import type { MitraProfile } from '@/types/user.types';

export function useMitraStatus(mitraProfile: MitraProfile | null | undefined) {
  const { profile, updateProfile } = useAuth();
  const queryClient = useQueryClient();

  const toggleOnline = useMutation({
    mutationFn: async (goOnline: boolean) => {
      if (!profile) throw new Error('Not authenticated');

      // Jika ingin online, cek deposit dulu
      if (goOnline && mitraProfile) {
        if (mitraProfile.deposit_balance < MIN_DEPOSIT_BALANCE) {
          throw new Error(`Saldo deposit kurang dari minimum (Rp${MIN_DEPOSIT_BALANCE.toLocaleString('id-ID')}). Top up deposit terlebih dahulu.`);
        }
        if (mitraProfile.verification_status !== 'verified') {
          throw new Error('Akun belum diverifikasi oleh admin.');
        }
      }

      // Update is_online di profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_online: goOnline })
        .eq('id', profile.id);

      if (profileError) throw profileError;

      // Update is_accepting_orders di mitra_profiles
      const { error: mitraError } = await supabase
        .from('mitra_profiles')
        .update({ is_accepting_orders: goOnline })
        .eq('id', profile.id);

      if (mitraError) throw mitraError;
    },
    onSuccess: (_, goOnline) => {
      queryClient.invalidateQueries({ queryKey: ['mitra-profile'] });
      toast.success(goOnline ? 'Status: Online' : 'Status: Offline');
    },
    onError: (error: Error) => {
      toast.error('Gagal mengubah status', error.message);
    },
  });

  const isOnline = profile?.is_online ?? false;

  return {
    isOnline,
    toggleOnline: (goOnline: boolean) => toggleOnline.mutate(goOnline),
    isToggling: toggleOnline.isPending,
  };
}
```

### Buat Komponen Toggle Switch

**BUAT FILE**: `src/components/mitra/OnlineToggle.tsx`

```typescript
import { motion } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface OnlineToggleProps {
  isOnline: boolean;
  onToggle: (goOnline: boolean) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function OnlineToggle({ isOnline, onToggle, isLoading, disabled }: OnlineToggleProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => onToggle(!isOnline)}
        disabled={isLoading || disabled}
        className={cn(
          'relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          isOnline ? 'bg-success' : 'bg-gray-300 dark:bg-gray-600',
        )}
      >
        <motion.div
          className="h-6 w-6 rounded-full bg-white shadow-md"
          animate={{ x: isOnline ? 28 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>

      <div className="flex items-center gap-2">
        {isOnline ? (
          <Wifi className="h-4 w-4 text-success" />
        ) : (
          <WifiOff className="h-4 w-4 text-gray-400" />
        )}
        <span className={cn(
          'text-sm font-medium',
          isOnline
            ? 'text-success'
            : 'text-text-muted-light dark:text-text-muted-dark',
        )}>
          {isOnline ? t('mitra.status_online') : t('mitra.status_offline')}
        </span>
      </div>
    </div>
  );
}
```

---

## Validasi

- [ ] File `src/hooks/useMitraStatus.ts` sudah ada
- [ ] File `src/components/mitra/OnlineToggle.tsx` sudah ada
- [ ] Toggle ON: `profiles.is_online = true` + `mitra_profiles.is_accepting_orders = true`
- [ ] Toggle OFF: kedua field menjadi `false`
- [ ] Toggle ON gagal jika deposit < Rp10.000 → toast error
- [ ] Toggle ON gagal jika belum verified → toast error

---

**Selesai? Lanjut ke `03-incoming-orders.md`**

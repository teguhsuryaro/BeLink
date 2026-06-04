import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { toast } from '@/components/ui/Toast';
import { MIN_DEPOSIT_BALANCE } from '@/lib/constants';
import type { MitraProfile } from '@/types/user.types';

export function useMitraStatus(mitraProfile: MitraProfile | null | undefined) {
  const { profile } = useAuth();
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

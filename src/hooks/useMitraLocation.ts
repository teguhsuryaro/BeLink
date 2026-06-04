import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Subscribe ke lokasi real-time mitra berdasarkan mitra_id.
 * Digunakan oleh user untuk melacak posisi mitra saat status OTW.
 */
export function useMitraLocation(mitraId: string | undefined) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!mitraId) return;

    // Ambil lokasi awal
    supabase
      .from('mitra_profiles')
      .select('lat, lng')
      .eq('id', mitraId)
      .single()
      .then(({ data }) => {
        if (data?.lat && data?.lng) {
          setLocation({ lat: data.lat, lng: data.lng });
        }
      });

    // Subscribe perubahan lokasi real-time
    const channel = supabase
      .channel(`mitra-location:${mitraId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'mitra_profiles',
          filter: `id=eq.${mitraId}`,
        },
        (payload: any) => {
          const { lat, lng } = payload.new;
          if (lat && lng) {
            setLocation({ lat, lng });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mitraId]);

  return location;
}

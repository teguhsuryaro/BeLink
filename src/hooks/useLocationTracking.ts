import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Hook untuk mengirim lokasi mitra secara berkala ke database.
 * Digunakan oleh mitra saat status order `otw`.
 *
 * @param mitraId - ID mitra
 * @param isTracking - Apakah tracking aktif
 * @param intervalMs - Interval update (default: 10 detik)
 */
export function useLocationTracking(
  mitraId: string | undefined,
  isTracking: boolean,
) {
  const watchIdRef = useRef<number | null>(null);

  const updateLocation = useCallback(
    async (lat: number, lng: number) => {
      if (!mitraId) return;

      try {
        await supabase
          .from('mitra_profiles')
          .update({ lat, lng })
          .eq('id', mitraId);
      } catch (error) {
        console.error('Location update error:', error);
      }
    },
    [mitraId],
  );

  useEffect(() => {
    if (!isTracking || !mitraId || !navigator.geolocation) return;

    // Watch GPS position
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        updateLocation(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Geolocation watch error:', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
      },
    );

    // Cleanup
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isTracking, mitraId, updateLocation]);
}

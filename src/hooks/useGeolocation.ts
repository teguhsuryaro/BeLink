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

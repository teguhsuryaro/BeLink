import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { OSRM_API_URL, DEFAULT_SEARCH_RADIUS_KM } from '@/lib/constants';
import type { Order } from '@/types/order.types';
import type { SearchableMitra } from '@/types/mitra.types';

/**
 * Menghitung jarak rute berkendara antara 2 titik menggunakan OSRM (gratis).
 * Mengembalikan jarak dalam kilometer.
 */
export async function calculateRouteDistance(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
): Promise<{ distanceKm: number; durationMinutes: number }> {
  try {
    const url = `${OSRM_API_URL}/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=false`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes?.length) {
      throw new Error('Route not found');
    }

    const route = data.routes[0];
    return {
      distanceKm: Math.round((route.distance / 1000) * 100) / 100, // meter → km, 2 desimal
      durationMinutes: Math.round(route.duration / 60), // detik → menit
    };
  } catch (error) {
    console.error('OSRM error:', error);
    // Fallback: hitung jarak garis lurus (haversine)
    return {
      distanceKm: haversineDistance(fromLat, fromLng, toLat, toLng),
      durationMinutes: 0,
    };
  }
}

/**
 * Haversine formula — fallback jika OSRM gagal
 */
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // radius bumi dalam km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

/**
 * Cari mitra verified yang online dan dalam radius tertentu.
 */
export async function searchNearbyMitras(
  userLat: number,
  userLng: number,
  radiusKm: number = DEFAULT_SEARCH_RADIUS_KM,
  excludeUserId?: string,
): Promise<SearchableMitra[]> {
  // Ambil semua mitra yang verified, online, dan menerima pesanan
  const { data, error } = await supabase
    .from('mitra_profiles')
    .select(`
      id,
      business_name,
      lat,
      lng,
      average_rating,
      total_orders_completed,
      profiles!inner (
        full_name,
        avatar_url,
        is_online,
        is_banned
      )
    `)
    .eq('verification_status', 'verified')
    .eq('is_accepting_orders', true)
    .not('lat', 'is', null)
    .not('lng', 'is', null);

  if (error) throw error;
  if (!data) return [];

  // Filter: online, tidak banned, bukan diri sendiri
  const filtered = data.filter((mitra: any) => {
    const profile = mitra.profiles;
    if (!profile.is_online || profile.is_banned) return false;
    if (excludeUserId && mitra.id === excludeUserId) return false;
    return true;
  });

  // Hitung jarak dan filter berdasarkan radius
  const withDistance: SearchableMitra[] = filtered
    .map((mitra: any) => ({
      id: mitra.id,
      full_name: mitra.profiles.full_name,
      avatar_url: mitra.profiles.avatar_url,
      business_name: mitra.business_name,
      lat: mitra.lat,
      lng: mitra.lng,
      average_rating: Number(mitra.average_rating),
      total_orders_completed: mitra.total_orders_completed,
      distance_km: haversineDistance(userLat, userLng, mitra.lat, mitra.lng),
    }))
    .filter((m) => m.distance_km <= radiusKm)
    .sort((a, b) => a.distance_km - b.distance_km);

  return withDistance;
}

/**
 * Hook utama untuk operasi order.
 */
export function useOrders() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Ambil order aktif user (jika ada)
  const activeOrderQuery = useQuery({
    queryKey: ['orders', 'active', profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', profile!.id)
        .in('status', ['searching', 'negotiating', 'agreed', 'otw', 'arrived', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as Order | null;
    },
    enabled: !!profile,
    refetchInterval: 10000, // Refetch setiap 10 detik
  });

  // Ambil riwayat order user
  const historyQuery = useQuery({
    queryKey: ['orders', 'history', profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', profile!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Order[];
    },
    enabled: !!profile,
  });

  // Update status order
  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status, extras }: { orderId: string; status: string; extras?: Record<string, any> }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status, ...extras })
        .eq('id', orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  // Batalkan order
  const cancelOrder = useMutation({
    mutationFn: async ({ orderId, reason }: { orderId: string; reason?: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'cancelled_user',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: reason || 'Dibatalkan oleh pengguna',
        })
        .eq('id', orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return {
    activeOrder: activeOrderQuery.data,
    activeOrderLoading: activeOrderQuery.isLoading,
    history: historyQuery.data || [],
    historyLoading: historyQuery.isLoading,
    updateOrderStatus,
    cancelOrder,
  };
}

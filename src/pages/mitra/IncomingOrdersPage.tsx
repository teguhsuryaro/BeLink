import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Inbox, MapPin, Clock, Wrench, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { useMitraStatus } from '@/hooks/useMitraStatus';
import { formatIDR, formatRelativeTime } from '@/lib/utils';
import { DEFAULT_SEARCH_RADIUS_KM } from '@/lib/constants';
import type { MitraProfile } from '@/types/user.types';

import { PageTransition } from '@/components/layout/PageTransition';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius bumi dalam kilometer
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function IncomingOrdersPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useAuthStore();

  const { data: mitraProfile } = useQuery({
    queryKey: ['mitra-profile', profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mitra_profiles')
        .select('*')
        .eq('id', profile!.id)
        .single();
      if (error) throw error;
      return data as MitraProfile;
    },
    enabled: !!profile,
  });

  const { isOnline } = useMitraStatus(mitraProfile);

  const { data: incomingOrders, isLoading } = useQuery({
    queryKey: ['orders', 'incoming', mitraProfile?.lat, mitraProfile?.lng],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!orders_user_id_fkey (full_name, avatar_url)
        `)
        .eq('status', 'searching')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).filter((order: any) => {
        const dist = haversineDistance(
          mitraProfile!.lat!, mitraProfile!.lng!,
          order.user_lat, order.user_lng,
        );
        return dist <= DEFAULT_SEARCH_RADIUS_KM;
      }).map((order: any) => ({
        ...order,
        distance_km: haversineDistance(
          mitraProfile!.lat!, mitraProfile!.lng!,
          order.user_lat, order.user_lng,
        ),
      }));
    },
    enabled: !!mitraProfile?.lat && !!mitraProfile?.lng && isOnline,
    refetchInterval: 15000,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (!mitraProfile) {
    return (
      <PageTransition className="flex min-h-screen items-center justify-center p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </PageTransition>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-surface-light px-4 py-8 dark:bg-surface-dark pb-24 md:pb-8">
      <div className="mx-auto max-w-3xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Pesanan Masuk
            </h1>
            <p className="mt-1 text-text-muted-light dark:text-text-muted-dark">
              Daftar pesanan di sekitar Anda
            </p>
          </div>
          
          <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm dark:bg-gray-800 border border-border-light dark:border-border-dark">
            <div className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-success animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
              {isOnline ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Content */}
        {!isOnline ? (
          <Card className="py-16 text-center border border-border-light dark:border-border-dark">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Inbox className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Anda Sedang Offline
            </h3>
            <p className="text-text-muted-light dark:text-text-muted-dark max-w-sm mx-auto mb-6">
              Pastikan status kamu Online di Dashboard untuk mulai menerima pesanan dari pelanggan di sekitarmu.
            </p>
            <Button onClick={() => navigate('/mitra/dashboard')}>
              Ke Dashboard
            </Button>
          </Card>
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>
        ) : incomingOrders && incomingOrders.length > 0 ? (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
            {incomingOrders.map((order: any) => {
              const estimatedCommission = (order.travel_fee || 0) * 0.1;

              return (
                <motion.div key={order.id} variants={itemVariants}>
                  <Card className="p-0 overflow-hidden border border-border-light dark:border-border-dark transition-all hover:border-primary/50 hover:shadow-md group">
                    <div className="p-5 sm:p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {order.profiles?.avatar_url ? (
                            <img src={order.profiles.avatar_url} alt="User" className="h-12 w-12 rounded-full object-cover" />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-bold text-lg">
                                {order.profiles?.full_name?.charAt(0) || 'U'}
                              </span>
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-text-primary-light dark:text-text-primary-dark">
                              {order.profiles?.full_name || 'Pelanggan'}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-text-muted-light dark:text-text-muted-dark">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{formatRelativeTime(order.created_at, i18n.language)}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="warning" className="animate-pulse">Mencari Mitra</Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                        <div className="space-y-3">
                          <div className="flex gap-2.5 text-sm text-text-primary-light dark:text-text-primary-dark">
                            <Wrench className="h-4 w-4 shrink-0 mt-0.5 text-gray-400" />
                            <div>
                              <span className="font-semibold block">{order.vehicle_type} - {order.vehicle_brand || 'Lainnya'}</span>
                              <span className="text-text-muted-light dark:text-text-muted-dark">{order.damage_type || 'Pemeriksaan rutin'}</span>
                            </div>
                          </div>
                          <div className="flex gap-2.5 text-sm text-text-primary-light dark:text-text-primary-dark">
                            <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-gray-400" />
                            <div>
                              <span className="font-semibold block">{order.distance_km.toFixed(1)} km dari lokasi Anda</span>
                              <span className="text-text-muted-light dark:text-text-muted-dark line-clamp-1">{order.user_address || 'Alamat tidak tersedia'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex flex-col justify-center space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Ongkos Jalan:</span>
                            <span className="font-bold text-text-primary-light dark:text-text-primary-dark">
                              {order.travel_fee ? formatIDR(order.travel_fee) : '-'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Estimasi Komisi (10%):</span>
                            <span className="font-medium text-warning-dark dark:text-warning">
                              {formatIDR(estimatedCommission)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button 
                        fullWidth 
                        onClick={() => navigate(`/mitra/orders/${order.id}`)}
                        className="group-hover:bg-primary-dark transition-colors"
                      >
                        Lihat Detail Pesanan
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <Card className="py-16 text-center border border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-800/20">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm">
              <Inbox className="h-10 w-10 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Belum Ada Pesanan Masuk
            </h3>
            <p className="text-text-muted-light dark:text-text-muted-dark max-w-sm mx-auto">
              Sistem terus memantau area sekitarmu. Pesanan dari pelanggan terdekat akan muncul di sini secara otomatis.
            </p>
          </Card>
        )}

      </div>
    </PageTransition>
  );
}

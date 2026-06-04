import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Clock, XCircle, Wallet, CheckCircle2, Star, Activity, Wrench, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { formatIDR, formatRelativeTime } from '@/lib/utils';
import { DEFAULT_SEARCH_RADIUS_KM, MIN_DEPOSIT_BALANCE } from '@/lib/constants';
import type { MitraProfile } from '@/types/user.types';
import type { Order } from '@/types/order.types';
import { useMitraStatus } from '@/hooks/useMitraStatus';
import { OnlineToggle } from '@/components/mitra/OnlineToggle';

import { PageTransition } from '@/components/layout/PageTransition';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/order/StarRating';

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

export default function MitraDashboard() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useAuthStore();

  const { data: mitraProfile, isLoading: isProfileLoading } = useQuery({
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

  const { data: incomingOrders, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['orders', 'incoming', profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'searching')
        .order('created_at', { ascending: false });
      if (error) throw error;

      if (!mitraProfile?.lat || !mitraProfile?.lng) return [];
      return (data || []).filter((order: any) => {
        const dist = haversineDistance(
          mitraProfile.lat!, mitraProfile.lng!,
          order.user_lat, order.user_lng
        );
        return dist <= DEFAULT_SEARCH_RADIUS_KM;
      }) as Order[];
    },
    enabled: !!profile && !!mitraProfile && mitraProfile.verification_status === 'verified',
    refetchInterval: 15000,
  });

  const { isOnline, toggleOnline, isToggling } = useMitraStatus(mitraProfile);

  if (isProfileLoading) {
    return (
      <PageTransition className="flex min-h-screen items-center justify-center p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </PageTransition>
    );
  }

  if (!mitraProfile) {
    return (
      <PageTransition className="min-h-screen bg-surface-light p-4 dark:bg-surface-dark pb-24 md:pb-8">
        <div className="mx-auto max-w-2xl py-12 text-center">
          <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Profil Mitra Tidak Ditemukan
          </h2>
        </div>
      </PageTransition>
    );
  }

  if (mitraProfile.verification_status === 'pending') {
    return (
      <PageTransition className="min-h-screen bg-surface-light p-4 dark:bg-surface-dark flex items-center justify-center pb-24 md:pb-8">
        <Card className="max-w-md w-full p-8 text-center border-warning border shadow-lg">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-warning/10">
            <Clock className="h-10 w-10 text-warning" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Menunggu Verifikasi
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            Data pendaftaran mitra Anda sedang ditinjau oleh tim kami. Proses ini biasanya memakan waktu 1-3 hari kerja.
          </p>
        </Card>
      </PageTransition>
    );
  }

  if (mitraProfile.verification_status === 'rejected') {
    return (
      <PageTransition className="min-h-screen bg-surface-light p-4 dark:bg-surface-dark flex items-center justify-center pb-24 md:pb-8">
        <Card className="max-w-md w-full p-8 text-center border-danger border shadow-lg">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-danger/10">
            <XCircle className="h-10 w-10 text-danger" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Verifikasi Ditolak
          </h2>
          <p className="mb-6 text-text-muted-light dark:text-text-muted-dark">
            Maaf, pendaftaran mitra Anda tidak dapat kami setujui saat ini karena data tidak valid atau tidak lengkap.
          </p>
          <Button variant="danger" fullWidth>
            Hubungi Admin
          </Button>
        </Card>
      </PageTransition>
    );
  }

  const isLowDeposit = mitraProfile.deposit_balance < MIN_DEPOSIT_BALANCE;

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

  return (
    <PageTransition className="min-h-screen bg-surface-light px-4 py-8 dark:bg-surface-dark pb-24 md:pb-8">
      <div className="mx-auto max-w-4xl space-y-6">
        
        {/* Header & Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
          <div>
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Dashboard Mitra
            </h1>
            <p className="mt-1 text-text-muted-light dark:text-text-muted-dark">
              Selamat datang kembali, <span className="font-semibold text-primary">{mitraProfile.business_name}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl">
            <OnlineToggle 
              isOnline={isOnline} 
              onToggle={toggleOnline} 
              isLoading={isToggling}
            />
          </div>
        </div>

        {/* Low Deposit Warning */}
        {isLowDeposit && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-danger bg-danger/5 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-danger shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-danger-dark dark:text-danger">Saldo Deposit Rendah</h4>
                  <p className="text-sm text-danger-dark/80 dark:text-danger/80">
                    Saldo deposit Anda ({formatIDR(mitraProfile.deposit_balance)}) kurang dari batas minimum ({formatIDR(MIN_DEPOSIT_BALANCE)}). Anda mungkin tidak dapat menerima pesanan baru.
                  </p>
                </div>
              </div>
              <Button variant="danger" size="sm" className="shrink-0 whitespace-nowrap" onClick={() => navigate('/mitra/deposit')}>
                Top Up Sekarang
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <motion.div variants={itemVariants}>
            <Card className="p-4 border border-border-light dark:border-border-dark">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Saldo Deposit</p>
                <div className="rounded-md bg-primary/10 p-1.5 text-primary">
                  <Wallet className="h-4 w-4" />
                </div>
              </div>
              <h4 className={`text-lg sm:text-xl font-bold ${isLowDeposit ? 'text-danger' : 'text-text-primary-light dark:text-text-primary-dark'}`}>
                {formatIDR(mitraProfile.deposit_balance)}
              </h4>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="p-4 border border-border-light dark:border-border-dark">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Total Pesanan</p>
                <div className="rounded-md bg-success/10 p-1.5 text-success">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {mitraProfile.total_orders_completed}
              </h4>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="p-4 border border-border-light dark:border-border-dark">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Rating</p>
                <div className="rounded-md bg-warning/10 p-1.5 text-warning">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg sm:text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {mitraProfile.average_rating.toFixed(1)}
                </h4>
                <div className="hidden sm:block">
                  <StarRating value={Math.round(mitraProfile.average_rating)} size="sm" readOnly />
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="p-4 border border-border-light dark:border-border-dark">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Aktifitas</p>
                <div className="rounded-md bg-info/10 p-1.5 text-info">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {incomingOrders?.length || 0} <span className="text-sm font-normal text-text-muted-light dark:text-text-muted-dark">Masuk</span>
              </h4>
            </Card>
          </motion.div>
        </motion.div>

        {/* Incoming Orders Section */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
              Pesanan Masuk
            </h3>
            {incomingOrders && incomingOrders.length > 0 && (
              <Badge variant="danger" className="animate-pulse">
                {incomingOrders.length} Pesanan Baru
              </Badge>
            )}
          </div>

          {!isOnline ? (
            <Card className="py-12 text-center border border-border-light dark:border-border-dark">
              <MoonIcon className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
              <h4 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                Anda Sedang Offline
              </h4>
              <p className="text-text-muted-light dark:text-text-muted-dark max-w-sm mx-auto">
                Aktifkan status Online di bagian atas halaman untuk mulai menerima pesanan baru dari pelanggan.
              </p>
            </Card>
          ) : isOrdersLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
              ))}
            </div>
          ) : incomingOrders && incomingOrders.length > 0 ? (
            <div className="space-y-4">
              {incomingOrders.map((order) => {
                const distance = haversineDistance(
                  mitraProfile.lat!, mitraProfile.lng!,
                  order.user_lat, order.user_lng
                );

                return (
                  <Card key={order.id} className="p-0 overflow-hidden border border-border-light dark:border-border-dark transition-all hover:border-primary/50 hover:shadow-md">
                    <div className="p-4 sm:p-5">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="warning">Mencari Mitra</Badge>
                          <span className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                            ~{distance.toFixed(1)} km
                          </span>
                        </div>
                        <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
                          {formatRelativeTime(order.created_at, i18n.language)}
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark capitalize text-lg flex items-center gap-2">
                            {order.vehicle_type} - {order.vehicle_brand || 'Merek Lain'}
                          </h3>
                          <div className="mt-2 flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                            <Wrench className="h-4 w-4 shrink-0" />
                            <span className="line-clamp-2">{order.damage_type || 'Pemeriksaan rutin'}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800">
                          <div className="font-bold text-primary sm:text-right text-lg">
                            {order.travel_fee ? formatIDR(order.travel_fee) : '-'}
                          </div>
                          <Button size="sm" onClick={() => navigate(`/mitra/orders/${order.id}`)}>
                            Lihat Detail
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="py-12 text-center border border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-800/20">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm mb-4">
                <Activity className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                Belum Ada Pesanan
              </h4>
              <p className="text-text-muted-light dark:text-text-muted-dark max-w-sm mx-auto">
                Tetap aktifkan status Online. Pesanan yang masuk di sekitar Anda akan muncul di sini.
              </p>
            </Card>
          )}
        </div>

      </div>
    </PageTransition>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

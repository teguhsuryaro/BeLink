import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Clock, ChevronRight, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { PageTransition } from '@/components/layout/PageTransition';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/order/StarRating';
import { formatIDR, formatRelativeTime, cn } from '@/lib/utils';
import type { Order } from '@/types/order.types';

const ACTIVE_ORDER_STATUSES = ['searching', 'negotiating', 'agreed', 'otw', 'arrived', 'in_progress'];

type FilterType = 'all' | 'active' | 'completed' | 'cancelled';

export default function MitraHistoryPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const { data: history = [], isLoading: historyLoading } = useQuery({
    queryKey: ['mitra-orders', 'history', profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!orders_user_id_fkey (full_name, avatar_url),
          order_reviews (rating, comment)
        `)
        .eq('mitra_id', profile!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as (Order & { 
        profiles: { full_name: string; avatar_url: string };
        order_reviews: { rating: number; comment: string }[];
      })[];
    },
    enabled: !!profile,
  });

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'Semua' },
    { id: 'active', label: 'Aktif' },
    { id: 'completed', label: 'Selesai' },
    { id: 'cancelled', label: 'Dibatalkan' },
  ];

  const filteredOrders = useMemo(() => {
    switch (activeFilter) {
      case 'active':
        return history.filter(o => ACTIVE_ORDER_STATUSES.includes(o.status));
      case 'completed':
        return history.filter(o => o.status === 'completed');
      case 'cancelled':
        return history.filter(o => o.status === 'cancelled_user' || o.status === 'cancelled_mitra' || o.status === 'expired');
      default:
        return history;
    }
  }, [history, activeFilter]);

  const getStatusProps = (status: string): { label: string; variant: 'default' | 'success' | 'danger' | 'warning' | 'neutral' } => {
    switch (status) {
      case 'completed':
        return { label: 'Selesai', variant: 'success' };
      case 'cancelled_user':
      case 'cancelled_mitra':
      case 'expired':
        return { label: 'Dibatalkan', variant: 'danger' };
      case 'searching':
      case 'negotiating':
        return { label: 'Mencari Mitra', variant: 'warning' };
      default:
        return { label: 'Proses', variant: 'default' };
    }
  };

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
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
          Riwayat Pekerjaan
        </h1>

        {/* Filter Tabs */}
        <div className="no-scrollbar mb-6 flex overflow-x-auto space-x-2 pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                'relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
                activeFilter === filter.id
                  ? 'text-primary'
                  : 'text-text-muted-light hover:bg-gray-100 dark:text-text-muted-dark dark:hover:bg-gray-800'
              )}
            >
              {filter.label}
              {activeFilter === filter.id && (
                <motion.div
                  layoutId="activeFilterBubbleMitra"
                  className="absolute inset-0 -z-10 rounded-full bg-primary/10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Order List */}
        {historyLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-32 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>
        ) : filteredOrders.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {filteredOrders.map((order) => {
              const statusProps = getStatusProps(order.status);
              const travelFee = order.travel_fee || 0;
              const netIncome = travelFee * 0.9; // 90% income (10% commission)
              const review = order.order_reviews?.[0];
              
              return (
                <motion.div variants={itemVariants} key={order.id}>
                  <Card 
                    className="cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-lg overflow-hidden p-0 border border-border-light dark:border-border-dark"
                    onClick={() => navigate(`/mitra/orders/${order.id}`)}
                  >
                    <div className="p-4 sm:p-5">
                      <div className="mb-3 flex items-start justify-between">
                        <Badge variant={statusProps.variant}>{statusProps.label}</Badge>
                        <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
                          {formatRelativeTime(order.created_at, i18n.language)}
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark capitalize text-lg flex items-center gap-2">
                            {order.profiles?.full_name || 'Pelanggan'}
                          </h3>
                          <div className="mt-1 flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                            <Wrench className="h-4 w-4 shrink-0" />
                            <span className="truncate max-w-[200px] sm:max-w-md">
                              {order.vehicle_type} • {order.damage_type || 'Pemeriksaan rutin'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                          <div className="font-bold text-success sm:text-right">
                            {order.status === 'completed' ? formatIDR(netIncome) : formatIDR(travelFee)}
                          </div>
                          {order.status === 'completed' && review ? (
                            <div className="mt-1">
                              <StarRating value={review.rating} readOnly size="sm" />
                            </div>
                          ) : (
                            <Button variant="ghost" size="sm" className="hidden sm:flex text-primary">
                              Lihat Detail <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
              <Clock className="h-16 w-16 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
              Belum ada riwayat
            </h3>
            <p className="text-text-muted-light dark:text-text-muted-dark max-w-sm mb-8">
              Kamu belum memiliki pesanan dengan kriteria tersebut. Pastikan statusmu Online untuk menerima pesanan baru!
            </p>
            <Button onClick={() => navigate('/mitra/orders')}>
              Lihat Pesanan Masuk
            </Button>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}

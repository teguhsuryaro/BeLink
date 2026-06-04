import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Clock, ChevronRight, Wrench } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useOrders } from '@/hooks/useOrders';
import { formatIDR, formatRelativeTime, cn } from '@/lib/utils';

const ACTIVE_ORDER_STATUSES = ['searching', 'negotiating', 'agreed', 'otw', 'arrived', 'in_progress'];

type FilterType = 'all' | 'active' | 'completed' | 'cancelled';

export default function HistoryPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { history, historyLoading } = useOrders();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: t('history.filter_all', 'Semua') },
    { id: 'active', label: t('history.filter_active', 'Aktif') },
    { id: 'completed', label: t('history.filter_completed', 'Selesai') },
    { id: 'cancelled', label: t('history.filter_cancelled', 'Dibatalkan') },
  ];

  const filteredOrders = useMemo(() => {
    switch (activeFilter) {
      case 'active':
        return history.filter(o => ACTIVE_ORDER_STATUSES.includes(o.status));
      case 'completed':
        return history.filter(o => o.status === 'completed');
      case 'cancelled':
        return history.filter(o => o.status === 'cancelled_user' || o.status === 'cancelled_mitra');
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
          {t('history.title', 'Riwayat Pesanan')}
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
                  layoutId="activeFilterBubble"
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
            {/* Skeletons could be here, using generic div for now to avoid import issues */}
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
              
              return (
                <motion.div variants={itemVariants} key={order.id}>
                  <Card 
                    className="cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-lg overflow-hidden p-0 border border-border-light dark:border-border-dark"
                    onClick={() => navigate(`/order/${order.id}`)}
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
                          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark capitalize text-lg">
                            {order.vehicle_type} - {order.vehicle_brand || 'Merek Lain'}
                          </h3>
                          <div className="mt-1 flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                            <Wrench className="h-4 w-4 shrink-0" />
                            <span className="truncate max-w-[200px] sm:max-w-md">{order.damage_type || 'Pemeriksaan rutin'}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                          <div className="font-bold text-primary sm:text-right">
                            {order.travel_fee ? formatIDR(order.travel_fee) : '-'}
                          </div>
                          <Button variant="ghost" size="sm" className="hidden sm:flex text-primary">
                            Lihat Detail <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
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
              {t('history.empty_title', 'Belum ada pesanan')}
            </h3>
            <p className="text-text-muted-light dark:text-text-muted-dark max-w-sm mb-8">
              {t('history.empty_desc', 'Kamu belum memiliki pesanan dengan status tersebut. Mulai cari mekanik terdekat sekarang!')}
            </p>
            <Button onClick={() => navigate('/order')}>
              Pesan Mekanik
            </Button>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}

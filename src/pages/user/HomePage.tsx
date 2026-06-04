import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Wrench, ArrowRight, Clock, CheckCircle2, XCircle, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useOrderStore } from '@/store/orderStore';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SkeletonCard, SkeletonListItem } from '@/components/ui/Skeleton';
import { formatIDR, formatRelativeTime, getStatusColor, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { t, i18n } = useTranslation();
  const activeOrder = useOrderStore((state) => state.activeOrder);

  // Fetch recent orders
  const { data: recentOrders, isLoading: isLoadingRecent } = useQuery({
    queryKey: ['orders', 'recent', profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', profile!.id)
        .order('created_at', { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
    enabled: !!profile,
  });

  // Fetch order stats
  const { data: orderStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['orders', 'stats', profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('status')
        .eq('user_id', profile!.id);
      if (error) throw error;
      
      const total = data.length;
      const active = data.filter(o => 
        ['searching', 'negotiating', 'agreed', 'otw', 'arrived', 'in_progress'].includes(o.status)
      ).length;
      const completed = data.filter(o => o.status === 'completed').length;
      const cancelled = data.filter(o => 
        o.status === 'cancelled_user' || o.status === 'cancelled_mitra'
      ).length;
      
      return { total, active, completed, cancelled };
    },
    enabled: !!profile,
  });

  const getStatusText = (status: string) => {
    // A simplified translation lookup for status
    const statusMap: Record<string, string> = {
      searching: 'Mencari Mitra',
      negotiating: 'Negosiasi',
      agreed: 'Sepakat',
      otw: 'Mitra Menuju Lokasi',
      arrived: 'Mitra Tiba',
      in_progress: 'Proses Perbaikan',
      completed: 'Selesai',
      cancelled_user: 'Dibatalkan (Anda)',
      cancelled_mitra: 'Dibatalkan (Mitra)',
      expired: 'Kedaluwarsa',
    };
    return statusMap[status] || status;
  };

  return (
    <PageTransition className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Halo, {profile?.full_name} 👋
          </h1>
          <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
            {t('app.tagline', 'Siap membantu masalah kendaraan Anda.')}
          </p>
        </div>
        <div className="rounded-lg bg-card-light px-4 py-2 text-sm font-medium text-text-muted-light shadow-sm dark:bg-card-dark dark:text-text-muted-dark">
          {formatDate(new Date(), i18n.language)}
        </div>
      </div>

      {/* Quick Action Card */}
      <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 to-transparent dark:from-primary/5">
        <div className="absolute -right-6 -top-6 text-primary/10 dark:text-primary/5">
          <Wrench className="h-32 w-32" />
        </div>
        <div className="relative z-10 p-6 md:p-8">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-soft">
            <Wrench className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t('order.emergency_title', 'Minta Bantuan Mekanik')}
          </h2>
          <p className="mt-2 max-w-md text-text-muted-light dark:text-text-muted-dark">
            Cukup 1 klik untuk memanggil mekanik ke lokasimu. Kami akan mencarikan mitra terbaik yang terdekat dengan Anda.
          </p>
          <div className="mt-6">
            {activeOrder ? (
              <Button size="lg" onClick={() => navigate(`/order/${activeOrder.id}`)}>
                Lihat Pesanan Aktif
              </Button>
            ) : (
              <Button size="lg" onClick={() => navigate('/order')}>
                Panggil Mekanik
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Active Order Banner (If exists) */}
      {activeOrder && (
        <Card hover className="cursor-pointer border-primary/30" onClick={() => navigate(`/order/${activeOrder.id}`)}>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Package className="h-5 w-5" />
                {activeOrder.status === 'otw' && (
                  <span className="absolute right-0 top-0 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium text-text-primary-light dark:text-text-primary-dark">Pesanan Aktif: {activeOrder.vehicle_type}</p>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{formatRelativeTime(activeOrder.created_at, i18n.language)}</p>
              </div>
            </div>
            <Badge className={getStatusColor(activeOrder.status)}>
              {getStatusText(activeOrder.status)}
            </Badge>
          </div>
        </Card>
      )}

      {/* Stats Cards */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
          Statistik Pesanan
        </h3>
        {isLoadingStats ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StaggerItem>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Total</p>
                    <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                      {orderStats?.total || 0}
                    </p>
                  </div>
                </div>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Aktif</p>
                    <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                      {orderStats?.active || 0}
                    </p>
                  </div>
                </div>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Selesai</p>
                    <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                      {orderStats?.completed || 0}
                    </p>
                  </div>
                </div>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger/10 text-danger">
                    <XCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Dibatalkan</p>
                    <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                      {orderStats?.cancelled || 0}
                    </p>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          </StaggerContainer>
        )}
      </div>

      {/* Riwayat Terbaru */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
            Riwayat Terbaru
          </h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/history')} className="gap-1">
            Lihat Semua <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {isLoadingRecent ? (
          <div className="space-y-3">
            <SkeletonListItem />
            <SkeletonListItem />
            <SkeletonListItem />
          </div>
        ) : recentOrders && recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Card key={order.id} className="p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                        {order.vehicle_type === 'motor' ? 'Motor' : 'Mobil'}
                      </span>
                      <span className="text-xs text-text-muted-light dark:text-text-muted-dark">•</span>
                      <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                        {formatDate(order.created_at, i18n.language)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark line-clamp-1">
                      {order.issue_description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-2">
                    <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                      {order.agreed_price ? formatIDR(order.agreed_price) : '-'}
                    </span>
                    <Badge className={cn('whitespace-nowrap', getStatusColor(order.status))}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center p-8 text-center text-text-muted-light dark:text-text-muted-dark">
            <Package className="mb-2 h-10 w-10 opacity-20" />
            <p>Belum ada riwayat pesanan.</p>
          </Card>
        )}
      </div>
    </PageTransition>
  );
}

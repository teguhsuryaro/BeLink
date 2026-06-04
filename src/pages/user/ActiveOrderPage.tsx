import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { Loader2, XCircle, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { supabase } from '@/lib/supabase';
import { useRealtimeOrder } from '@/hooks/useRealtimeOrder';
import { useOrders } from '@/hooks/useOrders';
import { PageTransition } from '@/components/layout/PageTransition';
import { MapView, userMarkerIcon, mitraMarkerIcon } from '@/components/map/MapView';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { OrderActionButtons } from '@/components/order/OrderActionButtons';
import { OrderStatusStepper } from '@/components/order/OrderStatusStepper';
import { ReviewModal } from '@/components/order/ReviewModal';
import { useMitraLocation } from '@/hooks/useMitraLocation';
import { formatIDR, formatDistance } from '@/lib/utils';
import type { Order } from '@/types/order.types';

export default function ActiveOrderPage() {
  const { t } = useTranslation();
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { cancelOrder } = useOrders();
  const [activeTab, setActiveTab] = useState('status');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useRealtimeOrder(orderId);
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId!)
        .single();
      if (error) throw error;
      return data as Order;
    },
    enabled: !!orderId,
  });

  const { data: mitraInfo } = useQuery({
    queryKey: ['mitra', order?.mitra_id],
    queryFn: async () => {
      if (!order?.mitra_id) return null;
      const { data, error } = await supabase
        .from('mitra_profiles')
        .select(`
          id, business_name, average_rating,
          profiles (full_name, avatar_url)
        `)
        .eq('id', order.mitra_id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!order?.mitra_id,
  });

  const mitraLocation = useMitraLocation(order?.mitra_id || undefined);

  if (isLoading || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleCancel = () => {
    if (window.confirm('Yakin ingin membatalkan pencarian mekanik?')) {
      cancelOrder.mutate({ orderId: order.id }, {
        onSuccess: () => navigate('/home')
      });
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      searching: 'Mencari Mitra',
      negotiating: 'Negosiasi',
      agreed: 'Sepakat',
      otw: 'Mitra Menuju Lokasi',
      arrived: 'Mitra Tiba',
      in_progress: 'Proses Perbaikan',
      completed: 'Selesai',
      cancelled_user: 'Dibatalkan',
      cancelled_mitra: 'Dibatalkan Mitra',
    };
    return statusMap[status] || status;
  };

  const isCompleted = ['completed', 'cancelled_user', 'cancelled_mitra', 'expired'].includes(order.status);
  
  // Render Map Section
  const mapCenter: [number, number] = [order.user_lat, order.user_lng];
  const markers = [{ id: 'user', lat: order.user_lat, lng: order.user_lng, icon: userMarkerIcon }];
  
  // Use real-time mitra location if available, otherwise fallback to initial order location
  const currentMitraLat = mitraLocation?.lat || order.mitra_lat;
  const currentMitraLng = mitraLocation?.lng || order.mitra_lng;
  
  if (currentMitraLat && currentMitraLng && !isCompleted) {
    markers.push({ id: 'mitra', lat: currentMitraLat, lng: currentMitraLng, icon: mitraMarkerIcon });
  }

  return (
    <PageTransition className="flex min-h-screen flex-col overflow-hidden bg-surface-light dark:bg-surface-dark lg:flex-row">
      {/* Mobile Header (Back Button) */}
      <div className="absolute left-4 top-4 z-50 lg:hidden">
        <Button variant="secondary" size="sm" onClick={() => navigate('/home')} className="h-10 w-10 rounded-full p-0 shadow-lg">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Map Area */}
      <div className="relative h-[40vh] w-full shrink-0 lg:h-screen lg:flex-1">
        <MapView
          center={mapCenter}
          zoom={15}
          height="100%"
          className="rounded-none"
          markers={markers}
          searchRadius={
            order.status === 'searching'
              ? { center: mapCenter, radiusMeters: 500 } // pulsing effect should be done with CSS ideally
              : undefined
          }
          interactive={true}
        />
        {order.status === 'searching' && (
          <div className="absolute left-1/2 top-1/2 z-[400] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-primary bg-primary/20 animate-ping-slow"></div>
        )}
      </div>

      {/* Info Area */}
      <div className="flex h-[60vh] flex-col rounded-t-2xl bg-surface-light shadow-2xl dark:bg-surface-dark lg:h-screen lg:w-[450px] lg:rounded-none">
        {/* State: Searching */}
        {order.status === 'searching' && (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-6 relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Loader2 className="h-12 w-12 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              {t('order.searching', 'Mencari Mekanik...')}
            </h2>
            <p className="mt-2 text-text-muted-light dark:text-text-muted-dark">
              {t('order.searching_desc', 'Kami sedang mencarikan mekanik terdekat yang siap membantu Anda.')}
            </p>
            
            <div className="mt-auto w-full pt-8">
              <Button
                variant="danger"
                className="w-full"
                onClick={handleCancel}
                isLoading={cancelOrder.isPending}
                leftIcon={<XCircle className="h-5 w-5" />}
              >
                {t('order.cancel_search', 'Batalkan Pencarian')}
              </Button>
            </div>
          </div>
        )}

        {/* State: Negotiating & Active */}
        {!['searching', ...['completed', 'cancelled_user', 'cancelled_mitra', 'expired']].includes(order.status) && (
          <div className="flex h-full flex-col p-4">
            <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col">
              <Tabs.List className="relative mb-4 flex w-full border-b border-border-light dark:border-border-dark">
                {['status', 'chat'].map((tab) => (
                  <Tabs.Trigger
                    key={tab}
                    value={tab}
                    className="relative flex-1 px-4 py-3 text-center text-sm font-semibold capitalize text-text-muted-light focus:outline-none data-[state=active]:text-primary dark:text-text-muted-dark"
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 h-0.5 w-full bg-primary"
                        initial={false}
                      />
                    )}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>

              <Tabs.Content value="status" className="flex-1 overflow-y-auto outline-none">
                <div className="space-y-6">
                  {/* Status Bar */}
                  <div className="flex flex-col items-center justify-center rounded-xl bg-primary/5 p-4">
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="font-bold text-primary">{getStatusText(order.status)}</span>
                      <Badge variant="default" className="animate-pulse">Live Tracking</Badge>
                    </div>
                    <OrderStatusStepper currentStatus={order.status} />
                  </div>

                  {/* Mitra Info */}
                  {mitraInfo && (
                    <Card className="p-4">
                      <h3 className="mb-3 text-sm font-semibold text-text-muted-light dark:text-text-muted-dark">
                        Informasi Mekanik
                      </h3>
                      <div className="flex items-center gap-4">
                        <Avatar
                          src={(mitraInfo.profiles as any)?.avatar_url}
                          name={(mitraInfo.profiles as any)?.full_name || 'Mitra'}
                          size="lg"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-text-primary-light dark:text-text-primary-dark">
                            {(mitraInfo.profiles as any)?.full_name}
                          </p>
                          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                            {mitraInfo.business_name}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant="success" dot>{mitraInfo.average_rating?.toFixed(1) || '0.0'}</Badge>
                            {order.route_distance_km && (
                              <span className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark">
                                {formatDistance(order.route_distance_km)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Order Details */}
                  <Card className="p-4">
                    <h3 className="mb-3 text-sm font-semibold text-text-muted-light dark:text-text-muted-dark">
                      Detail Pesanan
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Kendaraan</span>
                        <span className="text-sm font-medium capitalize">{order.vehicle_type} - {order.vehicle_brand || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Kerusakan</span>
                        <span className="text-sm font-medium capitalize">{order.damage_type || '-'}</span>
                      </div>
                      <div className="flex justify-between border-t border-border-light pt-3 dark:border-border-dark">
                        <span className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Estimasi Biaya</span>
                        <span className="text-sm font-bold text-primary">{formatIDR(order.travel_fee || 0)}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Action Buttons */}
                  <div className="pt-4">
                    <OrderActionButtons order={order} role="user" onReview={() => setIsReviewModalOpen(true)} />
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="chat" className="flex-1 overflow-hidden outline-none p-4 h-[50vh] lg:h-[80vh]">
                <ChatWindow orderId={order.id} disabled={isCompleted} height="100%" />
              </Tabs.Content>
            </Tabs.Root>
          </div>
        )}

        {/* State: Completed or Cancelled */}
        {isCompleted && (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${order.status === 'completed' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
              {order.status === 'completed' ? (
                <CheckCircle2 className="h-10 w-10" />
              ) : (
                <XCircle className="h-10 w-10" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              {order.status === 'completed' ? 'Pesanan Selesai' : 'Pesanan Dibatalkan'}
            </h2>
            <p className="mt-2 mb-8 text-text-muted-light dark:text-text-muted-dark">
              {order.status === 'completed' ? 'Terima kasih telah menggunakan layanan BeLink.' : (order.cancellation_reason || 'Pencarian dibatalkan.')}
            </p>
            
            <Button size="lg" className="w-full" onClick={() => navigate('/home')}>
              Kembali ke Beranda
            </Button>
          </div>
        )}
      </div>

      <ReviewModal 
        open={isReviewModalOpen}
        onOpenChange={setIsReviewModalOpen}
        order={order}
      />
    </PageTransition>
  );
}

// Add this component at the top of file or use lucide icon
import { CheckCircle2 } from 'lucide-react';

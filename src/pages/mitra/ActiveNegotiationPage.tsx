import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { useRealtimeOrder } from '@/hooks/useRealtimeOrder';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { calculateRouteDistance } from '@/hooks/useOrders';
import { PageTransition } from '@/components/layout/PageTransition';
import { MapView, userMarkerIcon, mitraMarkerIcon } from '@/components/map/MapView';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { OrderActionButtons } from '@/components/order/OrderActionButtons';
import { OrderStatusStepper } from '@/components/order/OrderStatusStepper';
import { toast } from '@/components/ui/Toast';
import { formatIDR, formatDistance } from '@/lib/utils';
import type { Order } from '@/types/order.types';
import type { MitraProfile } from '@/types/user.types';

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

export default function ActiveNegotiationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('status');
  const [isAccepting, setIsAccepting] = useState(false);

  useRealtimeOrder(orderId);

  const { data: order, isLoading: isOrderLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!orders_user_id_fkey (full_name, avatar_url)
        `)
        .eq('id', orderId!)
        .single();
      if (error) throw error;
      return data as Order & { profiles: { full_name: string, avatar_url: string } };
    },
    enabled: !!orderId,
  });

  const { data: mitraProfile, isLoading: isMitraLoading } = useQuery({
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

  const isOTW = order?.status === 'otw';
  useLocationTracking(profile?.id, isOTW);

  const handleAcceptOrder = async () => {
    if (!profile || !mitraProfile || !order) return;
    
    setIsAccepting(true);
    try {
      // 1. Update order: set mitra_id dan status ke negotiating
      const { error } = await supabase
        .from('orders')
        .update({
          mitra_id: profile.id,
          mitra_lat: mitraProfile.lat,
          mitra_lng: mitraProfile.lng,
          status: 'negotiating',
        })
        .eq('id', orderId!)
        .eq('status', 'searching'); // Pastikan masih searching (race condition guard)

      if (error) throw error;

      // 2. Hitung jarak rute menggunakan OSRM
      const route = await calculateRouteDistance(
        mitraProfile.lat!, mitraProfile.lng!,
        order.user_lat, order.user_lng,
      );

      // 3. Update jarak dan total ongkos di order
      const totalFee = order.price_per_km * route.distanceKm;
      await supabase
        .from('orders')
        .update({
          route_distance_km: route.distanceKm,
          travel_fee: totalFee,
        })
        .eq('id', orderId!);

      toast.success('Pesanan diterima! Mulai negosiasi.');
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    } catch (err: any) {
      toast.error('Gagal menerima pesanan', err.message);
    } finally {
      setIsAccepting(false);
    }
  };

  const isLoading = isOrderLoading || isMitraLoading;

  if (isLoading || !order || !mitraProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      searching: 'Menunggu Keputusan Anda',
      negotiating: 'Negosiasi Harga',
      agreed: 'Sepakat & Bersiap',
      otw: 'Menuju Lokasi Pelanggan',
      arrived: 'Tiba di Lokasi',
      in_progress: 'Proses Perbaikan',
      completed: 'Selesai',
      cancelled_user: 'Dibatalkan Pelanggan',
      cancelled_mitra: 'Dibatalkan (Oleh Anda)',
    };
    return statusMap[status] || status;
  };

  const isCompleted = ['completed', 'cancelled_user', 'cancelled_mitra', 'expired'].includes(order.status);
  
  // Render Map Section
  const mapCenter: [number, number] = [order.user_lat, order.user_lng];
  const markers = [{ id: 'user', lat: order.user_lat, lng: order.user_lng, icon: userMarkerIcon }];
  
  if (mitraProfile.lat && mitraProfile.lng && !isCompleted) {
    markers.push({ id: 'mitra', lat: mitraProfile.lat, lng: mitraProfile.lng, icon: mitraMarkerIcon });
  }

  const travelFee = order.travel_fee || 0;
  const estimatedCommission = travelFee * 0.1;
  const netIncome = travelFee - estimatedCommission;

  return (
    <PageTransition className="flex min-h-screen flex-col overflow-hidden bg-surface-light dark:bg-surface-dark lg:flex-row">
      {/* Mobile Header (Back Button) */}
      <div className="absolute left-4 top-4 z-50 lg:hidden">
        <Button variant="secondary" size="sm" onClick={() => navigate('/mitra/orders')} className="h-10 w-10 rounded-full p-0 shadow-lg">
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
          interactive={true}
        />
      </div>

      {/* Info Area */}
      <div className="flex h-[60vh] flex-col rounded-t-2xl bg-surface-light shadow-2xl dark:bg-surface-dark lg:h-screen lg:w-[450px] lg:rounded-none">
        
        {/* State: Searching (Mitra hasn't accepted yet) */}
        {order.status === 'searching' && (
          <div className="flex h-full flex-col p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4 text-center">
              Panggilan Masuk
            </h2>
            
            <Card className="mb-6 p-4">
              <div className="flex items-center gap-4 mb-4">
                <Avatar
                  src={(order as any).profiles?.avatar_url}
                  name={(order as any).profiles?.full_name || 'Pelanggan'}
                  size="lg"
                />
                <div>
                  <h3 className="font-bold text-text-primary-light dark:text-text-primary-dark">
                    {(order as any).profiles?.full_name || 'Pelanggan'}
                  </h3>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                    {order.vehicle_type} - {order.vehicle_brand || 'Lainnya'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4 border-t border-border-light dark:border-border-dark pt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Kerusakan</span>
                  <span className="text-sm font-medium">{order.damage_type || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Jarak Estimasi</span>
                  <span className="text-sm font-medium">
                    {haversineDistance(mitraProfile.lat!, mitraProfile.lng!, order.user_lat, order.user_lng).toFixed(1)} km
                  </span>
                </div>
              </div>
            </Card>

            <div className="mt-auto space-y-3 pt-4">
              <Button
                size="lg"
                className="w-full text-lg"
                onClick={handleAcceptOrder}
                isLoading={isAccepting}
              >
                Terima Pesanan Ini
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full text-lg"
                onClick={() => navigate('/mitra/orders')}
                disabled={isAccepting}
              >
                Kembali
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
                        layoutId="activeTabIndicatorMitra"
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
                      {order.status === 'otw' && <Badge variant="warning" className="animate-pulse">Tracking Aktif</Badge>}
                    </div>
                    <OrderStatusStepper currentStatus={order.status} />
                  </div>

                  {/* Customer Info */}
                  <Card className="p-4">
                    <h3 className="mb-3 text-sm font-semibold text-text-muted-light dark:text-text-muted-dark">
                      Informasi Pelanggan
                    </h3>
                    <div className="flex items-center gap-4">
                      <Avatar
                        src={(order as any).profiles?.avatar_url}
                        name={(order as any).profiles?.full_name || 'User'}
                        size="lg"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-text-primary-light dark:text-text-primary-dark">
                          {(order as any).profiles?.full_name}
                        </p>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark line-clamp-1">
                          {order.user_address || 'Lokasi Peta'}
                        </p>
                        {order.route_distance_km && (
                          <div className="mt-1">
                            <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                              Jarak Rute: {formatDistance(order.route_distance_km)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Financial Details */}
                  <Card className="p-4 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="mb-3 text-sm font-semibold text-text-muted-light dark:text-text-muted-dark">
                      Rincian Biaya
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Ongkos Jalan</span>
                        <span className="text-sm font-medium">{formatIDR(travelFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-danger-dark dark:text-danger">Potongan Komisi (10%)</span>
                        <span className="text-sm font-medium text-danger-dark dark:text-danger">-{formatIDR(estimatedCommission)}</span>
                      </div>
                      <div className="flex justify-between border-t border-border-light pt-3 dark:border-border-dark">
                        <span className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">Pendapatan Bersih</span>
                        <span className="text-sm font-bold text-success">{formatIDR(netIncome)}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Action Buttons */}
                  <div className="pt-4 pb-8">
                    <OrderActionButtons order={order} role="mitra" />
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
              {order.status === 'completed' ? 'Pekerjaan Selesai!' : 'Pesanan Dibatalkan'}
            </h2>
            <p className="mt-2 mb-8 text-text-muted-light dark:text-text-muted-dark">
              {order.status === 'completed' ? 'Komisi telah dipotong dari saldo deposit Anda.' : (order.cancellation_reason || 'Pencarian dibatalkan.')}
            </p>
            
            <Button size="lg" className="w-full" onClick={() => navigate('/mitra/dashboard')}>
              Kembali ke Dashboard
            </Button>
          </div>
        )}
      </div>

    </PageTransition>
  );
}

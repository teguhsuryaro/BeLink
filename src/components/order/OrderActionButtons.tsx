import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';
import { useOrders } from '@/hooks/useOrders';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import type { Order } from '@/types/order.types';
import type { MitraProfile } from '@/types/user.types';
import { Check, X, Navigation, MapPin, Wrench, Star, Home } from 'lucide-react';

interface OrderActionButtonsProps {
  order: Order;
  role: 'user' | 'mitra';
  onReview?: () => void; // Callback untuk buka modal review
}

export function OrderActionButtons({ order, role, onReview }: OrderActionButtonsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { updateOrderStatus, cancelOrder } = useOrders();
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
    enabled: role === 'mitra' && !!profile,
  });

  const handleStatusUpdate = async (newStatus: string, extras?: Record<string, any>) => {
    // Validasi sebelum OTW
    if (newStatus === 'otw') {
      if (order.status !== 'agreed') {
        toast.error('Tidak bisa OTW: pesanan belum di-deal');
        return;
      }
    }

    // Validasi sebelum selesai
    if (newStatus === 'completed' && role === 'mitra') {
      const estimatedCommission = (order.travel_fee || 0) * 0.10;
      if (mitraProfile && mitraProfile.deposit_balance < estimatedCommission) {
        toast.error(`Saldo deposit tidak cukup untuk membayar komisi (Rp${estimatedCommission.toLocaleString('id-ID')})`);
        return;
      }
    }

    try {
      await updateOrderStatus.mutateAsync({
        orderId: order.id,
        status: newStatus,
        extras,
      });
      toast.success(`Status diperbarui ke "${t(`status.${newStatus}`, newStatus)}"`);
    } catch {
      toast.error('Gagal memperbarui status');
    }
  };

  const handleCancel = async () => {
    try {
      await cancelOrder.mutateAsync({ orderId: order.id });
      toast.info('Pesanan dibatalkan');
      navigate('/home');
    } catch {
      toast.error('Gagal membatalkan pesanan');
    }
  };

  if (role === 'user') {
    switch (order.status) {
      case 'searching':
        return (
          <Button variant="danger" className="w-full" onClick={handleCancel} leftIcon={<X className="h-4 w-4" />}>
            Batalkan Pencarian
          </Button>
        );
      case 'negotiating':
        return (
          <div className="flex gap-2 w-full">
            <Button variant="danger" className="w-1/3" onClick={handleCancel}>
              Batalkan
            </Button>
            <Button className="w-2/3" onClick={() => handleStatusUpdate('agreed')} leftIcon={<Check className="h-4 w-4" />}>
              Datang Kesini
            </Button>
          </div>
        );
      case 'otw':
        return (
          <Button variant="danger" size="sm" className="w-full" onClick={handleCancel}>
            Batalkan Pesanan
          </Button>
        );
      case 'completed':
        return (
          <div className="flex flex-col gap-2 w-full">
            <Button onClick={onReview} leftIcon={<Star className="h-4 w-4" />}>
              Beri Ulasan
            </Button>
            <Button variant="secondary" onClick={() => navigate('/home')} leftIcon={<Home className="h-4 w-4" />}>
              Kembali ke Beranda
            </Button>
          </div>
        );
      default:
        return null;
    }
  }

  // mitra role
  switch (order.status) {
    case 'searching':
      return (
        <Button className="w-full" onClick={() => handleStatusUpdate('negotiating')} leftIcon={<Check className="h-4 w-4" />}>
          Terima Pesanan
        </Button>
      );
    case 'negotiating':
      return (
        <Button className="w-full" onClick={() => handleStatusUpdate('agreed')} leftIcon={<Check className="h-4 w-4" />}>
          Datang Kesini (Deal)
        </Button>
      );
    case 'agreed':
      return (
        <Button className="w-full" onClick={() => handleStatusUpdate('otw')} leftIcon={<Navigation className="h-4 w-4" />}>
          OTW
        </Button>
      );
    case 'otw':
      return (
        <Button className="w-full" onClick={() => handleStatusUpdate('arrived')} leftIcon={<MapPin className="h-4 w-4" />}>
          Sudah Tiba
        </Button>
      );
    case 'arrived':
      return (
        <Button className="w-full" onClick={() => handleStatusUpdate('in_progress')} leftIcon={<Wrench className="h-4 w-4" />}>
          Mulai Kerjakan
        </Button>
      );
    case 'in_progress':
      return (
        <Button variant="success" className="w-full" onClick={() => handleStatusUpdate('completed')} leftIcon={<Check className="h-4 w-4" />}>
          Selesai
        </Button>
      );
    default:
      return null;
  }
}

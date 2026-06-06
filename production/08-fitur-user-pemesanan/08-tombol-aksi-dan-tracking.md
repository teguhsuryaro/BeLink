# 08 - Tombol Aksi dan Tracking

## Tujuan
Membangun tombol aksi status (Deal, OTW, Tiba, Mulai Kerja, Selesai) dan tracking lokasi mitra secara real-time di peta.

---

## Langkah-Langkah

### 1. Buat Komponen OrderActionButtons

**BUAT FILE**: `src/components/order/OrderActionButtons.tsx`

Komponen ini menampilkan tombol-tombol aksi berbeda tergantung pada:
- **Role** user yang melihat (user atau mitra)
- **Status** order saat ini

#### Untuk User:
| Status | Tombol yang Muncul |
|---|---|
| `searching` | `Batalkan Pencarian` (danger outline) |
| `negotiating` | `Datang Kesini` (primary), `Batalkan` (danger outline) |
| `agreed` | tidak ada tombol — menunggu mitra OTW |
| `otw` | `Batalkan Pesanan` (danger outline, kecil) |
| `arrived` / `in_progress` | tidak ada tombol — menunggu mitra selesai |
| `completed` | `Beri Ulasan` (primary), `Kembali ke Beranda` (secondary) |

#### Untuk Mitra (digunakan di folder 10):
| Status | Tombol yang Muncul |
|---|---|
| `searching` | `Terima Pesanan` (primary), berpindah ke negotiating |
| `negotiating` | `Datang Kesini (Deal)` (primary) → update status ke `agreed` |
| `agreed` | `OTW` (primary) → update status ke `otw` |
| `otw` | `Sudah Tiba` (primary) → update status ke `arrived` |
| `arrived` | `Mulai Kerjakan` (primary) → update status ke `in_progress` |
| `in_progress` | `Selesai` (success) → update status ke `completed` |

### Implementasi

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';
import { useOrders } from '@/hooks/useOrders';
import { useTranslation } from 'react-i18next';
import type { Order } from '@/types/order.types';
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
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleStatusUpdate = async (newStatus: string, extras?: Record<string, any>) => {
    try {
      await updateOrderStatus.mutateAsync({
        orderId: order.id,
        status: newStatus,
        extras,
      });
      toast.success(`Status diperbarui ke "${t(`status.${newStatus}`)}"`);
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
    setShowCancelModal(false);
  };

  // ... render tombol berdasarkan order.status dan role
  // Gunakan tabel di atas sebagai referensi
  // Setiap tombol: loading state (isLoading dari mutation), icon dari Lucide
}
```

### 2. Buat Komponen OrderStatusStepper

**BUAT FILE**: `src/components/order/OrderStatusStepper.tsx`

Stepper visual horizontal yang menunjukkan progress order:

```
● Deal ─── ● OTW ─── ● Tiba ─── ● Dikerjakan ─── ● Selesai
```

- Step yang sudah dilalui: ikon check (✓), warna success
- Step saat ini: warna primary, pulsing animation
- Step yang belum: warna gray, disabled
- Gunakan Framer Motion untuk animasi transisi step

### 3. Buat Hook useLocationTracking

**BUAT FILE**: `src/hooks/useLocationTracking.ts`

```typescript
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Hook untuk mengirim lokasi mitra secara berkala ke database.
 * Digunakan oleh mitra saat status order `otw`.
 *
 * @param mitraId - ID mitra
 * @param isTracking - Apakah tracking aktif
 * @param intervalMs - Interval update (default: 10 detik)
 */
export function useLocationTracking(
  mitraId: string | undefined,
  isTracking: boolean,
  intervalMs: number = 10000,
) {
  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  const updateLocation = useCallback(
    async (lat: number, lng: number) => {
      if (!mitraId) return;

      try {
        await supabase
          .from('mitra_profiles')
          .update({ lat, lng })
          .eq('id', mitraId);
      } catch (error) {
        console.error('Location update error:', error);
      }
    },
    [mitraId],
  );

  useEffect(() => {
    if (!isTracking || !mitraId || !navigator.geolocation) return;

    // Watch GPS position
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        updateLocation(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Geolocation watch error:', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
      },
    );

    // Cleanup
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTracking, mitraId, updateLocation]);
}
```

### 4. Buat Hook useMitraLocation (untuk user melihat lokasi mitra)

**BUAT FILE**: `src/hooks/useMitraLocation.ts`

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Subscribe ke lokasi real-time mitra berdasarkan mitra_id.
 * Digunakan oleh user untuk melacak posisi mitra saat status OTW.
 */
export function useMitraLocation(mitraId: string | undefined) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!mitraId) return;

    // Ambil lokasi awal
    supabase
      .from('mitra_profiles')
      .select('lat, lng')
      .eq('id', mitraId)
      .single()
      .then(({ data }) => {
        if (data?.lat && data?.lng) {
          setLocation({ lat: data.lat, lng: data.lng });
        }
      });

    // Subscribe perubahan lokasi real-time
    const channel = supabase
      .channel(`mitra-location:${mitraId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'mitra_profiles',
          filter: `id=eq.${mitraId}`,
        },
        (payload: any) => {
          const { lat, lng } = payload.new;
          if (lat && lng) {
            setLocation({ lat, lng });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mitraId]);

  return location;
}
```

---

## Validasi

- [ ] File `src/components/order/OrderActionButtons.tsx` sudah ada
- [ ] File `src/components/order/OrderStatusStepper.tsx` sudah ada
- [ ] File `src/hooks/useLocationTracking.ts` sudah ada
- [ ] File `src/hooks/useMitraLocation.ts` sudah ada
- [ ] Tombol aksi menampilkan loading state saat proses
- [ ] Status stepper berubah warna sesuai status order

---

**Selesai? Lanjut ke `09-review-dan-rating.md`**

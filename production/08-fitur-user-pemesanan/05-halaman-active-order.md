# 05 - Halaman Active Order

## Tujuan
Membangun halaman yang menampilkan status order aktif secara real-time, termasuk fase searching, negosiasi, OTW, dan penyelesaian.

---

## Instruksi

**EDIT FILE**: `src/pages/user/ActiveOrderPage.tsx`

**Ganti seluruh isi file placeholder** dengan halaman order aktif.

### Struktur Halaman

Halaman ini berubah tampilan berdasarkan status order:

#### Status: `searching`
- Peta fullscreen di belakang (50% layar) dengan marker lokasi user dan radius pencarian (lingkaran pulsing)
- Card overlay di bawah dengan:
  - Animasi searching (3 dot pulsing atau spinner)
  - Teks `order.searching` + `order.searching_desc`
  - Jumlah mitra yang ditemukan (atau "Belum ada mekanik yang merespons")
  - Tombol `order.cancel_search` (danger outline)

#### Status: `negotiating`
- Tab Switcher menggunakan Radix UI Tabs: **CHAT** | **STATUS**
  - Tab CHAT: komponen `ChatWindow` (dibuat di file 06)
  - Tab STATUS: detail order + peta mini + info mitra
- Info mitra yang merespons: avatar, nama, rating, jarak
- Tombol aksi: "Datang Kesini" (primary, besar)

#### Status: `agreed` / `otw` / `arrived` / `in_progress`
- Peta dengan posisi user (marker biru) dan mitra (marker hijau)
- Tracking live lokasi mitra (jika `otw`)
- Status bar dengan langkah-langkah: Deal → OTW → Tiba → Dikerjakan → Selesai
- Detail informasi: estimasi waktu tiba, jarak, ongkos jalan
- Chat tetap tersedia (collapse/expand)

#### Status: `completed`
- Tampilkan ringkasan order
- Tampilkan ReviewModal (dari file 09)
- Tombol "Kembali ke Beranda"

### Data Fetching & Realtime

```typescript
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import type { Order } from '@/types/order.types';

// Ambil data order by ID
const { orderId } = useParams<{ orderId: string }>();

const { data: order, refetch } = useQuery({
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

// Realtime: subscribe ke perubahan order
useEffect(() => {
  if (!orderId) return;

  const channel = supabase
    .channel(`order:${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`,
      },
      (payload) => {
        // Refetch data saat ada perubahan
        refetch();
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [orderId, refetch]);
```

### Buat Hook useRealtimeOrder

**BUAT FILE**: `src/hooks/useRealtimeOrder.ts`

```typescript
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

/**
 * Subscribe ke perubahan real-time pada order tertentu.
 * Otomatis invalidate query cache saat ada update.
 */
export function useRealtimeOrder(orderId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`order-realtime:${orderId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['order', orderId] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, queryClient]);
}
```

### Spesifikasi Desain

- Bungkus konten dengan `<PageTransition>`
- Status `searching`: gunakan animasi `ping-slow` untuk radius pencarian di peta
- Tab switcher: garis bawah bergerak smooth saat berpindah tab (Framer Motion `layoutId`)
- Status bar (Deal → OTW → ... → Selesai): horizontal stepper, step aktif = primary, done = success
- Di mobile: peta mengambil 40% layar atas, card di bawah (scrollable)
- Di desktop: peta di kiri (60%), card detail di kanan (40%)

---

## Validasi

- [ ] Buka `/order/{orderId}` — halaman aktif order muncul
- [ ] Status searching: animasi pencarian terlihat
- [ ] Perubahan status di database langsung terlihat di UI (real-time)
- [ ] Tab Chat dan Status bisa di-switch
- [ ] Peta menampilkan marker lokasi user
- [ ] Tombol "Batalkan Pencarian" berfungsi

---

**Selesai? Lanjut ke `06-real-time-chat.md`**

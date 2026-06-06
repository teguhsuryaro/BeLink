# 01 - Home Page User

## Tujuan
Membangun halaman beranda utama setelah user login. Halaman ini adalah "pusat kendali" bagi user.

---

## Instruksi

**EDIT FILE**: `src/pages/user/HomePage.tsx`

**Ganti seluruh isi file placeholder** dengan halaman beranda yang memiliki struktur berikut:

### Struktur Halaman

1. **Header Section**
   - Salam personalisasi: "Halo, {nama_user}" — ambil dari `useAuth().profile.full_name`
   - Subjudul: `app.tagline` dari i18n
   - Tampilkan tanggal hari ini dengan `formatDate(new Date(), i18n.language)`

2. **Quick Action Card** (paling menonjol, di atas)
   - Card besar dengan gradient primary soft sebagai background
   - Icon `Wrench` besar di kiri
   - Judul: `order.emergency_title` ("Minta Bantuan Mekanik")
   - Deskripsi singkat: "Cukup 1 klik untuk memanggil mekanik ke lokasimu"
   - Tombol `Button` primary size `lg`: "Panggil Mekanik" → navigasi ke `/order`
   - Jika sudah ada order aktif (cek dari `useOrderStore.activeOrder`), ganti tombol dengan "Lihat Pesanan Aktif" → navigasi ke `/order/{orderId}`

3. **Active Order Banner** (opsional — hanya muncul jika ada order aktif)
   - Card kecil dengan badge status (warna sesuai status)
   - Info ringkas: tipe kendaraan, status, waktu dibuat
   - Klik → navigasi ke `/order/{orderId}`
   - Animasi pulse ringan pada badge jika status `otw`

4. **Stats Cards** (2 kolom di mobile, 4 kolom di desktop)
   - Total Pesanan: query `orders` count WHERE `user_id = currentUser.id`
   - Pesanan Aktif: count WHERE status IN `ACTIVE_ORDER_STATUSES`
   - Selesai: count WHERE status = `completed`
   - Dibatalkan: count WHERE status IN (`cancelled_user`, `cancelled_mitra`)
   - Gunakan `SkeletonCard` saat loading

5. **Riwayat Terbaru** (3 order terakhir)
   - List order terbaru menggunakan komponen `Card` + `OrderStatusBadge` (buat inline badge dulu, akan dipecah nanti)
   - Setiap item menampilkan: status, tipe kendaraan, ongkos jalan, tanggal
   - Tombol "Lihat Semua" → navigasi ke `/history`
   - Gunakan `SkeletonListItem` saat loading

### Data Fetching

Gunakan TanStack Query untuk mengambil data:

```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Di dalam komponen:
const { data: recentOrders, isLoading } = useQuery({
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

const { data: orderStats } = useQuery({
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
```

### Import yang Dibutuhkan

```typescript
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Wrench, ArrowRight, Clock, CheckCircle2, XCircle, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useOrderStore } from '@/store/orderStore';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SkeletonCard, SkeletonListItem } from '@/components/ui/Skeleton';
import { formatIDR, formatRelativeTime, getStatusColor } from '@/lib/utils';
```

### Spesifikasi Desain

- Bungkus seluruh konten dengan `<PageTransition>`
- Stats cards menggunakan `<StaggerContainer>` + `<StaggerItem>` untuk animasi muncul bertahap
- Quick action card: background `gradient-primary-soft`, border subtle primary
- Stats cards: icon di kiri dengan warna sesuai (primary, warning, success, danger)
- Responsif: grid `grid-cols-2 lg:grid-cols-4` untuk stats
- Jarak antar section: `space-y-6`

---

## Validasi

- [ ] Buka `/home` setelah login — halaman beranda muncul
- [ ] Nama user ditampilkan di header
- [ ] Quick action card muncul dengan tombol "Panggil Mekanik"
- [ ] Stats menampilkan angka 0 (belum ada data)
- [ ] Riwayat terbaru menampilkan pesan kosong atau skeleton saat loading
- [ ] Responsif di mobile dan desktop
- [ ] Dark mode tampil dengan benar

---

**Selesai? Lanjut ke `02-integrasi-peta-leaflet.md`**

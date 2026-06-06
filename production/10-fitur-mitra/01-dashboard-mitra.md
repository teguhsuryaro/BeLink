# 01 - Dashboard Mitra

## Tujuan
Membangun halaman dashboard utama untuk mitra (`/mitra/dashboard`).

---

## Instruksi

**EDIT FILE**: `src/pages/mitra/MitraDashboard.tsx`

**Ganti seluruh isi file placeholder**.

### Struktur Halaman

1. **Verifikasi Guard**
   - Jika `verification_status === 'pending'`:
     - Tampilkan card besar: icon Clock, teks `mitra.verification_pending`, warna warning
     - Tidak ada akses ke fitur lain
   - Jika `verification_status === 'rejected'`:
     - Tampilkan card besar: icon XCircle, teks `mitra.verification_rejected`, warna danger
     - Tombol "Hubungi Admin" atau "Daftar Ulang"
   - Jika `verification_status === 'verified'`:
     - Tampilkan dashboard lengkap (langkah di bawah)

2. **Header + Toggle Online/Offline**
   - Judul: `mitra.dashboard_title`
   - Toggle switch besar: Online (hijau) / Offline (abu)
   - Teks status: "Online — Siap menerima pesanan" atau "Offline — Tidak menerima pesanan"

3. **Stats Cards** (grid 2x2 di mobile, 4 kolom di desktop)
   - Saldo Deposit: `formatIDR(mitra_profile.deposit_balance)` + badge warning jika < LOW_DEPOSIT_THRESHOLD
   - Total Pesanan: `mitra_profile.total_orders_completed`
   - Rating: `mitra_profile.average_rating` bintang + StarRating readOnly
   - Penghasilan Hari Ini: (hitung dari `deposit_transactions` hari ini)

4. **Low Deposit Warning** (jika saldo < MIN_DEPOSIT_BALANCE)
   - Alert card warna danger
   - Teks: `mitra.min_deposit_alert`
   - Tombol "Top Up" → navigasi ke `/mitra/deposit`

5. **Order Masuk** (jika ada order dengan status `searching` dalam radius)
   - List card order yang bisa diterima
   - Setiap card: info user (nama, jarak, tipe kendaraan, kerusakan, foto, ongkos jalan)
   - Tombol "Lihat Detail" → navigasi ke `/mitra/orders/{orderId}`
   - Jika tidak ada: teks `mitra.no_incoming`

6. **Pesanan Aktif** (jika mitra sedang menangani order)
   - Card order aktif: status badge, info user, progress stepper
   - Klik → navigasi ke `/mitra/orders/{orderId}`

### Data Fetching

```typescript
// Ambil data mitra profile
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
  enabled: !!profile,
});

// Ambil order searching dalam radius
const { data: incomingOrders } = useQuery({
  queryKey: ['orders', 'incoming', profile?.id],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'searching')
      .order('created_at', { ascending: false });
    if (error) throw error;

    // Filter berdasarkan jarak dari lokasi mitra
    if (!mitraProfile?.lat || !mitraProfile?.lng) return [];
    return (data || []).filter((order: any) => {
      const dist = haversineDistance(
        mitraProfile.lat!, mitraProfile.lng!,
        order.user_lat, order.user_lng
      );
      return dist <= DEFAULT_SEARCH_RADIUS_KM;
    });
  },
  enabled: !!profile && !!mitraProfile && mitraProfile.verification_status === 'verified',
  refetchInterval: 15000, // Refresh setiap 15 detik
});
```

### Spesifikasi Desain

- Bungkus konten dengan `<PageTransition>`
- Toggle online/offline: switch besar, animasi warna smooth
- Stats cards: `StaggerContainer` + `StaggerItem`
- Low deposit warning: animasi slide-down dengan Framer Motion
- Incoming orders: real-time badge "NEW" pada card baru

---

## Validasi

- [ ] Buka `/mitra/dashboard` — dashboard muncul
- [ ] Mitra pending: tampil pesan "Menunggu Verifikasi"
- [ ] Mitra verified: tampil stats, toggle, incoming orders
- [ ] Toggle online/offline berfungsi
- [ ] Low deposit warning muncul jika saldo < Rp10.000
- [ ] Incoming orders menampilkan order `searching` dalam radius

---

**Selesai? Lanjut ke `02-toggle-online-offline.md`**

# 03 - Incoming Orders (Pesanan Masuk)

## Tujuan
Membuat halaman `/mitra/orders` yang menampilkan daftar order masuk yang bisa diambil oleh mitra.

---

## Instruksi

**EDIT FILE**: `src/pages/mitra/IncomingOrdersPage.tsx`

**Ganti seluruh isi file placeholder**.

### Struktur Halaman

1. **Header**: Judul `mitra.incoming_orders`

2. **List Order Masuk**
   - Setiap order ditampilkan dalam Card dengan layout:
     - **Foto kerusakan**: thumbnail rounded di kiri (jika ada)
     - **Info user**: nama user, tipe kendaraan, jenis kerusakan
     - **Jarak**: jarak dari lokasi mitra ke user (`formatDistance`)
     - **Ongkos jalan**: `formatIDR(order.travel_fee)` + `formatIDR(order.price_per_km)/km`
     - **Estimasi komisi**: 10% dari ongkos × jarak
     - **Waktu**: `formatRelativeTime(order.created_at)`
     - **Tombol**: "Lihat Detail" → navigasi ke `/mitra/orders/{orderId}`
   - Gunakan `StaggerContainer` + `StaggerItem`
   - Real-time: subscribe ke tabel `orders` untuk update otomatis

3. **Empty State**
   - Icon Inbox besar, opacity rendah
   - Teks: `mitra.no_incoming`
   - Subtitle: "Pastikan status kamu Online untuk menerima pesanan"

4. **Auto-Refresh**
   - Query `refetchInterval: 15000` (setiap 15 detik)
   - Indicator "Live" dot pulsing di header

### Data Fetching

Menggunakan `searchNearbyMitras`-like logic tapi dari sisi mitra — ambil order `searching` dalam radius:

```typescript
const { data: incomingOrders, isLoading } = useQuery({
  queryKey: ['orders', 'incoming', mitraProfile?.lat, mitraProfile?.lng],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles!orders_user_id_fkey (full_name, avatar_url)
      `)
      .eq('status', 'searching')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Filter berdasarkan jarak
    return (data || []).filter(order => {
      const dist = haversineDistance(
        mitraProfile!.lat!, mitraProfile!.lng!,
        order.user_lat, order.user_lng,
      );
      return dist <= DEFAULT_SEARCH_RADIUS_KM;
    }).map(order => ({
      ...order,
      distance_km: haversineDistance(
        mitraProfile!.lat!, mitraProfile!.lng!,
        order.user_lat, order.user_lng,
      ),
    }));
  },
  enabled: !!mitraProfile?.lat && !!mitraProfile?.lng,
  refetchInterval: 15000,
});
```

---

## Validasi

- [ ] Buka `/mitra/orders` — halaman pesanan masuk muncul
- [ ] Order dengan status `searching` dalam radius tampil sebagai card
- [ ] Setiap card menampilkan jarak, ongkos, waktu
- [ ] Klik "Lihat Detail" → navigasi ke halaman negosiasi
- [ ] Empty state muncul jika tidak ada order

---

**Selesai? Lanjut ke `04-active-negotiation-mitra.md`**

# 04 - Active Negotiation (Halaman Detail Order Mitra)

## Tujuan
Membuat halaman `/mitra/orders/{orderId}` — halaman detail order dari perspektif mitra.

---

## Instruksi

**EDIT FILE**: `src/pages/mitra/ActiveNegotiationPage.tsx`

**Ganti seluruh isi file placeholder**.

### Struktur Halaman

Halaman ini menampilkan detail order dan menjadi tempat mitra berinteraksi dengan user. Layout mirip `ActiveOrderPage.tsx` tapi dengan kontrol mitra.

1. **Header**
   - Tombol back → `/mitra/orders`
   - Badge status order

2. **Peta** (atas)
   - Marker user (biru) di lokasi user
   - Marker mitra (hijau) di lokasi mitra saat ini
   - Garis rute dari OSRM (opsional — bisa ditambah nanti)
   - Saat status `otw`: aktifkan `useLocationTracking` untuk update lokasi mitra berkala

3. **Detail Order Card**
   - Informasi user: nama, avatar
   - Kendaraan: tipe + merek
   - Kerusakan: jenis + deskripsi + foto
   - Jarak: jarak rute (dari OSRM) atau garis lurus (haversine)
   - Ongkos jalan: `formatIDR(order.travel_fee)`
   - Estimasi komisi: 10% × ongkos jalan
   - Estimasi pendapatan bersih: ongkos jalan - komisi

4. **Tab Chat/Status**
   - Tab CHAT: `ChatWindow` component
   - Tab STATUS: `OrderStatusStepper` + detail info + tombol aksi

5. **Tombol Aksi** (dari `OrderActionButtons` dengan `role="mitra"`)
   - Mitra bisa: Accept → Deal → OTW → Tiba → Mulai → Selesai
   - Setiap perubahan status update database + real-time terkirim ke user

### Logika Khusus Mitra

```typescript
// Saat mitra klik "Terima Pesanan" (accept)
const handleAcceptOrder = async () => {
  try {
    // 1. Update order: set mitra_id dan status ke negotiating
    const { error } = await supabase
      .from('orders')
      .update({
        mitra_id: profile!.id,
        mitra_lat: mitraProfile!.lat,
        mitra_lng: mitraProfile!.lng,
        status: 'negotiating',
      })
      .eq('id', orderId)
      .eq('status', 'searching'); // Pastikan masih searching (race condition)

    if (error) throw error;

    // 2. Hitung jarak rute menggunakan OSRM
    const route = await calculateRouteDistance(
      mitraProfile!.lat!, mitraProfile!.lng!,
      order!.user_lat, order!.user_lng,
    );

    // 3. Update jarak dan total ongkos di order
    const totalFee = order!.price_per_km * route.distanceKm;
    await supabase
      .from('orders')
      .update({
        route_distance_km: route.distanceKm,
        travel_fee: totalFee,
      })
      .eq('id', orderId);

    toast.success('Pesanan diterima! Mulai negosiasi.');
  } catch (err: any) {
    toast.error('Gagal menerima pesanan', err.message);
  }
};

// Saat mitra klik "OTW" → aktifkan location tracking
const isOTW = order?.status === 'otw';
useLocationTracking(profile?.id, isOTW, 10000);
```

### Spesifikasi Desain

- Di mobile: peta 40% atas, card detail scroll di bawah
- Di desktop: 2 kolom — peta kiri, detail kanan
- Bungkus konten dengan `<PageTransition>`
- Real-time update menggunakan `useRealtimeOrder`

---

## Validasi

- [ ] Buka `/mitra/orders/{orderId}` — detail order muncul
- [ ] Peta menampilkan lokasi user dan mitra
- [ ] "Terima Pesanan" → status berubah ke `negotiating`, jarak terhitung
- [ ] Chat berfungsi 2 arah (test dengan 2 browser/tab)
- [ ] "OTW" → lokasi mitra ter-track di peta user
- [ ] "Selesai" → status `completed`, komisi terpotong, deposit berkurang

---

**Selesai? Lanjut ke `05-logika-otw-selesai-komisi.md`**

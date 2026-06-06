# 10 - Halaman Riwayat Order

## Tujuan
Membuat halaman `/history` yang menampilkan semua order user dengan filter dan detail.

---

## Instruksi

**EDIT FILE**: `src/pages/user/HistoryPage.tsx`

**Ganti seluruh isi file placeholder**.

### Struktur Halaman

1. **Header**: Judul `history.title` ("Riwayat Pesanan")

2. **Filter Tabs** (horizontal scrollable di mobile):
   - Semua (`history.filter_all`)
   - Aktif (`history.filter_active`)
   - Selesai (`history.filter_completed`)
   - Dibatalkan (`history.filter_cancelled`)
   - Tab aktif: warna primary, underline animasi (`layoutId`)

3. **Order List**:
   - Setiap item dalam `Card` dengan layout:
     - **Kiri**: Badge status (warna dari `getStatusColor`)
     - **Tengah**: Tipe kendaraan + merek, deskripsi kerusakan (truncated), tanggal (`formatRelativeTime`)
     - **Kanan**: Ongkos jalan (`formatIDR`)
     - **Bawah**: Tombol "Lihat Detail" → navigasi ke `/order/{orderId}`
   - Gunakan `StaggerContainer` + `StaggerItem` untuk animasi muncul
   - Skeleton saat loading: `SkeletonListItem` x 5

4. **Empty State** (jika tidak ada order):
   - Icon `Clock` besar, opacity rendah
   - Teks `history.empty`
   - Tombol "Pesan Mekanik" → navigasi ke `/order`

### Data Fetching

```typescript
const { history, historyLoading } = useOrders();

// Filter berdasarkan tab aktif
const filteredOrders = useMemo(() => {
  switch (activeFilter) {
    case 'active':
      return history.filter(o => ACTIVE_ORDER_STATUSES.includes(o.status as any));
    case 'completed':
      return history.filter(o => o.status === 'completed');
    case 'cancelled':
      return history.filter(o => o.status === 'cancelled_user' || o.status === 'cancelled_mitra');
    default:
      return history;
  }
}, [history, activeFilter]);
```

### Spesifikasi Desain

- Max width `max-w-3xl mx-auto`
- Filter tabs: horizontal scroll di mobile, inline di desktop
- Card order: hover lift, rounded-xl
- Badge status: menggunakan komponen `Badge` dengan variant sesuai
- Bungkus konten dengan `<PageTransition>`

---

## Validasi

- [ ] Buka `/history` — halaman riwayat muncul
- [ ] Filter tabs berfungsi: klik "Selesai" hanya menampilkan order completed
- [ ] Setiap card order menampilkan status, kendaraan, harga, tanggal
- [ ] Klik "Lihat Detail" → navigasi ke `/order/{orderId}`
- [ ] Empty state muncul jika tidak ada order

---

**Selesai? Lanjut ke folder `09-fitur-user-profil/` → file `01-halaman-profil-user.md`**

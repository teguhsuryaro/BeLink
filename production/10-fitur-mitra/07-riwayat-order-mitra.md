# 07 - Riwayat Order Mitra

## Tujuan
Membuat halaman `/mitra/history` — riwayat semua order yang pernah ditangani mitra.

---

## Instruksi

**EDIT FILE**: `src/pages/mitra/MitraHistoryPage.tsx`

**Ganti seluruh isi file placeholder**.

### Struktur & Logika

Halaman ini sangat mirip dengan `HistoryPage.tsx` (user), tapi:
- Query filter: `mitra_id = profile.id` (bukan `user_id`)
- Menampilkan nama user (bukan nama mitra)
- Menampilkan pendapatan per order (ongkos - komisi)
- Menampilkan rating yang diterima per order (jika ada)

### Data Fetching

```typescript
const { data: mitraHistory, isLoading } = useQuery({
  queryKey: ['mitra-orders', 'history', profile?.id],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles!orders_user_id_fkey (full_name, avatar_url),
        order_reviews (rating, comment)
      `)
      .eq('mitra_id', profile!.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  enabled: !!profile,
});
```

### Tampilan Card Order Mitra

Setiap card menampilkan:
- Avatar + nama user
- Tipe kendaraan + kerusakan
- Status badge
- Pendapatan bersih: `ongkos_jalan - (ongkos_jalan × 10%)`
- Rating diterima (jika completed dan ada review): StarRating readOnly

### Filter Tabs: Semua | Selesai | Dibatalkan

---

## Validasi

- [ ] Buka `/mitra/history` — riwayat order mitra muncul
- [ ] Order ditampilkan dari perspektif mitra (nama user, pendapatan)
- [ ] Filter berfungsi
- [ ] Rating ditampilkan untuk order yang sudah diulas

---

**Selesai? Lanjut ke folder `11-fitur-superadmin/` → file `01-dashboard-admin.md`**

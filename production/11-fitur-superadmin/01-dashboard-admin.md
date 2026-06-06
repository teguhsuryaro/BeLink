# 01 - Dashboard Admin

## Tujuan
Membuat halaman `/admin/dashboard` — pusat kendali superadmin.

---

## Instruksi

**EDIT FILE**: `src/pages/admin/AdminDashboard.tsx`

**Ganti seluruh isi file placeholder**.

### Struktur Halaman

1. **Header**: Judul `admin.dashboard_title`

2. **Stats Overview** (grid 2x2 di mobile, 3x2 di desktop)
   - Total Pengguna: COUNT dari `profiles`
   - Total Mitra: COUNT dari `profiles` WHERE role IN (`mitra_independen`, `mitra_bengkel`)
   - Total Pesanan: COUNT dari `orders`
   - Total Revenue Komisi: SUM `platform_commission` dari `orders` WHERE status = `completed`
   - Menunggu Verifikasi: COUNT dari `mitra_profiles` WHERE `verification_status = 'pending'`
   - Laporan Terbuka: COUNT dari `reports` WHERE `status = 'open'`
   - Setiap stat: icon + angka besar + label kecil
   - Gunakan warna berbeda per card (primary, success, warning, danger, dll)

3. **Quick Links** (card grid)
   - "Verifikasi Mitra" — badge jumlah pending → `/admin/verification`
   - "Kelola Pengguna" → `/admin/users`
   - "Laporan" — badge jumlah open → `/admin/reports`
   - "Statistik" → `/admin/statistics`

### Data Fetching

```typescript
const { data: stats } = useQuery({
  queryKey: ['admin', 'stats'],
  queryFn: async () => {
    // Total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Total mitra
    const { count: totalMitra } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .in('role', ['mitra_independen', 'mitra_bengkel']);

    // Total orders
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    // Total revenue
    const { data: revenueData } = await supabase
      .from('orders')
      .select('platform_commission')
      .eq('status', 'completed')
      .not('platform_commission', 'is', null);
    const totalRevenue = (revenueData || []).reduce(
      (sum, o) => sum + Number(o.platform_commission), 0
    );

    // Pending verifications
    const { count: pendingVerification } = await supabase
      .from('mitra_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('verification_status', 'pending');

    // Open reports
    const { count: openReports } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'open');

    return {
      totalUsers: totalUsers || 0,
      totalMitra: totalMitra || 0,
      totalOrders: totalOrders || 0,
      totalRevenue,
      pendingVerification: pendingVerification || 0,
      openReports: openReports || 0,
    };
  },
});
```

### Spesifikasi Desain

- Stats: `StaggerContainer` + `StaggerItem` untuk animasi
- Card stat: icon besar di kiri, angka bold di kanan
- Quick links: hover lift, icon + label + chevron right
- Bungkus konten dengan `<PageTransition>`

---

## Validasi

- [ ] Buka `/admin/dashboard` — 6 stat cards muncul dengan data real
- [ ] Quick links navigasi berfungsi
- [ ] Badge jumlah pending dan open muncul

---

**Selesai? Lanjut ke `02-manajemen-user.md`**

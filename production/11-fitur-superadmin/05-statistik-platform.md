# 05 - Statistik Platform

## Tujuan
Membuat halaman `/admin/statistics` dengan visualisasi data platform.

---

## Instruksi

**EDIT FILE**: `src/pages/admin/StatisticsPage.tsx`

**Ganti seluruh isi file placeholder**.

### Struktur Halaman

Karena kita tidak menggunakan library chart (untuk menjaga bundle kecil), kita akan membuat statistik sederhana dengan progress bars dan angka:

1. **Header**: Judul `admin.statistics` + range waktu (Bulan ini / Semua waktu)

2. **Revenue Overview Card**
   - Total revenue komisi semua waktu: `formatIDR(total)`
   - Revenue bulan ini: `formatIDR(thisMonth)`
   - Revenue bulan lalu: `formatIDR(lastMonth)` + persentase naik/turun
   - Simple bar chart: 12 bulan terakhir menggunakan div bars (Tailwind height)

3. **Order Statistics Card**
   - Total orders
   - Breakdown by status: progress bar horizontal per status
     - Completed: bar hijau → (completed / total × 100)%
     - Cancelled: bar merah → (cancelled / total × 100)%
     - Active: bar biru → (active / total × 100)%
   - Rata-rata order per hari bulan ini

4. **User Growth Card**
   - Total user terdaftar
   - User baru bulan ini
   - Mitra terdaftar (verified vs pending vs rejected)
   - Simple breakdown bars

5. **Top Mitra** (5 mitra terbaik)
   - Tabel: Rank, Avatar, Nama, Rating, Total Orders, Pendapatan
   - Sort by total_orders_completed DESC

### Data Fetching

```typescript
// Revenue per bulan
const getMonthlyRevenue = async () => {
  const { data } = await supabase
    .from('orders')
    .select('platform_commission, completed_at')
    .eq('status', 'completed')
    .not('platform_commission', 'is', null);

  // Group by month
  const monthly: Record<string, number> = {};
  (data || []).forEach((order: any) => {
    if (!order.completed_at) return;
    const month = order.completed_at.substring(0, 7); // "2024-01"
    monthly[month] = (monthly[month] || 0) + Number(order.platform_commission);
  });

  return monthly;
};

// Top mitra
const { data: topMitras } = useQuery({
  queryKey: ['admin', 'top-mitra'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('mitra_profiles')
      .select(`
        *,
        profiles!inner (full_name, avatar_url)
      `)
      .eq('verification_status', 'verified')
      .order('total_orders_completed', { ascending: false })
      .limit(5);

    if (error) throw error;
    return data;
  },
});
```

### Simple Bar Chart Component

Buat bar chart sederhana (tanpa library):

```typescript
function SimpleBarChart({ data }: { data: { label: string; value: number; max: number }[] }) {
  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-12 text-xs text-text-muted-light dark:text-text-muted-dark">
            {item.label}
          </span>
          <div className="flex-1 h-6 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / item.max) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <span className="w-20 text-right text-xs font-medium">
            {formatIDR(item.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
```

### Spesifikasi Desain

- Grid layout: 2 kolom di desktop, 1 kolom di mobile
- Cards: shadow, rounded-xl, padding lg
- Bar chart: animasi masuk dari kiri
- Top mitra: tabel compact, zebra striping
- Bungkus konten dengan `<PageTransition>`

---

## Validasi

- [ ] Buka `/admin/statistics` — statistik muncul dengan data real
- [ ] Revenue overview menampilkan angka yang benar
- [ ] Order breakdown bars memiliki proporsi yang benar
- [ ] Top mitra menampilkan 5 mitra terbaik
- [ ] Animasi bar chart muncul saat halaman load

---

**Selesai? Lanjut ke folder `12-data-dummy/` → file `01-seed-akun-test.md`**

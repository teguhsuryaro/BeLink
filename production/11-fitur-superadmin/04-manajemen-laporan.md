# 04 - Manajemen Laporan

## Tujuan
Membuat halaman `/admin/reports` untuk melihat dan mengelola laporan pelanggaran antar user.

---

## Instruksi

**EDIT FILE**: `src/pages/admin/ReportsPage.tsx`

**Ganti seluruh isi file placeholder**.

### Struktur Halaman

1. **Header**: Judul `admin.reports_management`

2. **Filter Tabs**: Terbuka (open) | Ditinjau (reviewed) | Diselesaikan (resolved) | Diabaikan (dismissed)

3. **Report Cards**
   - Setiap card menampilkan:
     - **Pelapor**: avatar + nama (dari `reporter_id`)
     - **Dilaporkan**: avatar + nama (dari `reported_id`)
     - **Alasan**: teks lengkap `reason`
     - **Order terkait** (jika ada): link ke order detail
     - **Tanggal**: `formatDate(created_at)`
     - **Status badge**
   - Tombol aksi (untuk status `open` atau `reviewed`):
     - "Tinjau" → update status ke `reviewed`
     - "Selesaikan" → modal: admin input notes → update status ke `resolved`
     - "Abaikan" → modal konfirmasi → update status ke `dismissed`
     - "Ban Pengguna" → ban `reported_id` → update status ke `resolved`

### Data Fetching

```typescript
const { data: reports } = useQuery({
  queryKey: ['admin', 'reports', activeTab],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        reporter:profiles!reports_reporter_id_fkey (full_name, avatar_url, email),
        reported:profiles!reports_reported_id_fkey (full_name, avatar_url, email, is_banned)
      `)
      .eq('status', activeTab)
      .order('created_at', { ascending: true }); // Oldest first

    if (error) throw error;
    return data;
  },
});
```

### Resolve Logic

```typescript
const handleResolve = async (reportId: string, adminNotes: string) => {
  const { error } = await supabase
    .from('reports')
    .update({ status: 'resolved', admin_notes: adminNotes })
    .eq('id', reportId);

  if (error) throw error;
  queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
  toast.success('Laporan diselesaikan');
};
```

### Spesifikasi Desain

- Card: border-left accent color berdasarkan status (open=danger, reviewed=warning, resolved=success)
- Pelapor dan dilaporkan ditampilkan side-by-side
- Bungkus konten dengan `<PageTransition>`

---

## Validasi

- [ ] Buka `/admin/reports` — list laporan muncul
- [ ] Filter tabs berfungsi
- [ ] "Tinjau" → status berubah ke reviewed
- [ ] "Selesaikan" → modal notes → status berubah ke resolved
- [ ] "Ban Pengguna" → user dilaporkan di-ban

---

**Selesai? Lanjut ke `05-statistik-platform.md`**

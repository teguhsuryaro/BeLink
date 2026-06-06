# 03 - Verifikasi Mitra

## Tujuan
Membuat halaman `/admin/verification` untuk mereview dan approve/reject pendaftaran mitra.

---

## Instruksi

**EDIT FILE**: `src/pages/admin/MitraVerificationPage.tsx`

**Ganti seluruh isi file placeholder**.

### Struktur Halaman

1. **Header**: Judul `admin.mitra_verification`

2. **Filter Tabs**: Menunggu (pending) | Disetujui (verified) | Ditolak (rejected)

3. **Verification Cards**
   - Setiap card menampilkan:
     - **Data Pendaftar**: nama, email, nama bengkel, bio, alamat
     - **Dokumen**: thumbnail KTP, Selfie, Foto Bengkel (klikable → buka di modal besar)
     - **Lokasi**: peta mini (MapView height 150px) dengan marker lokasi bengkel
     - **Tanggal Daftar**: `formatDate(created_at)`
   - Tombol aksi (hanya untuk status `pending`):
     - "Setujui" (success) → update `verification_status = 'verified'`
     - "Tolak" (danger) → modal konfirmasi → update `verification_status = 'rejected'`

### Document Preview Modal

Saat klik foto KTP/Selfie/Bengkel, buka Modal full-size:

```typescript
const [previewImage, setPreviewImage] = useState<string | null>(null);

// Modal
<Modal open={!!previewImage} onOpenChange={() => setPreviewImage(null)} size="xl">
  <img
    src={previewImage || ''}
    alt="Document preview"
    className="w-full rounded-lg object-contain max-h-[70vh]"
  />
</Modal>
```

### Data Fetching

```typescript
const { data: mitraApplications } = useQuery({
  queryKey: ['admin', 'mitra-verification', activeTab],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('mitra_profiles')
      .select(`
        *,
        profiles!inner (full_name, email, avatar_url, phone)
      `)
      .eq('verification_status', activeTab)
      .order('created_at', { ascending: activeTab === 'pending' }); // Pending: oldest first

    if (error) throw error;
    return data;
  },
});
```

### Approve/Reject Logic

```typescript
const handleApprove = async (mitraId: string) => {
  const { error } = await supabase
    .from('mitra_profiles')
    .update({ verification_status: 'verified' })
    .eq('id', mitraId);

  if (error) throw error;

  // Kirim notifikasi ke mitra
  await supabase.from('notifications').insert({
    user_id: mitraId,
    title: 'Pendaftaran Disetujui',
    body: 'Selamat! Pendaftaran mitra Anda telah disetujui. Anda sekarang bisa mulai menerima pesanan.',
    type: 'system',
  });

  queryClient.invalidateQueries({ queryKey: ['admin', 'mitra-verification'] });
  toast.success('Mitra berhasil diverifikasi');
};

const handleReject = async (mitraId: string) => {
  const { error } = await supabase
    .from('mitra_profiles')
    .update({ verification_status: 'rejected' })
    .eq('id', mitraId);

  if (error) throw error;

  // Kirim notifikasi ke mitra
  await supabase.from('notifications').insert({
    user_id: mitraId,
    title: 'Pendaftaran Ditolak',
    body: 'Mohon maaf, pendaftaran mitra Anda ditolak. Silakan hubungi admin untuk informasi lebih lanjut.',
    type: 'system',
  });

  queryClient.invalidateQueries({ queryKey: ['admin', 'mitra-verification'] });
  toast.info('Pendaftaran mitra ditolak');
};
```

### Spesifikasi Desain

- Card: full-width, padding `lg`, space untuk dokumen
- Dokumen thumbnails: grid 3 kolom, ratio 1:1, rounded, hover scale, klik = preview
- Peta mini: height 150px, non-interactive (interactive=false), marker lokasi bengkel
- Bungkus konten dengan `<PageTransition>`

---

## Validasi

- [ ] Buka `/admin/verification` — list mitra pending muncul
- [ ] Klik foto KTP → modal preview muncul (gambar besar)
- [ ] "Setujui" → status berubah ke verified, notifikasi dikirim
- [ ] "Tolak" → konfirmasi → status berubah ke rejected, notifikasi dikirim
- [ ] Tab filter berfungsi

---

**Selesai? Lanjut ke `04-manajemen-laporan.md`**

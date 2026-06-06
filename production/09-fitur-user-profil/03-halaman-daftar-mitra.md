# 03 - Halaman Daftar Menjadi Mitra

## Tujuan
Membuat halaman `/register-mitra` untuk user biasa yang ingin mendaftar sebagai mitra.

---

## Instruksi

**EDIT FILE**: `src/pages/user/RegisterMitraPage.tsx`

**Ganti seluruh isi file placeholder**.

### Struktur Halaman

1. **Header**
   - Icon Wrench besar
   - Judul: `mitra.register_title` ("Daftar Menjadi Mitra")
   - Subjudul: `mitra.register_subtitle`

2. **Form** (React Hook Form + Zod `mitraRegistrationSchema`)
   - Input `business_name`: Nama Bengkel / Usaha — required
   - Textarea `bio`: Bio Singkat — opsional, max 500 char
   - **Lokasi Bengkel**: komponen `LocationPicker` + input `address` (alamat teks)
   - **Upload KTP**: `<input type="file">` + preview → upload ke bucket `documents`
   - **Upload Foto Diri/Selfie**: `<input type="file">` + preview → upload ke bucket `documents`
   - **Upload Foto Bengkel**: opsional → upload ke bucket `documents`
   - Tombol submit: `mitra.submit_registration` — primary, full width, size `lg`

3. **Syarat dan Ketentuan** (disclaimer)
   - Teks kecil di atas tombol submit:
     - "Dengan mendaftar, Anda menyetujui bahwa data yang diberikan valid"
     - "Proses verifikasi memakan waktu 1-3 hari kerja"
     - "Deposit minimum Rp10.000 diperlukan untuk mulai menerima pesanan"

### Logika Submit

```typescript
const onSubmit = async (data: MitraRegistrationFormData) => {
  setIsSubmitting(true);
  try {
    // 1. Upload KTP
    const ktpUrl = await uploadFile('documents', ktpFile!);
    // 2. Upload Selfie
    const selfieUrl = await uploadFile('documents', selfieFile!);
    // 3. Upload Foto Bengkel (opsional)
    let workshopUrl = null;
    if (workshopFile) {
      workshopUrl = await uploadFile('documents', workshopFile);
    }

    // 4. Insert ke mitra_profiles
    const { error: mitraError } = await supabase.from('mitra_profiles').insert({
      id: profile!.id,
      business_name: data.business_name,
      bio: data.bio || null,
      address: data.address,
      lat: data.lat,
      lng: data.lng,
      ktp_url: ktpUrl,
      selfie_url: selfieUrl,
      workshop_photo_url: workshopUrl,
      verification_status: 'pending',
    });

    if (mitraError) throw mitraError;

    // 5. Update role user menjadi mitra_independen
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'mitra_independen' })
      .eq('id', profile!.id);

    if (profileError) throw profileError;

    // 6. Refresh profil
    await fetchProfile(profile!.id);

    toast.success('Pendaftaran berhasil!', 'Menunggu verifikasi dari admin.');
    navigate('/mitra/dashboard');
  } catch (err: any) {
    toast.error('Gagal mendaftar mitra', err.message);
  } finally {
    setIsSubmitting(false);
  }
};
```

### Spesifikasi Desain

- Max width `max-w-lg mx-auto`
- Form fields spacing: `space-y-5`
- File upload area: dashed border, klik untuk browse, preview gambar di bawah
- Bungkus konten dengan `<PageTransition>`

---

## Validasi

- [ ] Buka `/register-mitra` — form muncul
- [ ] Wajib isi: business_name, address, lokasi (peta), KTP, selfie
- [ ] Submit → data masuk ke `mitra_profiles` dengan status `pending`
- [ ] Role user berubah dari `user` ke `mitra_independen`
- [ ] Redirect ke `/mitra/dashboard`
- [ ] Di dashboard mitra muncul pesan "Menunggu Verifikasi"

---

**Selesai? Lanjut ke folder `10-fitur-mitra/` → file `01-dashboard-mitra.md`**

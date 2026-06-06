# 01 - Halaman Profil User

## Tujuan
Membuat halaman profil user (`/profile`) dengan kemampuan edit nama, foto, dan preferensi.

---

## Instruksi

**EDIT FILE**: `src/pages/user/ProfilePage.tsx`

**Ganti seluruh isi file placeholder**.

### Struktur Halaman

1. **Profile Header Card**
   - Avatar besar (size `xl`) dengan tombol ganti foto di atasnya (overlay camera icon)
   - Nama lengkap user (bold, text-xl)
   - Email (muted)
   - Badge role: "User" / "Mitra" / "Superadmin"
   - Tanggal bergabung: `profile.member_since` + `formatDate(profile.created_at)`
   - Klik avatar → buka file picker → upload ke Supabase Storage `avatars` → update `profiles.avatar_url`

2. **Edit Profile Section** (dalam Card terpisah)
   - Tombol `profile.edit_profile` membuka mode edit (inline, bukan modal)
   - Input `full_name`: editable, gunakan `editProfileSchema` dari validators
   - Input `phone`: editable, opsional
   - Tombol Save dan Cancel saat mode edit

3. **Settings Section** (dalam Card terpisah)
   - **Tema**: Toggle switch antara "Terang" dan "Gelap" + icon Sun/Moon
     - Gunakan `useTheme().toggleTheme`
   - **Bahasa**: 2 opsi pill button: "🇮🇩 ID" | "🇬🇧 EN"
     - Gunakan `useLanguage().setLanguage`
   - Setiap toggle langsung disimpan (tidak perlu tombol save)

4. **Aksi Tambahan** (dalam Card terpisah)
   - Tombol "Daftar Menjadi Mitra" (`profile.become_mitra`) — hanya muncul jika role = `user`
     - Navigasi ke `/register-mitra`
     - Desain: outline card dengan icon Wrench + chevron right
   - Tombol "Dashboard Mitra" — hanya muncul jika role = `mitra_*`
     - Navigasi ke `/mitra/dashboard`
   - Tombol "Admin Panel" — hanya muncul jika role = `superadmin`
     - Navigasi ke `/admin/dashboard`

5. **Logout Button**
   - Tombol danger outline di paling bawah
   - Konfirmasi modal sebelum logout

### Upload Avatar Logic

```typescript
const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !profile) return;

  const validation = validateFile(file, MAX_FILE_SIZE.AVATAR);
  if (!validation.valid) {
    toast.error(validation.error!);
    return;
  }

  const toastId = toast.loading('Mengupload foto...');
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${profile.id}/avatar.${fileExt}`;

    // Upload ke Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Dapatkan public URL
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);

    // Update profile
    await updateProfile({ avatar_url: urlData.publicUrl });
    toast.dismiss(toastId);
    toast.success('Foto profil berhasil diperbarui');
  } catch (err: any) {
    toast.dismiss(toastId);
    toast.error('Gagal mengupload foto', err.message);
  }
};
```

### Spesifikasi Desain

- Max width `max-w-lg mx-auto`
- Profile header: centered, avatar di atas nama
- Setting toggles: clean, compact, menggunakan native HTML toggle atau custom switch
- Section spacing: `space-y-4`
- Bungkus konten dengan `<PageTransition>`

---

## Validasi

- [ ] Buka `/profile` — profil user muncul dengan avatar, nama, email
- [ ] Klik avatar → bisa upload foto baru → foto berubah
- [ ] Mode edit: bisa ubah nama dan telepon → save → data tersimpan
- [ ] Toggle tema: berubah antara light/dark secara instan
- [ ] Toggle bahasa: seluruh teks berubah antara Indonesia/English
- [ ] Tombol "Daftar Menjadi Mitra" muncul untuk user biasa
- [ ] Tombol logout → konfirmasi → redirect ke landing page

---

**Selesai? Lanjut ke `02-pengaturan-tema-dan-bahasa.md`**

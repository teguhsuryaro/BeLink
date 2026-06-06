# 02 - Pengaturan Tema dan Bahasa

## Tujuan
Memperjelas bahwa setting tema dan bahasa sudah terintegrasi di halaman profil (`01-halaman-profil-user.md`). File ini hanya berisi catatan verifikasi tambahan dan edge-case handling.

---

## Yang Sudah Dibuat

Pengaturan tema dan bahasa sudah ada di `ProfilePage.tsx` (file sebelumnya). File ini menambah verifikasi:

### Verifikasi Tema

1. **Toggle tema** mengubah class `dark` di `<html>`
2. **Preferensi tersimpan** di `localStorage` (key: `belink-theme`)
3. **Sinkronisasi ke database** (opsional untuk prototype):
   ```typescript
   // Saat user ganti tema, simpan juga ke database
   const handleThemeToggle = () => {
     toggleTheme();
     // Opsional: sinkronisasi ke DB agar preferensi konsisten antar device
     updateProfile({ theme_preference: theme === 'light' ? 'dark' : 'light' }).catch(console.error);
   };
   ```

### Verifikasi Bahasa

1. **Toggle bahasa** mengubah semua teks di aplikasi secara instant
2. **Preferensi tersimpan** di `localStorage` (key: `belink-language`)
3. **Sinkronisasi ke database** (opsional):
   ```typescript
   const handleLanguageChange = (lang: 'id' | 'en') => {
     setLanguage(lang);
     updateProfile({ language_preference: lang }).catch(console.error);
   };
   ```

### Edge Cases

- Saat pertama kali login, baca preferensi dari database dan terapkan:
  ```typescript
  // Di authStore.fetchProfile(), setelah profil berhasil diambil:
  if (profile.theme_preference === 'dark') {
    useThemeStore.getState().setTheme('dark');
  }
  if (profile.language_preference) {
    i18n.changeLanguage(profile.language_preference);
  }
  ```

---

## Validasi

- [ ] Ganti tema ke dark → refresh halaman → tema tetap dark
- [ ] Ganti bahasa ke EN → refresh halaman → teks tetap dalam English
- [ ] Buka tab baru → preferensi tetap sama (dari localStorage)

---

**Selesai? Lanjut ke `03-halaman-daftar-mitra.md`**

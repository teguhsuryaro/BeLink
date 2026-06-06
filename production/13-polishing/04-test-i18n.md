# 04 - Test Internasionalisasi (i18n)

## Tujuan
Memastikan seluruh teks di aplikasi menggunakan key i18n dan berfungsi di kedua bahasa (Indonesia & English).

---

## Cara Test

1. Login ke aplikasi
2. Buka profil → ganti bahasa ke **English**
3. Navigasi ke setiap halaman dan periksa:
   - Apakah semua teks berubah ke English?
   - Apakah ada teks yang masih dalam Bahasa Indonesia (hardcoded)?
4. Ganti kembali ke **Bahasa Indonesia** → periksa hal yang sama

Alternatif cepat via console browser:
```javascript
// Ganti ke English
i18next.changeLanguage('en');

// Ganti ke Indonesia
i18next.changeLanguage('id');
```

---

## Checklist Per Halaman

### Landing Page
- [ ] Hero title, subtitle, description → berubah
- [ ] Feature cards (judul + deskripsi) → berubah
- [ ] CTA buttons → berubah
- [ ] How it works section → berubah

### Login & Register
- [ ] Judul, subtitle → berubah
- [ ] Label input (Email, Password, dll) → berubah
- [ ] Tombol submit → berubah
- [ ] Error messages validasi → berubah
- [ ] Link "Sudah punya akun?" / "Belum punya akun?" → berubah

### Home Page
- [ ] Salam "Halo, {nama}" → format berubah sesuai bahasa
- [ ] Quick action card teks → berubah
- [ ] Stats labels → berubah

### Order Form
- [ ] Step labels → berubah
- [ ] Tipe kendaraan (Motor/Mobil → Motorcycle/Car) → berubah
- [ ] Jenis kerusakan → berubah
- [ ] Placeholder input → berubah
- [ ] Tombol Lanjut/Kembali → berubah

### Active Order
- [ ] Status labels (Mencari → Searching, dll) → berubah
- [ ] Tab Chat/Status → berubah
- [ ] Tombol aksi → berubah

### Chat
- [ ] Placeholder input → berubah
- [ ] "[Pesan tidak dapat ditampilkan]" → berubah
- [ ] "Belum ada pesan" → berubah

### History
- [ ] Judul halaman → berubah
- [ ] Filter tabs (Semua, Selesai, dll) → berubah
- [ ] Empty state → berubah

### Profile
- [ ] Semua label dan tombol → berubah
- [ ] "Bergabung sejak" → "Member since"

### Mitra Dashboard
- [ ] Judul dashboard → berubah
- [ ] Status Online/Offline → berubah
- [ ] Stats labels → berubah
- [ ] Alert deposit → berubah

### Admin Dashboard
- [ ] Semua stats labels → berubah
- [ ] Tombol aksi (Ban, Approve, dll) → berubah

### Navigation
- [ ] Mobile nav labels → berubah
- [ ] Desktop nav labels → berubah
- [ ] Sidebar mitra/admin labels → berubah
- [ ] Dropdown menu → berubah

### Modals & Toasts
- [ ] Review modal → berubah
- [ ] Konfirmasi cancel → berubah
- [ ] Toast messages → mengikuti bahasa aktif

### 404 Page
- [ ] Judul dan deskripsi → berubah
- [ ] Tombol "Kembali" → berubah

---

## Cek Teks Hardcoded

Jalankan pencarian di kode untuk menemukan teks hardcoded yang belum menggunakan `t()`:

**PERINTAH**:
```powershell
# Cari string Indonesia yang mungkin hardcoded di komponen React
Select-String -Path "src/**/*.tsx","src/**/*.ts" -Pattern '>[A-Z][a-z]+\s[a-z]' -Recurse | Where-Object { $_.Line -notmatch 'className|import|const|type|interface|//|console' }
```

Atau manual: buka setiap file `.tsx` dan pastikan tidak ada teks berbahasa Indonesia langsung di JSX — semua harus melalui `t('key')`.

---

## Perbaikan Jika Ditemukan Teks Hardcoded

```tsx
// SALAH:
<p>Memuat...</p>

// BENAR:
<p>{t('common.loading')}</p>
```

Jika key belum ada di file terjemahan, tambahkan ke:
- `public/locales/id/translation.json`
- `public/locales/en/translation.json`

---

## Validasi

- [ ] Seluruh teks berubah saat ganti bahasa — tidak ada yang tertinggal
- [ ] Format tanggal berubah sesuai locale (`formatDate` dan `formatRelativeTime`)
- [ ] Format angka (Rp) tetap konsisten di kedua bahasa
- [ ] Ganti bahasa → refresh halaman → bahasa tetap tersimpan (localStorage)
- [ ] Tidak ada key i18n yang muncul sebagai raw text (misal: "landing.hero_title")

---

**Selesai? Lanjut ke `05-optimasi-performa.md`**

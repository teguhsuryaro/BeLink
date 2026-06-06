# 02 - Deploy dan Testing Final

## Tujuan
Melakukan testing menyeluruh di environment production (Vercel) sebelum go-live.

---

## Langkah-Langkah

### 1. Test di URL Production

Buka URL Vercel di **browser incognito** (private/mode penyamaran) agar tidak terpengaruh cache.

### 2. Test Alur Utama (End-to-End)

Jalankan seluruh alur dari awal sampai akhir:

#### Alur A: User Baru → Order → Review

1. **Landing page** muncul → klik "Mulai Sekarang"
2. **Register** dengan email baru → berhasil → redirect ke `/home`
3. **Home page** muncul dengan stats 0
4. Klik **"Panggil Mekanik"** → form wizard muncul
5. **Step 1**: Pilih Motor, isi merek → Lanjut
6. **Step 2**: Pilih jenis kerusakan, upload foto → Lanjut
7. **Step 3**: Deteksi lokasi GPS, set harga → Submit
8. **Searching** — animasi muncul → tunggu (karena belum ada mitra yang merespons)
9. **Batalkan** → kembali ke home

#### Alur B: Mitra Menerima Order

1. Login sebagai **mitra** (`mitra1@belink.test`) — di browser/tab berbeda
2. Dashboard muncul → status **Online**
3. Buat order dari user (tab lain) → order muncul di **Incoming Orders** mitra
4. Klik **"Lihat Detail"** → detail order muncul
5. Klik **"Terima Pesanan"** → status berubah ke `negotiating`
6. **Chat** — kirim pesan dari user dan mitra → pesan muncul di kedua sisi (real-time)
7. Mitra klik **"Datang Kesini (Deal)"** → status `agreed`
8. Mitra klik **"OTW"** → status `otw`, lokasi tracking aktif
9. Mitra klik **"Sudah Tiba"** → status `arrived`
10. Mitra klik **"Mulai Kerjakan"** → status `in_progress`
11. Mitra klik **"Selesai"** → status `completed`
12. **User side**: Review modal muncul → beri rating + komentar → submit
13. **Mitra side**: deposit berkurang (komisi terpotong)

#### Alur C: Admin

1. Login sebagai **admin** (`admin@belink.test`)
2. Dashboard menampilkan stats yang benar
3. Buka **Users** → bisa search dan ban user
4. Buka **Verification** → lihat mitra pending (jika ada)
5. Buka **Reports** → lihat laporan (jika ada)
6. Buka **Statistics** → data terlihat

### 3. Test Anti-Bypass Filter

1. Dalam chat (saat order aktif), kirim: `WA saya 081234567890`
2. Pesan harus terfilter → teks disensor
3. Toast warning muncul

### 4. Test Responsivitas di Production

1. Buka di **mobile** (HP asli, bukan emulator):
   - Bottom nav muncul
   - Semua halaman scrollable tanpa horizontal scroll
   - Input form bisa diisi
   - Peta muncul dan interaktif
2. Buka di **desktop**:
   - Topbar nav muncul
   - Layout 2 kolom pada halaman active order
   - Sidebar pada dashboard mitra/admin

### 5. Test Dark Mode di Production

1. Toggle ke dark mode via profil
2. Refresh halaman → dark mode tetap
3. Navigasi ke beberapa halaman → semua dark

### 6. Test i18n di Production

1. Toggle ke English via profil
2. Refresh halaman → English tetap
3. Navigasi ke beberapa halaman → semua English

### 7. Test Edge Cases

- [ ] Login dengan kredensial salah → toast error
- [ ] Register dengan email yang sudah ada → toast error
- [ ] Akses `/home` tanpa login → redirect ke `/login`
- [ ] Akses `/admin/dashboard` sebagai user biasa → redirect ke `/home`
- [ ] Upload file > batas ukuran → toast error
- [ ] Buka URL yang tidak ada → halaman 404
- [ ] Refresh halaman saat di `/order/xyz` → halaman tetap muncul (bukan 404 Vercel)

---

## Jika Ditemukan Bug

1. Catat bug: halaman, langkah reproduksi, expected vs actual
2. Fix di lokal → test → commit → push
3. Vercel otomatis re-deploy
4. Test ulang di production

---

## Validasi

- [ ] Seluruh Alur A berjalan tanpa error
- [ ] Seluruh Alur B berjalan tanpa error (real-time chat, status update)
- [ ] Seluruh Alur C berjalan tanpa error
- [ ] Anti-bypass filter berfungsi
- [ ] Responsif di mobile dan desktop
- [ ] Dark/light mode berfungsi
- [ ] i18n berfungsi
- [ ] Edge cases tertangani
- [ ] Tidak ada error di console browser (di production)
- [ ] Tidak ada `console.log` debug yang tersisa (hapus sebelum go-live)

---

**Selesai? Lanjut ke `03-checklist-go-live.md`**

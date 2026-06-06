# Revisi 01 — Laporan QA & Perbaikan Pasca-Peluncuran

## Ringkasan

Dokumen ini merangkum seluruh temuan bug, kekurangan fitur, dan masalah UI/UX yang ditemukan saat *Quality Assurance* (QA) pasca-deploy. Setiap item sudah dijabarkan secara teknis dan dipecah menjadi file perencanaan terpisah di dalam folder ini agar bisa dikerjakan secara independen.

**Total item revisi: 5 area utama → 10 sub-task**

---

## 1. Saldo & Deposit (2 sub-task)

### 1A. Top Up Saldo — Alur Baru (Prototype)

**Severity:** 🟡 Medium — Fitur inti belum fungsional  
**File terdampak:** `src/pages/mitra/DepositPage.tsx`

**Kondisi saat ini:**  
Modal Top Up saat ini hanya menampilkan instruksi transfer manual ke rekening admin. Tidak ada mekanisme untuk langsung menambah saldo.

**Yang diinginkan:**  
Alur yang disederhanakan untuk kebutuhan prototype/demo:
1. User klik "Top Up Saldo" → Modal muncul dengan input angka (minimum Rp10.000).
2. User klik "Lanjut" → Muncul tampilan QR Code pembayaran (gimmick visual saja, bukan QR asli).
3. User klik "Konfirmasi Pembayaran" → Saldo langsung bertambah di database (`mitra_profiles.deposit_balance`) dan dicatat di tabel `deposit_transactions` dengan tipe `topup`.

**Perencanaan detail:** [`01-topup-saldo/01-alur-topup-baru.md`](./01-topup-saldo/01-alur-topup-baru.md)

---

### 1B. Riwayat Transaksi — Warna & Tanda +/- Salah

**Severity:** 🟢 Low — Bug visual  
**File terdampak:** `src/pages/mitra/DepositPage.tsx`

**Kondisi saat ini:**  
Kode di baris 146 sudah memiliki logika `isPositive = tx.type === 'top_up'`, namun tipe data yang disimpan di database menggunakan string `'topup'` (tanpa underscore), sehingga pencocokan gagal. Akibatnya:
- Top up tetap ditampilkan dengan ikon merah dan tanda minus (−).
- Warna teks jumlah tidak hijau.

**Yang diinginkan:**  
- Transaksi Top Up: ikon hijau (↑), teks hijau, tanda `+Rp...`
- Transaksi Komisi/Withdrawal: ikon merah (↓), teks merah, tanda `-Rp...`

**Perencanaan detail:** [`01-topup-saldo/02-fix-warna-riwayat.md`](./01-topup-saldo/02-fix-warna-riwayat.md)

---

## 2. Halaman Profil Mitra (1 sub-task)

### 2A. Halaman Profil Mitra — Implementasi Penuh

**Severity:** 🔴 High — Halaman kosong  
**File terdampak:** `src/pages/mitra/MitraProfilePage.tsx` (saat ini hanya 12 baris placeholder)

**Kondisi saat ini:**  
Halaman hanya berisi teks `"Mitra Profile Page"` di tengah layar. Tidak ada fungsionalitas apapun.

**Yang diinginkan:**  
Halaman profil lengkap yang memungkinkan mitra:
1. Melihat dan mengedit **Nama Bengkel**, **Bio**, dan **Alamat**.
2. **Mengubah lokasi lapak/bengkel** dengan mudah menggunakan komponen `LocationPicker` (map interaktif). Ini krusial bagi mitra yang berpindah lokasi atau mitra keliling yang perlu update posisi agar match dengan klien terdekat.
3. **Mengubah spesialisasi kendaraan** (motor, mobil, atau keduanya) — agar mitra bisa expand atau mengubah cakupan layanan.
4. Menampilkan info non-editable: Status Verifikasi, Saldo, Rating, Total Order.

**Referensi form:** Gunakan field yang sama dengan form pendaftaran mitra di `src/pages/user/RegisterMitraPage.tsx` (business_name, bio, address, lat/lng, specializations).

**Perencanaan detail:** [`02-profil-mitra/01-implementasi-profil-mitra.md`](./02-profil-mitra/01-implementasi-profil-mitra.md)

---

## 3. Hak Akses Halaman / Mode (1 sub-task)

### 3A. Superadmin Hanya Bisa Akses Panel Admin

**Severity:** 🟡 Medium — Celah akses  
**File terdampak:** `src/router/index.tsx`, `src/router/ProtectedRoute.tsx`

**Kondisi saat ini:**  
Route user (`/home`, `/order`, `/history`, dll) menggunakan `<ProtectedRoute />` tanpa filter `allowedRoles`. Artinya superadmin yang login tetap bisa mengakses halaman user dan bahkan membuat order — padahal superadmin bukan user/mitra, ia hanya pengawas.

**Yang diinginkan:**  
- Superadmin hanya bisa mengakses route `/admin/*`.
- Jika superadmin mencoba navigasi ke `/home`, `/order`, atau `/mitra/*`, ia harus di-redirect ke `/admin/dashboard`.
- Sebaliknya, user dan mitra tetap tidak bisa akses `/admin/*` (ini sudah benar saat ini).

**Perencanaan detail:** [`03-hak-akses/01-batasi-superadmin.md`](./03-hak-akses/01-batasi-superadmin.md)

---

## 4. Simulasi Klien & Mitra (2 sub-task)

### 4A. Radius Pencarian Mitra — Perbesar ke 20 KM

**Severity:** 🟢 Low — Perubahan konstanta  
**File terdampak:** `src/lib/constants.ts`

**Kondisi saat ini:**  
`DEFAULT_SEARCH_RADIUS_KM = 15` (baris 28 di constants.ts).

**Yang diinginkan:**  
Ubah menjadi `DEFAULT_SEARCH_RADIUS_KM = 20` agar radius pencarian lebih luas untuk simulasi/demo.

**Perencanaan detail:** [`04-simulasi-order/01-perbesar-radius.md`](./04-simulasi-order/01-perbesar-radius.md)

---

### 4B. Tombol "Selesaikan Orderan" untuk Klien (Prototype Shortcut)

**Severity:** 🟡 Medium — Fitur prototype  
**File terdampak:** `src/components/order/OrderActionButtons.tsx`

**Kondisi saat ini:**  
Setelah mitra klik OTW, di sisi klien hanya ada tombol "Batalkan Pesanan" (baris 98-103). Klien tidak punya cara untuk menyelesaikan order tanpa menunggu mitra menyelesaikan seluruh alur status (OTW → Tiba → Mulai → Selesai).

**Yang diinginkan:**  
Karena ini prototype, tambahkan tombol **"Selesaikan Orderan"** di sisi klien yang muncul saat status order adalah `otw`, `arrived`, atau `in_progress`. Saat klien klik tombol ini:
1. Status order langsung berubah menjadi `completed`.
2. Sistem menjalankan semua proses penyelesaian yang seharusnya (potong komisi, update rating, dst) — sesuai trigger database `process_order_completion`.
3. Modal review muncul agar klien bisa beri ulasan.

> **Catatan:** Tombol ini hanya untuk memudahkan testing prototype. Di produksi asli, tombol ini akan dihapus.

**Perencanaan detail:** [`04-simulasi-order/02-tombol-selesaikan-klien.md`](./04-simulasi-order/02-tombol-selesaikan-klien.md)

---

## 5. Bug Warna & Responsif (4 sub-task)

### 5A. Tombol Top Up Tidak Terlihat di Dark Mode

**Severity:** 🟡 Medium — Bug visual  
**File terdampak:** `src/pages/mitra/DepositPage.tsx`

**Kondisi saat ini:**  
Tombol "Top Up Saldo" di baris 112-119 menggunakan class `bg-white text-primary hover:bg-gray-50`. Di dark mode, tombol ini terletak di atas card gradient biru tua, sehingga kontennya menyatu/tidak kontras.

**Yang diinginkan:**  
Perbaiki agar tombol tetap terlihat jelas di dark mode, misalnya gunakan `dark:bg-white dark:text-primary` secara eksplisit, atau gunakan warna yang kontras di dark mode.

**Perencanaan detail:** [`05-bug-visual/01-fix-tombol-topup-dark.md`](./05-bug-visual/01-fix-tombol-topup-dark.md)

---

### 5B. Halaman Manajemen Pengguna — Desktop Tidak Responsif

**Severity:** 🔴 High — Bug layout kritis  
**File terdampak:** `src/pages/admin/UsersManagementPage.tsx`

**Kondisi saat ini:**  
Tabel desktop (baris 250-321, di dalam `div.hidden.md:block`) menggunakan `whitespace-nowrap` yang menyebabkan tabel meluber keluar dari container card. Konten tidak wrap dan kolom-kolom menjadi terlalu lebar.

**Yang diinginkan:**  
- Tabel desktop harus muat dalam container tanpa horizontal scroll berlebihan.
- Kolom "Pengguna" (nama + email) harus bisa wrap/truncate dengan benar.
- Di layar desktop kecil (768px - 1024px), tabel harus tetap terbaca.
- Pastikan card `overflow-hidden` bekerja dengan benar.

**Perencanaan detail:** [`05-bug-visual/02-fix-tabel-pengguna-desktop.md`](./05-bug-visual/02-fix-tabel-pengguna-desktop.md)

---

### 5C. Landing Page — Icon Card "Kenapa Memilih BeLink?" Tidak Stabil

**Severity:** 🟡 Medium — Bug visual  
**File terdampak:** `src/pages/public/LandingPage.tsx`, `src/components/ui/Card.tsx`

**Kondisi saat ini:**  
Di section "Kenapa Memilih BeLink?" (baris 60-122 di LandingPage.tsx), icon-icon di dalam card menggunakan layout `flex items-center justify-between` di `CardHeader`. Ini menyebabkan posisi icon, judul, dan deskripsi tidak stabil — kadang sejajar horizontal, kadang vertikal tergantung panjang teks.

**Yang diinginkan:**  
- Icon harus selalu berada di atas/kiri dan memiliki ukuran konsisten.
- Layout card harus `flex-col` (vertikal) agar icon → judul → deskripsi berurutan ke bawah.
- Konsisten di semua viewport (mobile dan desktop).

**Perencanaan detail:** [`05-bug-visual/03-fix-icon-landing-card.md`](./05-bug-visual/03-fix-icon-landing-card.md)

---

### 5D. Audit Visual Umum — Cek Bug Serupa Lainnya

**Severity:** 🟢 Low — Preventif  
**File terdampak:** Seluruh halaman

**Yang harus dilakukan:**  
Lakukan sweep visual di semua halaman untuk menemukan:
- Elemen yang hilang di dark mode (teks tidak terlihat, border hilang).
- Overflow horizontal di mobile yang tidak seharusnya.
- Tombol/icon yang ukurannya tidak konsisten.
- Teks terpotong tanpa ellipsis.

**Perencanaan detail:** [`05-bug-visual/04-audit-visual-umum.md`](./05-bug-visual/04-audit-visual-umum.md)

---

## Prioritas Eksekusi

| # | Task | Severity | Estimasi |
|---|------|----------|----------|
| 1 | 2A — Profil Mitra (halaman kosong) | 🔴 High | 2-3 jam |
| 2 | 5B — Tabel Pengguna Desktop | 🔴 High | 1 jam |
| 3 | 1A — Alur Top Up Baru | 🟡 Medium | 2 jam |
| 4 | 4B — Tombol Selesaikan Klien | 🟡 Medium | 1 jam |
| 5 | 3A — Batasi Superadmin | 🟡 Medium | 30 menit |
| 6 | 5A — Tombol Top Up Dark Mode | 🟡 Medium | 15 menit |
| 7 | 5C — Icon Landing Card | 🟡 Medium | 30 menit |
| 8 | 1B — Warna Riwayat Transaksi | 🟢 Low | 15 menit |
| 9 | 4A — Radius Pencarian 20 KM | 🟢 Low | 5 menit |
| 10 | 5D — Audit Visual Umum | 🟢 Low | 1 jam |

**Total estimasi: ~8-9 jam kerja**

---

## Struktur Folder

```
production/revisi-01/
├── revisi-01.md                          ← Dokumen ini
├── 01-topup-saldo/
│   ├── 01-alur-topup-baru.md
│   └── 02-fix-warna-riwayat.md
├── 02-profil-mitra/
│   └── 01-implementasi-profil-mitra.md
├── 03-hak-akses/
│   └── 01-batasi-superadmin.md
├── 04-simulasi-order/
│   ├── 01-perbesar-radius.md
│   └── 02-tombol-selesaikan-klien.md
└── 05-bug-visual/
    ├── 01-fix-tombol-topup-dark.md
    ├── 02-fix-tabel-pengguna-desktop.md
    ├── 03-fix-icon-landing-card.md
    └── 04-audit-visual-umum.md
```

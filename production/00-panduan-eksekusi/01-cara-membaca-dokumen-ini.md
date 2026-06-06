# Panduan Membaca & Mengeksekusi Dokumen Production

## Apa Ini?

Folder `production/` berisi **seluruh instruksi pembangunan website BeLink dari nol hingga deploy**. Setiap folder dan file di dalamnya disusun secara berurutan dan harus dikerjakan sesuai urutan nomor.

---

## Aturan Eksekusi

### 1. Kerjakan Sesuai Urutan Nomor

```
00-panduan-eksekusi/     <- Baca ini dulu (kamu sedang di sini)
01-inisialisasi-proyek/  <- Eksekusi kedua
02-konfigurasi-proyek/   <- Eksekusi ketiga
03-setup-supabase/       <- Eksekusi keempat
...dst
```

- Folder `00` selesai, baru boleh lanjut ke folder `01`
- Di dalam setiap folder, file juga harus dieksekusi sesuai nomor urut

### 2. Setiap File = 1 Tugas

- Setiap file `.md` berisi **satu tugas spesifik** yang jelas dan mandiri
- Baca dari atas ke bawah, ikuti setiap instruksi secara literal
- Jangan loncat ke file berikutnya sebelum yang ini selesai

### 3. Validasi Sebelum Lanjut

- Di akhir setiap file ada bagian **Validasi** — checklist yang harus dipenuhi
- Jika validasi gagal, perbaiki dulu sebelum melanjutkan
- Jika validasi berhasil, baru boleh lanjut ke file berikutnya

### 4. Jangan Improvisasi

- Ikuti instruksi apa adanya, jangan menambah fitur sendiri
- Jangan mengubah nama file, nama variabel, atau struktur folder yang sudah ditentukan
- Jika ada yang tidak jelas, tanya ke supervisor sebelum lanjut

### 5. Kode yang Ditulis = Final

- Setiap kode yang ditampilkan di dalam blok kode harus di-copy **persis** seperti yang tertulis
- Perhatikan spasi, indentasi, dan tanda baca
- Jangan mengganti nama function, variabel, atau import path

---

## Konvensi yang Digunakan

### Blok Perintah Terminal

```bash
# Ini adalah perintah yang harus dijalankan di terminal
npm install something
```

Jalankan perintah di atas persis seperti yang tertulis, di folder root proyek (`e:\CODING\BELINK\`) kecuali disebutkan lain.

### Blok Kode File

Jika ada instruksi seperti:

> **Buat file**: `src/lib/utils.ts`

Artinya buat file baru di path tersebut relatif dari root proyek. Jika folder belum ada, buat foldernya juga.

### Blok Kode Edit

Jika ada instruksi seperti:

> **Edit file**: `tailwind.config.ts`
> **Ganti seluruh isi file** dengan kode berikut:

Artinya buka file yang sudah ada dan timpa seluruh isinya.

### Ikon Penanda

| Simbol | Arti |
|---|---|
| **PERINTAH** | Jalankan command ini di terminal |
| **BUAT FILE** | Buat file baru dengan konten yang diberikan |
| **EDIT FILE** | Ubah file yang sudah ada |
| **VALIDASI** | Checklist yang harus dipenuhi sebelum lanjut |
| **CATATAN** | Informasi tambahan, baca tapi tidak perlu aksi |
| **PERINGATAN** | Hal kritis yang harus diperhatikan |

---

## Struktur Folder Production

```
production/
├── 00-panduan-eksekusi/
│   └── 01-cara-membaca-dokumen-ini.md        <- Kamu di sini
├── 01-inisialisasi-proyek/
│   ├── 01-buat-proyek-vite.md
│   ├── 02-install-dependencies.md
│   └── 03-setup-git-dan-github.md
├── 02-konfigurasi-proyek/
│   ├── 01-konfigurasi-tailwind.md
│   ├── 02-konfigurasi-typescript.md
│   ├── 03-konfigurasi-eslint-prettier.md
│   ├── 04-konfigurasi-vite.md
│   └── 05-setup-environment-variables.md
├── 03-setup-supabase/
│   ├── 01-buat-project-supabase.md
│   ├── 02-buat-tabel-database.md
│   ├── 03-setup-rls-policies.md
│   ├── 04-setup-storage-buckets.md
│   └── 05-setup-realtime.md
├── 04-fondasi-frontend/
│   ├── 01-struktur-folder-src.md
│   ├── 02-setup-supabase-client.md
│   ├── 03-setup-design-system-css.md
│   ├── 04-setup-i18n.md
│   ├── 05-buat-utility-functions.md
│   ├── 06-buat-konstanta-dan-types.md
│   ├── 07-buat-zustand-stores.md
│   └── 08-setup-query-client.md
├── 05-komponen-ui-dasar/
│   ├── 01-komponen-button.md
│   ├── 02-komponen-input.md
│   ├── 03-komponen-card.md
│   ├── 04-komponen-badge-dan-skeleton.md
│   ├── 05-komponen-modal-dan-spinner.md
│   └── 06-komponen-avatar-dan-toast.md
├── 06-layout-dan-navigasi/
│   ├── 01-page-transition-wrapper.md
│   ├── 02-mobile-bottom-navigation.md
│   ├── 03-desktop-navigation.md
│   ├── 04-app-layout.md
│   ├── 05-dashboard-layout.md
│   └── 06-setup-routing.md
├── 07-autentikasi/
│   ├── 01-auth-hooks-dan-store.md
│   ├── 02-halaman-landing-page.md
│   ├── 03-halaman-register.md
│   ├── 04-halaman-login.md
│   └── 05-protected-route-dan-redirect.md
├── 08-fitur-user-pemesanan/
│   ├── 01-home-page-user.md
│   ├── 02-integrasi-peta-leaflet.md
│   ├── 03-form-darurat-step-wizard.md
│   ├── 04-pencarian-mitra-dan-osrm.md
│   ├── 05-halaman-active-order.md
│   ├── 06-real-time-chat.md
│   ├── 07-anti-bypass-filter.md
│   ├── 08-tombol-aksi-dan-tracking.md
│   ├── 09-review-dan-rating.md
│   └── 10-halaman-riwayat-order.md
├── 09-fitur-user-profil/
│   ├── 01-halaman-profil-user.md
│   ├── 02-pengaturan-tema-dan-bahasa.md
│   └── 03-halaman-daftar-mitra.md
├── 10-fitur-mitra/
│   ├── 01-dashboard-mitra.md
│   ├── 02-toggle-online-offline.md
│   ├── 03-incoming-orders.md
│   ├── 04-active-negotiation-mitra.md
│   ├── 05-logika-otw-selesai-komisi.md
│   ├── 06-halaman-deposit.md
│   └── 07-riwayat-order-mitra.md
├── 11-fitur-superadmin/
│   ├── 01-dashboard-admin.md
│   ├── 02-manajemen-user.md
│   ├── 03-verifikasi-mitra.md
│   ├── 04-manajemen-laporan.md
│   └── 05-statistik-platform.md
├── 12-data-dummy/
│   ├── 01-seed-akun-test.md
│   └── 02-seed-data-transaksi.md
├── 13-polishing/
│   ├── 01-review-animasi-dan-loading.md
│   ├── 02-test-responsivitas.md
│   ├── 03-test-dark-light-mode.md
│   ├── 04-test-i18n.md
│   └── 05-optimasi-performa.md
└── 14-deployment/
    ├── 01-setup-vercel.md
    ├── 02-deploy-dan-testing-final.md
    └── 03-checklist-go-live.md
```

---

## Referensi Utama

- **Project Blueprint**: `BELINK_PROJECT_PLAN.md` (dokumen induk yang menjadi sumber semua instruksi ini)
- **Deskripsi Produk**: `BeLink.txt` (konsep asli platform)

---

## Estimasi Waktu

| Folder | Estimasi |
|---|---|
| 00-01: Setup & Init | 1-2 jam |
| 02: Konfigurasi | 1-2 jam |
| 03: Supabase | 2-3 jam |
| 04: Fondasi | 3-4 jam |
| 05: Komponen UI | 3-4 jam |
| 06: Layout & Nav | 3-4 jam |
| 07: Auth | 2-3 jam |
| 08: Fitur Pemesanan | 8-12 jam |
| 09: Profil User | 2-3 jam |
| 10: Fitur Mitra | 6-8 jam |
| 11: Superadmin | 4-6 jam |
| 12: Data Dummy | 1-2 jam |
| 13: Polishing | 3-4 jam |
| 14: Deploy | 1-2 jam |
| **TOTAL** | **~35-55 jam kerja** |

---

**Siap? Lanjut ke folder `01-inisialisasi-proyek/`.**

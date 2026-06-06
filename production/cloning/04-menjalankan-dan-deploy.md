# Fase 04: Menjalankan dan Mempresentasikan Aplikasi

Setelah kode, *database*, dan koneksinya selesai dikonfigurasi, kamu siap menyalakan aplikasinya.

## 1. Menjalankan di Localhost (Laptop Sendiri)
Buka kembali terminal di dalam folder proyek, lalu pastikan semuanya sudah terinstall dengan mengetik:

```bash
npm run dev
```

Akan muncul teks hijau bertuliskan `http://localhost:5173`. Klik link tersebut sambil menahan tombol `Ctrl` (atau `Cmd` di Mac), dan website akan terbuka di browsermu!

> **PANDUAN SIMULASI UNTUK DOSEN (TIPS DEMO)**
> 1. Buka website, lalu daftar (*Register*) sebagai **User Biasa** dengan email palsu (contoh: `user_demo@belink.com` / password `password123`).
> 2. Buka tab samaran (Incognito) atau browser berbeda, lalu daftar sebagai **Mitra** (contoh: `mitra_demo@belink.com` / password `password123`).
> 3. Jangan lupa navigasikan akun Mitra tersebut ke halaman "Dashboard Mitra", dan pastikan *toggle* di kanan atas diatur agar Mitra "Sedang Aktif/Online".
> 4. Silahkan simulasikan pemesanan layanan darurat dari tab User Biasa, terima pesanan dari tab Mitra, dan tunjukkan kepada dosenmu interaksi real-time antara keduanya!

## 2. Mengerahkan ke Internet (Deploy Publik)
Jika dosenmu meminta akses website via HP/Internet agar bisa dinilai langsung, cara termudah dan gratis adalah menggunakan Vercel:

1. Buat akun gratis di **[Vercel.com](https://vercel.com)** menggunakan akun GitHub-mu.
2. Pastikan kamu sudah mengunggah (*Push*) seluruh kodemu ini ke repository GitHub milikmu sendiri.
3. Di *dashboard* Vercel, klik tombol **Add New...** > **Project**, lalu *Import* repository GitHub BeLink-mu.
4. **SANGAT PENTING**: Sebelum menekan *Deploy*, buka bagian **Environment Variables**.
   - Kolom Name: ketik `VITE_SUPABASE_URL`, Kolom Value: isi URL-mu, lalu Add.
   - Kolom Name: ketik `VITE_SUPABASE_ANON_KEY`, Kolom Value: isi Key panjangmu, lalu Add.
5. Klik **Deploy** dan tunggu 1-2 menit.

Vercel akan memberimu link website permanen (contoh: `belink-tugasakhir.vercel.app`) yang bisa diakses dari seluruh dunia tanpa perlu menyalakan laptop.

**SELESAI!** Semoga sukses dengan presentasinya! 🚀

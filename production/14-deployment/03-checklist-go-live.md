# 03 - Checklist Go-Live

## Tujuan
Checklist final sebelum website BeLink di-launch ke publik.

---

## ✅ Pre-Launch Checklist

### Infrastruktur
- [ ] Vercel deployment berhasil (status: Ready)
- [ ] URL production bisa diakses
- [ ] HTTPS aktif (otomatis dari Vercel)
- [ ] Environment variables production sudah benar
- [ ] Supabase project aktif dan accessible

### Keamanan
- [ ] RLS (Row Level Security) aktif di SEMUA tabel Supabase
- [ ] Tidak ada data sensitif di client-side code (API keys, secrets)
- [ ] `VITE_SUPABASE_ANON_KEY` adalah **anon key** (bukan service role key)
- [ ] Anti-bypass filter chat aktif
- [ ] Protected routes berfungsi (tidak bisa bypass via URL)
- [ ] File upload di-validasi (tipe dan ukuran)

### Data
- [ ] Tabel database sudah ter-create semua (8 tabel)
- [ ] Trigger functions aktif (`handle_new_user`, `process_order_completion`, `update_mitra_rating`)
- [ ] Storage buckets ada (avatars, vehicles, damages, documents)
- [ ] Storage buckets punya policy yang benar
- [ ] Akun test DIHAPUS atau password DIGANTI sebelum go-live

### Fitur
- [ ] Register & Login berfungsi
- [ ] Order form (3 step wizard) berfungsi
- [ ] Pencarian mitra + OSRM berfungsi
- [ ] Real-time chat berfungsi
- [ ] Status update (Deal → OTW → Selesai) berfungsi
- [ ] Review & rating berfungsi
- [ ] Deposit & komisi terhitung benar
- [ ] Dashboard mitra berfungsi
- [ ] Dashboard admin berfungsi
- [ ] Verifikasi mitra berfungsi

### UX
- [ ] Loading states di semua halaman (tidak ada blank page)
- [ ] Error handling: toast muncul saat error
- [ ] Animasi smooth, tidak ada lag
- [ ] Responsif di mobile (375px) dan desktop (1280px)
- [ ] Dark mode berfungsi
- [ ] i18n (ID/EN) berfungsi

### SEO & Meta
- [ ] `<title>` terisi: "BeLink — Layanan Darurat Kendaraan"
- [ ] `<meta name="description">` terisi
- [ ] Favicon terlihat di tab browser
- [ ] OG meta tags (jika ingin share di sosial media)

### Performance
- [ ] Bundle size < 500 KB gzip
- [ ] Lighthouse Performance ≥ 80
- [ ] Lazy loading halaman aktif
- [ ] Gambar dikompresi sebelum upload

---

## ⚠️ Yang Perlu Dilakukan Sebelum Go-Live

### 1. Hapus Akun Test
```sql
-- JALANKAN DI SUPABASE SQL EDITOR SEBELUM GO-LIVE
-- Hapus data dummy
DELETE FROM chats WHERE order_id IN (SELECT id FROM orders WHERE user_id IN (SELECT id FROM profiles WHERE email LIKE '%@belink.test'));
DELETE FROM order_reviews WHERE reviewer_id IN (SELECT id FROM profiles WHERE email LIKE '%@belink.test');
DELETE FROM deposit_transactions WHERE mitra_id IN (SELECT id FROM profiles WHERE email LIKE '%@belink.test');
DELETE FROM notifications WHERE user_id IN (SELECT id FROM profiles WHERE email LIKE '%@belink.test');
DELETE FROM orders WHERE user_id IN (SELECT id FROM profiles WHERE email LIKE '%@belink.test');
DELETE FROM mitra_profiles WHERE id IN (SELECT id FROM profiles WHERE email LIKE '%@belink.test');
DELETE FROM profiles WHERE email LIKE '%@belink.test';
-- Hapus juga dari auth.users via Supabase Dashboard → Authentication
```

**ATAU** — jika ingin tetap menggunakan akun test, ganti password-nya:
1. Buka Supabase Dashboard → Authentication → Users
2. Ganti password setiap akun test
3. Catat password baru di tempat aman

### 2. Buat Akun Superadmin Asli
1. Register via website dengan email asli
2. Update role di database:
   ```sql
   UPDATE profiles SET role = 'superadmin' WHERE email = 'email-admin-asli@gmail.com';
   ```

### 3. Review Console Logs
```powershell
# Hapus semua console.log debug
Select-String -Path "src/**/*.tsx","src/**/*.ts" -Pattern "console\.log" -Recurse
# Review hasilnya, hapus yang tidak perlu, pertahankan console.error
```

### 4. Set Supabase ke Production Mode (Opsional)
- Buka Supabase Dashboard → Settings → General
- Pastikan **Pause project after 1 week of inactivity** dipahami (Free tier)
- Jika perlu, upgrade ke Pro untuk menghindari auto-pause

---

## 🎉 Go-Live!

Setelah semua checklist di atas terpenuhi:

1. **Share URL** ke pengguna awal (beta testers)
2. **Monitor** Supabase Dashboard untuk melihat:
   - Jumlah auth signups
   - Database size
   - API requests
   - Realtime connections
3. **Monitor** Vercel Analytics untuk melihat:
   - Page views
   - Web Vitals
   - Error rates

---

## Post-Launch Tasks (Opsional / Next Phase)

- [ ] Setup error tracking (Sentry — free tier)
- [ ] Setup analytics (Vercel Analytics — free)
- [ ] Implementasi push notifications (Firebase Cloud Messaging — free)
- [ ] Integrasi payment gateway untuk top up deposit
- [ ] Tambahkan fitur estimasi harga servis (bukan hanya ongkos jalan)
- [ ] Implementasi in-app notification center
- [ ] Tambahkan fitur pencarian/filter bengkel terdekat (tanpa order)
- [ ] Progressive Web App (PWA) manifest untuk install di home screen

---

## 🏁 SELESAI

**Selamat! Website BeLink sudah berhasil dibangun dan di-deploy.**

Seluruh roadmap dari folder `00-panduan-eksekusi` hingga `14-deployment` telah selesai dieksekusi.

Ringkasan akhir:
- **15 folder** panduan production
- **~60 file** instruksi `.md`
- **~35-55 jam kerja** estimasi total
- **1 website** fully functional

Terima kasih telah mengikuti seluruh panduan ini. 🚀

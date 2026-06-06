# 01 - Setup Vercel

## Tujuan
Menyiapkan deployment ke Vercel (gratis) dan mengkonfigurasi agar routing SPA berfungsi.

---

## Langkah-Langkah

### 1. Buat Akun Vercel (Jika Belum)

1. Buka https://vercel.com
2. Klik **Sign Up**
3. Sign up dengan **GitHub** (rekomendasi — karena repo BeLink ada di GitHub)
4. Free plan — tidak perlu kartu kredit

### 2. Push Kode ke GitHub

Pastikan semua kode sudah di-push ke GitHub repository:

**PERINTAH**:
```powershell
cd e:\CODING\BELINK
git add .
git commit -m "feat: complete BeLink application"
git push origin main
```

### 3. Import Project di Vercel

1. Di Vercel Dashboard, klik **Add New** → **Project**
2. Pilih **Import Git Repository**
3. Pilih repository `belink` dari daftar GitHub repo
4. Konfigurasi:
   - **Framework Preset**: Vite (Vercel biasanya auto-detect)
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 4. Tambahkan Environment Variables

Di halaman konfigurasi project (sebelum klik Deploy), tambahkan Environment Variables:

| Key | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://xxxxxxxxxx.supabase.co` (URL Supabase kamu) |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...` (anon key Supabase kamu) |
| `VITE_APP_NAME` | `BeLink` |
| `VITE_APP_ENV` | `production` |

**PERINGATAN**: Ambil nilai dari file `.env.local` yang sudah diisi sebelumnya. Jangan salah copy.

### 5. Konfigurasi Rewrite untuk SPA

Buat file `vercel.json` di root proyek agar routing SPA berfungsi (semua route di-handle oleh `index.html`):

**BUAT FILE**: `vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/((?!api|_next|locales|favicon|assets).*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/locales/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, s-maxage=86400"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**Commit dan push file ini:**

```powershell
git add vercel.json
git commit -m "chore: add vercel.json for SPA routing"
git push origin main
```

### 6. Deploy

1. Kembali ke Vercel Dashboard
2. Klik **Deploy**
3. Tunggu 1-3 menit sampai build selesai
4. Vercel akan memberikan URL seperti: `https://belink-xxx.vercel.app`

### 7. Konfigurasi Domain (Opsional)

Jika punya domain custom:
1. Di Vercel Dashboard → Project → **Settings** → **Domains**
2. Tambahkan domain kamu
3. Ikuti instruksi DNS yang diberikan Vercel

---

## Validasi

- [ ] Build berhasil di Vercel (status: Ready)
- [ ] Buka URL Vercel — landing page muncul
- [ ] Navigasi ke `/login` — halaman login muncul (bukan 404)
- [ ] Navigasi ke `/home` — redirect ke `/login` (karena belum login)
- [ ] Refresh halaman di `/login` — tetap di `/login` (bukan 404)
- [ ] Environment variables terbaca (test: login dengan akun test)
- [ ] File locale terbaca: `https://URL/locales/id/translation.json` mengembalikan JSON

---

## Catatan

- Vercel Free Tier mencakup:
  - 100 GB bandwidth per bulan
  - Serverless function execution (tidak kita pakai)
  - Unlimited deployments
  - Automatic HTTPS
  - Custom domain (1 gratis)
- Setiap push ke `main` branch akan otomatis trigger re-deploy
- Preview deployment: setiap pull request mendapat URL preview

---

**Selesai? Lanjut ke `02-deploy-dan-testing-final.md`**

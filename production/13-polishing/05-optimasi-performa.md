# 05 - Optimasi Performa

## Tujuan
Mengoptimasi performa aplikasi agar load cepat dan responsif, terutama di perangkat mobile.

---

## Langkah-Langkah

### 1. Cek Bundle Size

**PERINTAH**:
```powershell
npm run build
```

Setelah build selesai, periksa output di terminal. Cari file yang terlalu besar:

| File | Target Maks | Jika Melebihi |
|---|---|---|
| `index-*.js` (entry) | < 150 KB gzip | Split vendor chunks |
| Vendor chunks | < 200 KB gzip per chunk | Evaluasi dependency |
| CSS | < 30 KB gzip | Purge unused styles |
| Total | < 500 KB gzip | Investigasi |

### 2. Optimasi yang Sudah Diterapkan

Pastikan hal-hal berikut sudah ada (dari konfigurasi sebelumnya):

- [ ] **Lazy loading halaman**: Semua halaman menggunakan `React.lazy()` + `Suspense` (dari `06-setup-routing.md`)
- [ ] **Vite code splitting**: `manualChunks` memisahkan vendor besar (dari `04-konfigurasi-vite.md`)
- [ ] **Tree shaking**: Lucide icons di-import per-ikon, bukan seluruh library
- [ ] **Image optimization**: Foto diupload sebagai WebP dengan batas ukuran file
- [ ] **Tailwind CSS purge**: Hanya class yang dipakai yang masuk bundle (otomatis di production)

### 3. Optimasi Tambahan

#### A. Memo-isasi Komponen Berat

```typescript
// Komponen yang me-render list panjang harus di-memo
import { memo } from 'react';

const OrderCard = memo(function OrderCard({ order }: { order: Order }) {
  // ... render card
});
```

Komponen yang perlu `memo`:
- `ChatBubble` — di-render banyak dalam list chat
- Order card di halaman History dan Incoming Orders
- `MitraMarkers` — di-render per marker di peta

#### B. Optimasi Re-render di Zustand

Pastikan setiap komponen hanya subscribe ke state yang dibutuhkan:

```typescript
// BENAR: hanya subscribe ke 1 field
const unreadCount = useNotificationStore((state) => state.unreadCount);

// SALAH: subscribe ke seluruh store (re-render di setiap perubahan)
const store = useNotificationStore();
```

#### C. Debounce pada Search Input

```typescript
import { useDeferredValue } from 'react';

// Di halaman admin users / search
const [searchInput, setSearchInput] = useState('');
const deferredSearch = useDeferredValue(searchInput);

// Gunakan deferredSearch untuk filter, bukan searchInput langsung
const filteredUsers = useMemo(() => {
  return users.filter(u => u.full_name.toLowerCase().includes(deferredSearch.toLowerCase()));
}, [users, deferredSearch]);
```

#### D. Prefetch Halaman yang Kemungkinan Dikunjungi

Di `vite.config.ts`, pastikan `modulePreload` sudah diaktifkan (sudah ada dari konfigurasi sebelumnya).

Di React, gunakan `useEffect` untuk prefetch route yang sering dikunjungi:

```typescript
// Di HomePage, prefetch OrderPage karena kemungkinan besar akan diklik
useEffect(() => {
  import('@/pages/user/OrderPage');
}, []);
```

#### E. Optimasi Gambar

Pastikan semua gambar yang diupload user dikompresi sebelum upload:

```typescript
// Tambahkan di src/lib/utils.ts
export async function compressImage(file: File, maxWidthPx: number = 1200): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidthPx) {
        height = (height * maxWidthPx) / width;
        width = maxWidthPx;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => resolve(blob!),
        'image/webp',
        0.8, // quality 80%
      );
    };
    img.src = URL.createObjectURL(file);
  });
}
```

Gunakan saat upload:
```typescript
const compressedBlob = await compressImage(file);
const compressedFile = new File([compressedBlob], file.name.replace(/\.[^.]+$/, '.webp'), {
  type: 'image/webp',
});
await uploadFile('damages', compressedFile);
```

### 4. Lighthouse Audit

1. Buka Chrome → navigasi ke halaman landing (`/`)
2. Buka DevTools (F12) → tab **Lighthouse**
3. Pilih kategori: **Performance**, **Accessibility**, **Best Practices**, **SEO**
4. Pilih device: **Mobile**
5. Klik **Analyze page load**

Target skor:
| Kategori | Target |
|---|---|
| Performance | ≥ 80 |
| Accessibility | ≥ 90 |
| Best Practices | ≥ 90 |
| SEO | ≥ 90 |

### 5. Perbaikan Berdasarkan Lighthouse

| Issue Umum | Perbaikan |
|---|---|
| LCP (Largest Contentful Paint) lambat | Pastikan hero text tidak di-block oleh font loading. Tambahkan `font-display: swap` di Google Fonts import |
| CLS (Cumulative Layout Shift) | Pastikan skeleton/placeholder punya dimensi yang sama dengan konten final |
| Unused JavaScript | Review lazy loading — pastikan halaman yang tidak aktif tidak ter-bundle |
| Missing alt text | Pastikan semua `<img>` punya atribut `alt` |
| Missing meta description | Sudah ada di `index.html` |
| Touch target size | Pastikan semua tombol minimal 44×44px |

---

## Validasi

- [ ] `npm run build` berhasil tanpa error
- [ ] Bundle total < 500 KB gzip
- [ ] Lighthouse Performance ≥ 80 (mobile)
- [ ] Lighthouse Accessibility ≥ 90
- [ ] Tidak ada warning "unused import" atau "missing dependency" di console
- [ ] Halaman load dalam < 3 detik di koneksi 3G (Chrome DevTools throttling)

---

**Selesai? Lanjut ke folder `14-deployment/` → file `01-setup-vercel.md`**

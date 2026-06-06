# 02 - Halaman Landing Page

## Tujuan
Membangun halaman landing page yang menarik untuk guest mode (tanpa login).

---

## Instruksi

**EDIT FILE**: `src/pages/public/LandingPage.tsx`

**Ganti seluruh isi file** dengan halaman landing yang memiliki:

### Struktur Halaman

1. **Hero Section** (bagian atas)
   - Judul besar: gunakan key i18n `landing.hero_title` + `landing.hero_subtitle`
   - Deskripsi: gunakan key `landing.hero_description`
   - 2 tombol CTA:
     - Tombol primary "Mulai Sekarang" → navigasi ke `/register`
     - Tombol secondary "Sudah Punya Akun?" → navigasi ke `/login`
   - Background: gradient tipis dari primary ke primary-light
   - Animasi: teks dan tombol muncul bertahap menggunakan `StaggerContainer` + `StaggerItem`

2. **Features Section** (4 fitur)
   - Grid 2x2 di mobile, 4 kolom di desktop
   - Setiap fitur: icon dari Lucide + judul + deskripsi
   - Icon suggestion: `Zap` (Cepat), `MapPin` (GPS), `Banknote` (Transparan), `MessageSquare` (Chat)
   - Gunakan key i18n: `landing.feature_1_title`, `landing.feature_1_desc`, dst.
   - Animasi: card hover lift

3. **How It Works Section** (3 langkah)
   - Stepper visual: 1 → 2 → 3
   - Langkah 1: "Isi form darurat"
   - Langkah 2: "Negosiasi dengan mekanik"
   - Langkah 3: "Mekanik datang ke lokasimu"

4. **Footer**
   - Teks sederhana: "BeLink 2024. Platform layanan darurat kendaraan."

### Spesifikasi Desain

- **Mobile-first**: Hero section fullscreen di mobile (min-h-screen)
- **Background**: `bg-surface-light dark:bg-surface-dark`
- **Font judul hero**: `text-4xl sm:text-5xl lg:text-6xl font-extrabold`
- **Gradient text**: judul "BeLink" menggunakan class `text-gradient-primary`
- **CTA button**: ukuran `lg`, full width di mobile
- **Feature cards**: menggunakan komponen `Card` dengan `hover` prop
- **Transisi halaman**: bungkus seluruh konten dengan `<PageTransition>`

### Import yang Dibutuhkan

```typescript
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, MapPin, Banknote, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
```

### Catatan Penting

- **JANGAN** menggunakan emoji keyboard untuk icon. Gunakan Lucide React.
- Pastikan halaman ini bisa diakses tanpa login (guest mode)
- Pastikan responsif: test di viewport 375px (mobile) dan 1280px (desktop)
- Dark mode harus terlihat bagus juga

---

## Validasi

- [ ] Buka `http://localhost:5173/` — halaman landing muncul
- [ ] Hero section terlihat dengan 2 tombol CTA
- [ ] Features section menampilkan 4 fitur dalam grid
- [ ] Klik "Mulai Sekarang" → navigasi ke `/register`
- [ ] Klik "Sudah Punya Akun?" → navigasi ke `/login`
- [ ] Tampilan responsif di mobile dan desktop
- [ ] Animasi muncul saat scroll

---

**Selesai? Lanjut ke `03-halaman-register.md`**

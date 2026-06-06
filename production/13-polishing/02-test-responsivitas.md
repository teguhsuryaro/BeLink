# 02 - Test Responsivitas

## Tujuan
Memastikan seluruh halaman tampil dengan baik di semua ukuran layar.

---

## Breakpoint yang Digunakan (Tailwind default)

| Breakpoint | Min-Width | Device |
|---|---|---|
| (default) | 0px | Mobile kecil (iPhone SE) |
| `sm` | 640px | Mobile besar (iPhone Pro Max) |
| `md` | 768px | Tablet |
| `lg` | 1024px | Laptop kecil |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Desktop besar |

## Cara Test

1. Buka Chrome DevTools (F12)
2. Klik ikon device toolbar (Ctrl+Shift+M)
3. Test di viewport berikut:
   - **375px** (iPhone SE) — Mobile kecil
   - **390px** (iPhone 14) — Mobile standar
   - **430px** (iPhone 14 Pro Max) — Mobile besar
   - **768px** (iPad) — Tablet
   - **1024px** (iPad Pro / Laptop kecil)
   - **1280px** (Desktop standar)
   - **1920px** (Desktop besar)

## Checklist Per Halaman

### Landing Page
- [ ] 375px: Hero section fullscreen, tombol CTA full width, features 2 kolom
- [ ] 768px: Features 2 kolom, How it works horizontal
- [ ] 1280px: Features 4 kolom, hero side-by-side (opsional)

### Login / Register
- [ ] 375px: Card full width dengan padding, form fields stacked
- [ ] 768px+: Card centered, max-w-sm

### Home Page (User)
- [ ] 375px: Stats 2 kolom, quick action card full width
- [ ] 768px: Stats 2 kolom, riwayat terbaru sebagai list
- [ ] 1280px: Stats 4 kolom

### Order Form (Wizard)
- [ ] 375px: Step indicator compact, form fields full width, peta full width
- [ ] 768px: Form max-w-2xl centered
- [ ] 1280px: Form max-w-2xl, peta lebih besar

### Active Order
- [ ] 375px: Peta 40% atas, detail scroll di bawah, tab chat/status
- [ ] 1280px: Peta kiri 60%, detail kanan 40%

### History
- [ ] 375px: Cards full width, stacked
- [ ] 768px+: Cards max-w-3xl centered

### Profile
- [ ] 375px: Cards full width, avatar centered
- [ ] 768px+: max-w-lg centered

### Mitra Dashboard
- [ ] 375px: Mobile header + hamburger → slide-in sidebar
- [ ] 768px+: Sidebar visible, collapsible

### Admin Dashboard
- [ ] 375px: Mobile header + hamburger → slide-in sidebar
- [ ] 768px+: Sidebar visible, collapsible

### Navigation
- [ ] 375px: Bottom nav visible, desktop nav hidden
- [ ] 768px+: Desktop nav visible, bottom nav hidden

---

## Perbaikan Umum Jika Ada Issue

```css
/* Teks terpotong */
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* Gambar overflow */
img { max-width: 100%; height: auto; }

/* Scroll horizontal tidak diinginkan */
.overflow-hidden { overflow: hidden; }
.overflow-x-auto { overflow-x: auto; } /* Hanya untuk elemen tertentu */
```

---

## Validasi

- [ ] Tidak ada horizontal scroll pada body di semua viewport
- [ ] Tidak ada teks yang terpotong tanpa ellipsis
- [ ] Tidak ada elemen yang overflow di luar layar
- [ ] Bottom nav muncul di mobile, desktop nav muncul di desktop
- [ ] Semua form bisa diisi dan disubmit di mobile

---

**Selesai? Lanjut ke `03-test-dark-light-mode.md`**

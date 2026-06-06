# 03 - Test Dark / Light Mode

## Tujuan
Memastikan dark mode dan light mode tampil konsisten di seluruh halaman.

---

## Checklist Per Elemen

### Background
- [ ] Light: `bg-surface-light` (#F8F9FF — biru sangat muda)
- [ ] Dark: `bg-surface-dark` (#0F172A — navy gelap)
- [ ] Tidak ada area yang tetap putih/hitam di mode yang salah

### Cards
- [ ] Light: `bg-card-light` (#FFFFFF) + `border-border-light` + shadow soft
- [ ] Dark: `bg-card-dark` (#1E293B) + `border-border-dark` + shadow dark

### Teks
- [ ] Light primary: `text-text-primary-light` (#111827)
- [ ] Dark primary: `text-text-primary-dark` (#F8FAFC)
- [ ] Light muted: `text-text-muted-light` (#6B7280)
- [ ] Dark muted: `text-text-muted-dark` (#94A3B8)
- [ ] Tidak ada teks yang hilang/invisible di salah satu mode

### Input / Form
- [ ] Light: bg putih, border gray, focus ring primary
- [ ] Dark: bg card-dark, border border-dark, focus ring primary
- [ ] Placeholder text terlihat di kedua mode

### Buttons
- [ ] Primary button: sama di kedua mode (bg-primary, text-white)
- [ ] Secondary/Outline: border dan text menyesuaikan mode
- [ ] Ghost button: hover bg menyesuaikan mode

### Navigation
- [ ] Desktop nav: backdrop blur, border bawah, bg sesuai mode
- [ ] Mobile nav: backdrop blur, border atas, bg sesuai mode
- [ ] Sidebar: bg dan border sesuai mode

### Modals
- [ ] Overlay: `bg-black/40` (sama di kedua mode)
- [ ] Modal content: bg-card sesuai mode
- [ ] Close button: terlihat di kedua mode

### Badges & Status
- [ ] Badge warna tetap konsisten (primary, success, warning, danger)
- [ ] Background badge transparan menyesuaikan mode

### Peta (Leaflet)
- [ ] Peta tetap terang di kedua mode (tile OSM tidak berubah — ini normal)
- [ ] Border peta menyesuaikan mode
- [ ] Popup peta: tidak ada custom dark mode (biarkan default)

### Chat
- [ ] Bubble sendiri: bg-primary (sama di kedua mode)
- [ ] Bubble lawan: bg-gray-100 (light) / bg-gray-800 (dark)
- [ ] Input chat: bg dan border menyesuaikan mode

---

## Cara Test

1. Login ke aplikasi
2. Toggle tema via profil atau langsung di console:
   ```javascript
   document.documentElement.classList.toggle('dark');
   ```
3. Periksa setiap halaman di kedua mode
4. Screenshot jika perlu untuk perbandingan

---

## Perbaikan Umum

Jika ada elemen yang tidak berubah di dark mode, pastikan menggunakan pattern:

```html
<!-- BENAR: punya dark variant -->
<div class="bg-card-light dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark">

<!-- SALAH: tidak ada dark variant -->
<div class="bg-white text-gray-900">
```

---

## Validasi

- [ ] Tidak ada teks yang hilang di dark mode
- [ ] Tidak ada background yang tetap putih di dark mode
- [ ] Tidak ada kontras yang terlalu rendah (teks sulit dibaca)
- [ ] Toggle tema terasa instan (tidak ada flash)

---

**Selesai? Lanjut ke `04-test-i18n.md`**

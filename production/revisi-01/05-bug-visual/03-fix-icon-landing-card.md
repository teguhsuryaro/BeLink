# 03 — Fix Icon Landing Card ("Kenapa Memilih BeLink?")

## Tujuan
Memperbaiki ketidakstabilan posisi icon, judul, dan deskripsi di dalam komponen Card pada *Landing Page*.

---

## File yang Dimodifikasi

### `src/components/ui/Card.tsx`
atau *override styles* langsung di `src/pages/public/LandingPage.tsx`

---

## Akar Masalah

Komponen `<CardHeader>` memiliki *default class* `flex items-center justify-between` di `src/components/ui/Card.tsx` (baris 46).
Pada `LandingPage.tsx`, *header* ini diisi dengan icon `div`, `<CardTitle>`, dan `<CardDescription>`.

Akibatnya, flexbox mendistribusikan ketiga elemen secara horizontal, bukan vertikal (stacking), yang membuat tampilan berantakan dan tidak konsisten.

---

## Langkah Perbaikan

### Opsi A: Fix di LandingPage (Paling Aman)

Ubah struktur di `LandingPage.tsx` (baris 74-120), jangan bungkus konten dengan `<CardHeader>`, melainkan letakkan langsung di dalam `<Card>` atau ganti elemen.

**Sebelum:**
```tsx
<Card hover className="h-full">
  <CardHeader>
    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <MapPin className="h-6 w-6" />
    </div>
    <CardTitle>Akurat & Cepat</CardTitle>
    <CardDescription>Deteksi lokasi GPS untuk menemukan mekanik terdekat secara instan.</CardDescription>
  </CardHeader>
</Card>
```

**Sesudah:**
```tsx
<Card hover className="h-full flex flex-col p-6">
  <div className="mb-4 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
    <MapPin className="h-6 w-6" />
  </div>
  <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
    Akurat & Cepat
  </h3>
  <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
    Deteksi lokasi GPS untuk menemukan mekanik terdekat secara instan.
  </p>
</Card>
```
*(Ulangi pola di atas untuk ke-4 Card yang ada di LandingPage)*

---

## Validasi

- [ ] Buka Landing Page (`/`).
- [ ] Scroll ke *section* "Kenapa Memilih BeLink?".
- [ ] Pastikan posisi icon berada di kiri/atas, judul di bawahnya, dan deskripsi di bawah judul, dengan struktur vertikal.
- [ ] Responsif dari *mobile* hingga *desktop*.

---

**Selesai? Lanjut ke `04-audit-visual-umum.md`**

# 01 - Review Animasi dan Loading

## Tujuan
Memastikan semua animasi dan loading state terasa smooth dan tidak mengganggu UX.

---

## Checklist Review

### Transisi Halaman
- [ ] Setiap halaman dibungkus `<PageTransition>` — fade + slide up
- [ ] Navigasi antar halaman tidak "loncat" (tidak ada flash of content)
- [ ] Lazy loading: `<Suspense fallback={<PageLoader />}>` menampilkan spinner saat chunk dimuat

### Loading States
- [ ] Setiap data fetch menampilkan `Skeleton` atau `Spinner` saat loading — **BUKAN** halaman kosong
- [ ] Home page: `SkeletonCard` untuk stats
- [ ] History page: `SkeletonListItem` untuk list order
- [ ] Dashboard mitra: skeleton untuk stats cards
- [ ] Admin dashboard: skeleton untuk angka-angka stats
- [ ] Profile: avatar skeleton saat upload

### Tombol Loading
- [ ] Setiap tombol yang memicu async action (submit, update status, dll) menampilkan `isLoading` state
- [ ] Tombol disabled saat loading — tidak bisa double-click
- [ ] Teks tombol berubah saat loading (misal: "Kirim" → spinner + "Mengirim...")

### Animasi
- [ ] `StaggerContainer` + `StaggerItem` pada list/grid items
- [ ] Tab indicator: `layoutId` menggunakan Framer Motion (sliding bar)
- [ ] Mobile nav indicator: `layoutId` sliding indicator
- [ ] Modal: scale + fade animasi menggunakan Framer Motion
- [ ] Toast: slide in dari atas
- [ ] Button: `whileTap={{ scale: 0.96 }}`
- [ ] Star rating: `whileTap={{ scale: 1.3 }}`
- [ ] Toggle switch: spring animation pada knob

### Yang Harus DIHINDARI
- [ ] **Tidak ada** animasi yang berlangsung > 500ms (terlalu lambat)
- [ ] **Tidak ada** animasi bouncing/spring berlebihan (profesional, bukan playful)
- [ ] **Tidak ada** efek parallax atau scroll-triggered animation yang berat
- [ ] **Tidak ada** flash of unstyled content (FOUC)

---

## Perbaikan Jika Ditemukan Issue

Jika ada halaman tanpa loading state:
```typescript
// Tambahkan ini di setiap halaman yang memiliki data fetch:
if (isLoading) {
  return (
    <PageTransition>
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </PageTransition>
  );
}
```

Jika ada tombol tanpa loading state:
```typescript
// Tambahkan isLoading prop:
<Button isLoading={mutation.isPending}>
  Submit
</Button>
```

---

## Validasi

- [ ] Navigasi antar halaman terasa smooth (no flicker, no flash)
- [ ] Setiap loading state terlihat saat koneksi lambat (test dengan Chrome DevTools → Network → Slow 3G)
- [ ] Tidak ada infinite spinner (semua loading state punya timeout atau error handling)
- [ ] Animasi terasa natural dan tidak mengganggu

---

**Selesai? Lanjut ke `02-test-responsivitas.md`**

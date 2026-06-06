# 04 - App Layout

## Tujuan
Membuat layout wrapper utama yang menggabungkan DesktopNav dan MobileNav.

---

## Buat File

**BUAT FILE**: `src/components/layout/AppLayout.tsx`

```typescript
import { Outlet } from 'react-router-dom';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';

/**
 * Layout utama untuk halaman user yang sudah login.
 * - Desktop: topbar di atas + konten di bawah
 * - Mobile: konten + bottom nav di bawah
 */
export function AppLayout() {
  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      {/* Desktop Navigation */}
      <DesktopNav />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-4 md:px-6 md:pb-8 md:pt-20">
        <Outlet />
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
```

---

## Validasi

- [ ] File `src/components/layout/AppLayout.tsx` sudah ada
- [ ] Menggunakan `<Outlet />` dari React Router untuk render halaman child

---

**Selesai? Lanjut ke `05-dashboard-layout.md`**

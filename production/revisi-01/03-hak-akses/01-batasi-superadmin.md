# 01 — Batasi Superadmin Hanya ke Panel Admin

## Tujuan
Memastikan superadmin hanya bisa mengakses route `/admin/*` dan tidak bisa masuk ke panel user atau mitra.

---

## File yang Dimodifikasi

### 1. `src/router/index.tsx`
### 2. `src/router/ProtectedRoute.tsx`

---

## Akar Masalah

Di `src/router/index.tsx` baris 76-88, User Routes menggunakan:
```tsx
<Route element={<ProtectedRoute />}>  {/* tanpa allowedRoles */}
```

`ProtectedRoute` tanpa `allowedRoles` mengizinkan **semua user yang login** — termasuk superadmin. Ini berarti superadmin bisa mengakses `/home`, `/order`, `/history`, `/profile`, bahkan membuat pesanan.

---

## Langkah Perbaikan

### Opsi A: Modifikasi `ProtectedRoute.tsx` (RECOMMENDED)

Tambahkan logika redirect khusus superadmin di `ProtectedRoute`:

**Di `src/router/ProtectedRoute.tsx`**, setelah cek `allowedRoles` (baris 42-44), tambahkan:

```typescript
// Superadmin hanya boleh akses admin routes
// Jika superadmin mencoba akses route non-admin, redirect ke admin dashboard
if (profile.role === 'superadmin' && !allowedRoles?.includes('superadmin')) {
  return <Navigate to="/admin/dashboard" replace />;
}
```

**Kode lengkap setelah modifikasi:**

```typescript
export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { session, profile, isLoading, isInitialized } = useAuthStore();

  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-light dark:bg-surface-dark">
        <Spinner size="lg" text="Memuat..." />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-light dark:bg-surface-dark">
        <Spinner size="lg" text="Memuat profil..." />
      </div>
    );
  }

  // ⭐ BARU: Superadmin hanya boleh akses admin panel
  if (profile.role === 'superadmin' && !allowedRoles?.includes('superadmin')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Cek role jika diperlukan
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
```

### Opsi B: Tambahkan `allowedRoles` di Router (Alternatif)

Di `src/router/index.tsx`, ubah User Routes dari:
```tsx
<Route element={<ProtectedRoute />}>
```

Menjadi:
```tsx
<Route element={<ProtectedRoute allowedRoles={['user', 'mitra_independen', 'mitra_bengkel']} />}>
```

> ⚠️ Opsi A lebih disarankan karena lebih deklaratif dan tidak perlu mengubah banyak route definitions.

---

## Perilaku Setelah Fix

| Aksi | Sebelum | Sesudah |
|------|---------|---------|
| Admin buka `/home` | ✅ Bisa | ❌ Redirect ke `/admin/dashboard` |
| Admin buka `/order` | ✅ Bisa | ❌ Redirect ke `/admin/dashboard` |
| Admin buka `/mitra/dashboard` | ❌ Redirect `/home` | ❌ Redirect `/admin/dashboard` |
| Admin buka `/admin/dashboard` | ✅ Bisa | ✅ Bisa |
| User buka `/admin/dashboard` | ❌ Redirect `/home` | ❌ Redirect `/home` |

---

## Validasi

- [ ] Login sebagai superadmin → otomatis redirect ke `/admin/dashboard`
- [ ] Superadmin ketik manual `/home` di URL → redirect ke `/admin/dashboard`
- [ ] Superadmin ketik manual `/order` di URL → redirect ke `/admin/dashboard`
- [ ] Superadmin ketik manual `/mitra/dashboard` di URL → redirect ke `/admin/dashboard`
- [ ] User biasa tetap bisa akses `/home`, `/order`, dll
- [ ] Mitra tetap bisa akses `/mitra/dashboard`
- [ ] User dan mitra TIDAK bisa akses `/admin/*`

---

**Selesai? Lanjut ke folder `04-simulasi-order/`**

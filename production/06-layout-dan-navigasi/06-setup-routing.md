# 06 - Setup Routing

## Tujuan
Membuat konfigurasi routing lengkap dengan ProtectedRoute, PublicRoute, dan semua definisi routes.

---

## Langkah-Langkah

### 1. Buat ProtectedRoute

**BUAT FILE**: `src/router/ProtectedRoute.tsx`

```typescript
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '@/components/ui/Spinner';
import type { UserRole } from '@/types/user.types';

interface ProtectedRouteProps {
  /** Role yang diizinkan mengakses route ini */
  allowedRoles?: UserRole[];
}

/**
 * Guard route yang memerlukan autentikasi.
 * Jika user belum login, redirect ke halaman login.
 * Jika role tidak sesuai, redirect ke home.
 */
export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { session, profile, isLoading, isInitialized } = useAuthStore();

  // Masih loading — tampilkan spinner
  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-light dark:bg-surface-dark">
        <Spinner size="lg" text="Memuat..." />
      </div>
    );
  }

  // Belum login — redirect ke login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Profil belum termuat — tunggu
  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-light dark:bg-surface-dark">
        <Spinner size="lg" text="Memuat profil..." />
      </div>
    );
  }

  // Cek role jika diperlukan
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/home" replace />;
  }

  // User terautentikasi dan role sesuai
  return <Outlet />;
}
```

### 2. Buat PublicRoute

**BUAT FILE**: `src/router/PublicRoute.tsx`

```typescript
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '@/components/ui/Spinner';

/**
 * Route yang hanya bisa diakses oleh user yang BELUM login.
 * Jika sudah login, redirect ke home.
 */
export function PublicRoute() {
  const { session, isLoading, isInitialized } = useAuthStore();

  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-light dark:bg-surface-dark">
        <Spinner size="lg" text="Memuat..." />
      </div>
    );
  }

  // Sudah login — redirect ke home
  if (session) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
```

### 3. Buat Router Utama (Ganti Placeholder)

**EDIT FILE**: `src/router/index.tsx`

**Ganti seluruh isi file** dengan:

```typescript
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { Spinner } from '@/components/ui/Spinner';

// ============================================
// LAZY LOADED PAGES
// Setiap halaman di-lazy load agar bundle awal kecil
// ============================================

// Public Pages
const LandingPage = lazy(() => import('@/pages/public/LandingPage'));
const LoginPage = lazy(() => import('@/pages/public/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/public/RegisterPage'));

// User Pages
const HomePage = lazy(() => import('@/pages/user/HomePage'));
const OrderPage = lazy(() => import('@/pages/user/OrderPage'));
const ActiveOrderPage = lazy(() => import('@/pages/user/ActiveOrderPage'));
const HistoryPage = lazy(() => import('@/pages/user/HistoryPage'));
const ProfilePage = lazy(() => import('@/pages/user/ProfilePage'));
const RegisterMitraPage = lazy(() => import('@/pages/user/RegisterMitraPage'));

// Mitra Pages
const MitraDashboard = lazy(() => import('@/pages/mitra/MitraDashboard'));
const IncomingOrdersPage = lazy(() => import('@/pages/mitra/IncomingOrdersPage'));
const ActiveNegotiationPage = lazy(() => import('@/pages/mitra/ActiveNegotiationPage'));
const MitraHistoryPage = lazy(() => import('@/pages/mitra/MitraHistoryPage'));
const DepositPage = lazy(() => import('@/pages/mitra/DepositPage'));
const MitraProfilePage = lazy(() => import('@/pages/mitra/MitraProfilePage'));

// Admin Pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const UsersManagementPage = lazy(() => import('@/pages/admin/UsersManagementPage'));
const MitraVerificationPage = lazy(() => import('@/pages/admin/MitraVerificationPage'));
const ReportsPage = lazy(() => import('@/pages/admin/ReportsPage'));
const StatisticsPage = lazy(() => import('@/pages/admin/StatisticsPage'));

// Error
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// ============================================
// LOADING FALLBACK
// ============================================
function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size="lg" text="Memuat halaman..." />
    </div>
  );
}

// ============================================
// ROUTER
// ============================================
export default function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* ========== USER ROUTES ========== */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/order/:orderId" element={<ActiveOrderPage />} />
              <Route path="/messages" element={<HomePage />} /> {/* Placeholder — redirect ke active order chat */}
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/notifications" element={<HomePage />} /> {/* Placeholder */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/register-mitra" element={<RegisterMitraPage />} />
            </Route>
          </Route>

          {/* ========== MITRA ROUTES ========== */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={['mitra_independen', 'mitra_bengkel', 'superadmin']}
              />
            }
          >
            <Route element={<DashboardLayout type="mitra" />}>
              <Route path="/mitra/dashboard" element={<MitraDashboard />} />
              <Route path="/mitra/orders" element={<IncomingOrdersPage />} />
              <Route path="/mitra/orders/:orderId" element={<ActiveNegotiationPage />} />
              <Route path="/mitra/history" element={<MitraHistoryPage />} />
              <Route path="/mitra/deposit" element={<DepositPage />} />
              <Route path="/mitra/profile" element={<MitraProfilePage />} />
            </Route>
          </Route>

          {/* ========== ADMIN ROUTES ========== */}
          <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
            <Route element={<DashboardLayout type="admin" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UsersManagementPage />} />
              <Route path="/admin/verification" element={<MitraVerificationPage />} />
              <Route path="/admin/reports" element={<ReportsPage />} />
              <Route path="/admin/statistics" element={<StatisticsPage />} />
            </Route>
          </Route>

          {/* ========== CATCH ALL ========== */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}
```

### 4. Buat Placeholder Pages

Agar router tidak error karena halaman belum ada, buat placeholder untuk setiap page. Setiap placeholder akan diganti di folder-folder berikutnya.

**PERINTAH** — Buat semua placeholder pages sekaligus.

Untuk setiap file di bawah, buat file dengan konten yang sama (hanya teks placeholder berubah):

**BUAT FILE**: `src/pages/public/LandingPage.tsx`

```typescript
import { PageTransition } from '@/components/layout/PageTransition';

export default function LandingPage() {
  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold text-primary">Landing Page</h1>
      </div>
    </PageTransition>
  );
}
```

Buat file yang sama dengan pola di atas untuk semua halaman berikut (ganti nama fungsi dan teks):

| File Path | Nama Fungsi | Teks |
|---|---|---|
| `src/pages/public/LoginPage.tsx` | `LoginPage` | `Login Page` |
| `src/pages/public/RegisterPage.tsx` | `RegisterPage` | `Register Page` |
| `src/pages/user/HomePage.tsx` | `HomePage` | `Home Page` |
| `src/pages/user/OrderPage.tsx` | `OrderPage` | `Order Page` |
| `src/pages/user/ActiveOrderPage.tsx` | `ActiveOrderPage` | `Active Order Page` |
| `src/pages/user/HistoryPage.tsx` | `HistoryPage` | `History Page` |
| `src/pages/user/ProfilePage.tsx` | `ProfilePage` | `Profile Page` |
| `src/pages/user/RegisterMitraPage.tsx` | `RegisterMitraPage` | `Register Mitra Page` |
| `src/pages/mitra/MitraDashboard.tsx` | `MitraDashboard` | `Mitra Dashboard` |
| `src/pages/mitra/IncomingOrdersPage.tsx` | `IncomingOrdersPage` | `Incoming Orders Page` |
| `src/pages/mitra/ActiveNegotiationPage.tsx` | `ActiveNegotiationPage` | `Active Negotiation Page` |
| `src/pages/mitra/MitraHistoryPage.tsx` | `MitraHistoryPage` | `Mitra History Page` |
| `src/pages/mitra/DepositPage.tsx` | `DepositPage` | `Deposit Page` |
| `src/pages/mitra/MitraProfilePage.tsx` | `MitraProfilePage` | `Mitra Profile Page` |
| `src/pages/admin/AdminDashboard.tsx` | `AdminDashboard` | `Admin Dashboard` |
| `src/pages/admin/UsersManagementPage.tsx` | `UsersManagementPage` | `Users Management Page` |
| `src/pages/admin/MitraVerificationPage.tsx` | `MitraVerificationPage` | `Mitra Verification Page` |
| `src/pages/admin/ReportsPage.tsx` | `ReportsPage` | `Reports Page` |
| `src/pages/admin/StatisticsPage.tsx` | `StatisticsPage` | `Statistics Page` |
| `src/pages/NotFoundPage.tsx` | `NotFoundPage` | `404 - Halaman Tidak Ditemukan` |

Setiap file mengikuti template yang sama:

```typescript
import { PageTransition } from '@/components/layout/PageTransition';

export default function NamaFungsi() {
  return (
    <PageTransition>
      <div className="flex min-h-[60vh] items-center justify-center">
        <h1 className="text-2xl font-bold text-primary">Teks Placeholder</h1>
      </div>
    </PageTransition>
  );
}
```

---

## Validasi

- [ ] File `src/router/ProtectedRoute.tsx` sudah ada
- [ ] File `src/router/PublicRoute.tsx` sudah ada
- [ ] File `src/router/index.tsx` sudah diedit (bukan placeholder lagi)
- [ ] Semua 20 file placeholder pages sudah ada
- [ ] Jalankan `npm run dev`:
  - Buka `http://localhost:5173` → terlihat Landing Page placeholder
  - Buka `http://localhost:5173/login` → terlihat Login Page placeholder
  - Buka `http://localhost:5173/abcdef` → redirect ke 404
  - Tidak ada error di console browser

---

## Catatan

- Semua halaman di-lazy load (`lazy(() => import(...))`) — artinya browser hanya mendownload kode halaman saat halaman tersebut pertama kali dikunjungi. Ini membuat load awal lebih cepat.
- `AnimatePresence mode="wait"` memastikan animasi keluar halaman lama selesai dulu sebelum halaman baru masuk.
- Placeholder pages akan diganti satu per satu di folder `07-autentikasi`, `08-fitur-user`, dst.

---

**Selesai? Lanjut ke folder `07-autentikasi/` → file `01-auth-hooks-dan-store.md`**

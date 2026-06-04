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

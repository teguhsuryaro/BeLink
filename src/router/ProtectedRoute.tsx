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

  // Superadmin hanya boleh akses admin panel
  if (profile.role === 'superadmin' && !allowedRoles?.includes('superadmin')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Cek role jika diperlukan
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/home" replace />;
  }

  // User terautentikasi dan role sesuai
  return <Outlet />;
}

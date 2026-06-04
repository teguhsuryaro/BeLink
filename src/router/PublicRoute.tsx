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

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

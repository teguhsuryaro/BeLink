# 05 - Dashboard Layout

## Tujuan
Membuat layout khusus dashboard untuk mitra dan admin dengan sidebar collapsible di desktop.

---

## Buat File

**BUAT FILE**: `src/components/layout/DashboardLayout.tsx`

```typescript
import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Inbox,
  Clock,
  Wallet,
  User,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Wrench,
  Shield,
  Users,
  CheckCircle2,
  Flag,
  BarChart3,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { Avatar } from '@/components/ui/Avatar';

interface SidebarItem {
  labelKey: string;
  path: string;
  icon: React.ElementType;
}

const mitraNavItems: SidebarItem[] = [
  { labelKey: 'nav.dashboard', path: '/mitra/dashboard', icon: LayoutDashboard },
  { labelKey: 'nav.orders', path: '/mitra/orders', icon: Inbox },
  { labelKey: 'nav.history', path: '/mitra/history', icon: Clock },
  { labelKey: 'nav.deposit', path: '/mitra/deposit', icon: Wallet },
  { labelKey: 'nav.profile', path: '/mitra/profile', icon: User },
];

const adminNavItems: SidebarItem[] = [
  { labelKey: 'nav.dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { labelKey: 'nav.users', path: '/admin/users', icon: Users },
  { labelKey: 'nav.verification', path: '/admin/verification', icon: CheckCircle2 },
  { labelKey: 'nav.reports', path: '/admin/reports', icon: Flag },
  { labelKey: 'nav.statistics', path: '/admin/statistics', icon: BarChart3 },
];

interface DashboardLayoutProps {
  type: 'mitra' | 'admin';
}

export function DashboardLayout({ type }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const profile = useAuthStore((state) => state.profile);

  const navItems = type === 'mitra' ? mitraNavItems : adminNavItems;
  const titleIcon = type === 'mitra' ? Wrench : Shield;
  const TitleIcon = titleIcon;
  const titleLabel = type === 'mitra' ? 'Mitra Panel' : 'Admin Panel';

  if (!profile) return null;

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border-light px-4 py-4 dark:border-border-dark">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
          <TitleIcon className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark"
          >
            {titleLabel}
          </motion.span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                isActive
                  ? 'bg-primary-muted text-primary dark:bg-primary/15'
                  : 'text-text-muted-light hover:bg-gray-100 hover:text-text-primary-light dark:text-text-muted-dark dark:hover:bg-gray-800 dark:hover:text-text-primary-dark',
                collapsed && 'justify-center px-2',
              )}
              title={collapsed ? t(item.labelKey) : undefined}
            >
              <Icon className={cn('h-5 w-5 shrink-0', isActive && 'text-primary')} />
              {!collapsed && <span>{t(item.labelKey)}</span>}
            </button>
          );
        })}
      </nav>

      {/* Back to app */}
      <div className="border-t border-border-light p-3 dark:border-border-dark">
        <button
          onClick={() => navigate('/home')}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
            'text-text-muted-light hover:bg-gray-100 hover:text-text-primary-light',
            'dark:text-text-muted-dark dark:hover:bg-gray-800 dark:hover:text-text-primary-dark',
            'transition-colors duration-200',
            collapsed && 'justify-center px-2',
          )}
        >
          <ArrowLeft className="h-5 w-5 shrink-0" />
          {!collapsed && <span>{t('action.back')}</span>}
        </button>
      </div>

      {/* User Info */}
      <div className="border-t border-border-light p-3 dark:border-border-dark">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <Avatar src={profile.avatar_url} name={profile.full_name} size="sm" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                {profile.full_name}
              </p>
              <p className="truncate text-xs text-text-muted-light dark:text-text-muted-dark">
                {profile.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex md:flex-col',
          'fixed left-0 top-0 bottom-0 z-30',
          'border-r border-border-light bg-card-light',
          'dark:border-border-dark dark:bg-card-dark',
          'transition-all duration-300',
          collapsed ? 'w-[72px]' : 'w-64',
        )}
      >
        {sidebarContent}

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'absolute -right-3 top-20 z-10',
            'flex h-6 w-6 items-center justify-center rounded-full',
            'border border-border-light bg-card-light shadow-soft',
            'dark:border-border-dark dark:bg-card-dark dark:shadow-dark-soft',
            'text-text-muted-light hover:text-text-primary-light',
            'dark:text-text-muted-dark dark:hover:text-text-primary-dark',
            'transition-colors duration-200',
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      </aside>

      {/* Mobile Header */}
      <div className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center justify-between border-b border-border-light bg-card-light/90 px-4 backdrop-blur-xl dark:border-border-dark dark:bg-card-dark/90 md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-text-muted-light hover:bg-gray-100 dark:text-text-muted-dark dark:hover:bg-gray-800"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
          {titleLabel}
        </span>
        <Avatar src={profile.avatar_url} name={profile.full_name} size="sm" />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 bottom-0 z-50 flex w-64 flex-col border-r border-border-light bg-card-light dark:border-border-dark dark:bg-card-dark md:hidden"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-3 rounded-lg p-1.5 text-text-muted-light hover:bg-gray-100 dark:text-text-muted-dark dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 transition-all duration-300',
          'pt-14 md:pt-0',
          'pb-8 px-4 md:px-8',
          collapsed ? 'md:ml-[72px]' : 'md:ml-64',
        )}
      >
        <div className="mx-auto max-w-6xl py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
```

---

## Validasi

- [ ] File `src/components/layout/DashboardLayout.tsx` sudah ada
- [ ] Props `type` mendukung `'mitra'` dan `'admin'`
- [ ] Sidebar collapsible di desktop, slide-in drawer di mobile

---

**Selesai? Lanjut ke `06-setup-routing.md`**

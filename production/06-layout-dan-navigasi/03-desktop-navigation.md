# 03 - Desktop Navigation

## Tujuan
Membuat topbar navigation untuk desktop dengan logo, notifikasi, dan avatar dropdown.

---

## Buat File

**BUAT FILE**: `src/components/layout/DesktopNav.tsx`

```typescript
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  Bell,
  LogOut,
  Moon,
  Sun,
  Settings,
  User,
  Wrench,
  Shield,
  Home,
  Clock,
  MessageSquare,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { useNotificationStore } from '@/store/notificationStore';

const navLinks = [
  { labelKey: 'nav.home', path: '/home', icon: Home },
  { labelKey: 'nav.messages', path: '/messages', icon: MessageSquare },
  { labelKey: 'nav.history', path: '/history', icon: Clock },
];

export function DesktopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { profile, signOut } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'id' ? 'en' : 'id';
    i18n.changeLanguage(newLang);
  };

  if (!profile) return null;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40',
        'hidden md:block',
        'border-b border-border-light bg-card-light/90 backdrop-blur-xl',
        'dark:border-border-dark dark:bg-card-dark/90',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Wrench className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Be<span className="text-primary">Link</span>
          </span>
        </button>

        {/* Nav Links */}
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            const Icon = link.icon;

            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={cn(
                  'relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'text-primary'
                    : 'text-text-muted-light hover:text-text-primary-light dark:text-text-muted-dark dark:hover:text-text-primary-dark',
                )}
              >
                <Icon className="h-4 w-4" />
                {t(link.labelKey)}
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav-indicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-text-muted-light transition-colors hover:bg-gray-100 dark:text-text-muted-dark dark:hover:bg-gray-800"
            title={i18n.language === 'id' ? 'Switch to English' : 'Ganti ke Indonesia'}
          >
            <Globe className="h-4 w-4" />
            <span className="text-xs font-medium uppercase">{i18n.language}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-text-muted-light transition-colors hover:bg-gray-100 dark:text-text-muted-dark dark:hover:bg-gray-800"
            title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>

          {/* Notifications */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative rounded-lg p-2 text-text-muted-light transition-colors hover:bg-gray-100 dark:text-text-muted-dark dark:hover:bg-gray-800"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Avatar Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                <Avatar
                  src={profile.avatar_url}
                  name={profile.full_name}
                  size="sm"
                />
                <span className="hidden text-sm font-medium text-text-primary-light dark:text-text-primary-dark lg:block">
                  {profile.full_name}
                </span>
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className={cn(
                  'z-50 min-w-[200px] rounded-xl border p-1.5 shadow-medium',
                  'bg-card-light border-border-light',
                  'dark:bg-card-dark dark:border-border-dark dark:shadow-dark-medium',
                  'animate-fade-in-down',
                )}
                sideOffset={8}
                align="end"
              >
                {/* User info */}
                <div className="mb-1.5 border-b border-border-light px-3 py-2 dark:border-border-dark">
                  <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                    {profile.full_name}
                  </p>
                  <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    {profile.email}
                  </p>
                </div>

                <DropdownMenu.Item
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-primary-light outline-none transition-colors hover:bg-gray-100 dark:text-text-primary-dark dark:hover:bg-gray-800"
                  onClick={() => navigate('/profile')}
                >
                  <User className="h-4 w-4" />
                  {t('nav.profile')}
                </DropdownMenu.Item>

                {/* Link ke dashboard mitra (jika role mitra) */}
                {(profile.role === 'mitra_independen' || profile.role === 'mitra_bengkel') && (
                  <DropdownMenu.Item
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-primary-light outline-none transition-colors hover:bg-gray-100 dark:text-text-primary-dark dark:hover:bg-gray-800"
                    onClick={() => navigate('/mitra/dashboard')}
                  >
                    <Wrench className="h-4 w-4" />
                    {t('nav.dashboard')} Mitra
                  </DropdownMenu.Item>
                )}

                {/* Link ke admin panel (jika superadmin) */}
                {profile.role === 'superadmin' && (
                  <DropdownMenu.Item
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-primary-light outline-none transition-colors hover:bg-gray-100 dark:text-text-primary-dark dark:hover:bg-gray-800"
                    onClick={() => navigate('/admin/dashboard')}
                  >
                    <Shield className="h-4 w-4" />
                    {t('nav.admin')}
                  </DropdownMenu.Item>
                )}

                <DropdownMenu.Item
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-primary-light outline-none transition-colors hover:bg-gray-100 dark:text-text-primary-dark dark:hover:bg-gray-800"
                  onClick={() => navigate('/profile')}
                >
                  <Settings className="h-4 w-4" />
                  {t('nav.settings')}
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="my-1.5 h-px bg-border-light dark:bg-border-dark" />

                <DropdownMenu.Item
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger outline-none transition-colors hover:bg-danger-light dark:hover:bg-danger/10"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  {t('auth.logout')}
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
}
```

---

## Validasi

- [ ] File `src/components/layout/DesktopNav.tsx` sudah ada
- [ ] Hanya tampil di layar `>= md` (desktop)
- [ ] Memiliki logo, nav links, theme toggle, lang toggle, notif bell, avatar dropdown

---

**Selesai? Lanjut ke `04-app-layout.md`**

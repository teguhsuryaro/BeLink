import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, MessageSquare, Clock, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useNotificationStore } from '@/store/notificationStore';

interface NavItem {
  key: string;
  labelKey: string;
  icon: React.ElementType;
  path: string;
}

const userNavItems: NavItem[] = [
  { key: 'home', labelKey: 'nav.home', icon: Home, path: '/home' },
  { key: 'messages', labelKey: 'nav.messages', icon: MessageSquare, path: '/messages' },
  { key: 'history', labelKey: 'nav.history', icon: Clock, path: '/history' },
  { key: 'notifications', labelKey: 'nav.notifications', icon: Bell, path: '/notifications' },
  { key: 'profile', labelKey: 'nav.profile', icon: User, path: '/profile' },
];

export function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  // Tentukan tab aktif berdasarkan path
  const activeTab = userNavItems.findIndex(
    (item) => location.pathname.startsWith(item.path)
  );

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'border-t border-border-light bg-card-light/90 backdrop-blur-xl',
        'dark:border-border-dark dark:bg-card-dark/90',
        'pb-safe',
        'md:hidden', // Hanya tampil di mobile
      )}
    >
      <div className="flex items-center justify-around px-2 py-1">
        {userNavItems.map((item, index) => {
          const isActive = activeTab === index;
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={cn(
                'relative flex flex-col items-center gap-0.5 px-3 py-2 transition-colors duration-200',
                isActive
                  ? 'text-primary'
                  : 'text-text-muted-light dark:text-text-muted-dark',
              )}
            >
              {/* Active indicator bar */}
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-1 h-0.5 w-6 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              {/* Icon */}
              <div className="relative">
                <Icon
                  className={cn(
                    'h-5 w-5 transition-transform duration-200',
                    isActive && 'scale-110',
                  )}
                />

                {/* Badge notifikasi */}
                {item.key === 'notifications' && unreadCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={cn('text-[10px] font-medium', isActive && 'font-semibold')}>
                {t(item.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

import { motion } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface OnlineToggleProps {
  isOnline: boolean;
  onToggle: (goOnline: boolean) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function OnlineToggle({ isOnline, onToggle, isLoading, disabled }: OnlineToggleProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => onToggle(!isOnline)}
        disabled={isLoading || disabled}
        className={cn(
          'relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          isOnline ? 'bg-success' : 'bg-gray-300 dark:bg-gray-600',
        )}
      >
        <motion.div
          className="h-6 w-6 rounded-full bg-white shadow-md"
          animate={{ x: isOnline ? 28 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>

      <div className="flex items-center gap-2">
        {isOnline ? (
          <Wifi className="h-4 w-4 text-success" />
        ) : (
          <WifiOff className="h-4 w-4 text-gray-400" />
        )}
        <span className={cn(
          'text-sm font-medium',
          isOnline
            ? 'text-success'
            : 'text-text-muted-light dark:text-text-muted-dark',
        )}>
          {isOnline ? t('mitra.status_online', 'Online') : t('mitra.status_offline', 'Offline')}
        </span>
      </div>
    </div>
  );
}

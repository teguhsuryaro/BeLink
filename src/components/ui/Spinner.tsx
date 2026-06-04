
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** Teks yang ditampilkan di bawah spinner */
  text?: string;
  /** Full screen overlay */
  fullScreen?: boolean;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
};

export function Spinner({ size = 'md', className, text, fullScreen = false }: SpinnerProps) {
  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeMap[size])} />
      {text && (
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-light/80 backdrop-blur-sm dark:bg-surface-dark/80">
        {spinner}
      </div>
    );
  }

  return spinner;
}

/**
 * Loading overlay untuk konten di dalam container
 */
export function LoadingOverlay({ text }: { text?: string }) {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <Spinner size="lg" text={text} />
    </div>
  );
}

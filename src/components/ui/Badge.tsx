import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary-50 text-primary-700 dark:bg-primary/20 dark:text-primary-300',
        success: 'bg-success-light text-success-dark dark:bg-success/20 dark:text-success',
        warning: 'bg-warning-light text-warning-dark dark:bg-warning/20 dark:text-warning',
        danger: 'bg-danger-light text-danger-dark dark:bg-danger/20 dark:text-danger',
        neutral: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
        outline: 'border border-border-light text-text-muted-light dark:border-border-dark dark:text-text-muted-dark',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean; // Menampilkan dot kecil di samping teks
  dotColor?: string; // Warna dot (Tailwind class)
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, dot, dotColor, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, className }))}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              dotColor || 'bg-current',
            )}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };

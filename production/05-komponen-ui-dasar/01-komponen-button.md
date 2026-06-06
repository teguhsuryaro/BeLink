# 01 - Komponen Button

## Tujuan
Membuat komponen Button yang reusable dengan berbagai variant, ukuran, dan state loading.

---

## Buat File

**BUAT FILE**: `src/components/ui/Button.tsx`

```typescript
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-white hover:bg-primary-dark active:bg-primary-800 shadow-sm hover:shadow-primary-glow',
        secondary:
          'bg-primary-muted text-primary border border-primary/20 hover:bg-primary-100 dark:bg-primary/10 dark:hover:bg-primary/20 dark:border-primary/30',
        outline:
          'border border-border-light bg-transparent text-text-primary-light hover:bg-gray-50 dark:border-border-dark dark:text-text-primary-dark dark:hover:bg-card-dark',
        ghost:
          'text-text-primary-light hover:bg-gray-100 dark:text-text-primary-dark dark:hover:bg-gray-800',
        danger:
          'bg-danger text-white hover:bg-red-600 active:bg-red-700 shadow-sm',
        success:
          'bg-success text-white hover:bg-emerald-600 active:bg-emerald-700 shadow-sm',
        link:
          'text-primary underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled || isLoading}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...(props as any)}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}

        {children}

        {!isLoading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
```

---

## Contoh Penggunaan

```tsx
// Primary button (default)
<Button>Kirim Permintaan</Button>

// Dengan loading
<Button isLoading>Mengirim...</Button>

// Secondary
<Button variant="secondary">Batal</Button>

// Dengan icon
<Button leftIcon={<MapPin className="h-4 w-4" />}>Deteksi Lokasi</Button>

// Full width
<Button fullWidth size="lg">Masuk</Button>

// Icon only
<Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
```

---

## Validasi

- [ ] File `src/components/ui/Button.tsx` sudah ada
- [ ] Jalankan `npm run dev` — tidak ada error TypeScript

---

**Selesai? Lanjut ke `02-komponen-input.md`**

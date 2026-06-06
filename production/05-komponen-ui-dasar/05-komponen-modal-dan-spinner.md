# 05 - Komponen Modal dan Spinner

## Tujuan
Membuat komponen Modal (dialog) menggunakan Radix UI dan Spinner loading.

---

## Buat File Modal

**BUAT FILE**: `src/components/ui/Modal.tsx`

```typescript
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  /** Ukuran modal */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Apakah bisa di-dismiss dengan klik overlay */
  dismissible?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-[calc(100vw-2rem)] sm:max-w-2xl',
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  size = 'md',
  dismissible = true,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={dismissible ? () => onOpenChange(false) : undefined}
              />
            </Dialog.Overlay>

            {/* Content */}
            <Dialog.Content
              asChild
              onPointerDownOutside={(e) => {
                if (!dismissible) e.preventDefault();
              }}
              onEscapeKeyDown={(e) => {
                if (!dismissible) e.preventDefault();
              }}
            >
              <motion.div
                className={cn(
                  'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)]',
                  'rounded-2xl bg-card-light p-5 shadow-strong',
                  'dark:bg-card-dark dark:shadow-dark-medium',
                  'focus:outline-none',
                  sizeClasses[size],
                  className,
                )}
                initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
                animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {/* Header */}
                {(title || description) && (
                  <div className="mb-4">
                    {title && (
                      <Dialog.Title className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                        {title}
                      </Dialog.Title>
                    )}
                    {description && (
                      <Dialog.Description className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                        {description}
                      </Dialog.Description>
                    )}
                  </div>
                )}

                {/* Close Button */}
                <Dialog.Close asChild>
                  <button
                    className={cn(
                      'absolute right-3 top-3 rounded-lg p-1.5',
                      'text-text-muted-light hover:bg-gray-100 hover:text-text-primary-light',
                      'dark:text-text-muted-dark dark:hover:bg-gray-800 dark:hover:text-text-primary-dark',
                      'transition-colors duration-150',
                    )}
                    aria-label="Tutup"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>

                {/* Body */}
                {children}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
```

## Buat File Spinner

**BUAT FILE**: `src/components/ui/Spinner.tsx`

```typescript
import React from 'react';
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
```

---

## Validasi

- [ ] File `src/components/ui/Modal.tsx` sudah ada
- [ ] File `src/components/ui/Spinner.tsx` sudah ada
- [ ] Jalankan `npm run dev` — tidak ada error

---

**Selesai? Lanjut ke `06-komponen-avatar-dan-toast.md`**

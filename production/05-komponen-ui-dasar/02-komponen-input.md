# 02 - Komponen Input

## Tujuan
Membuat komponen Input dan Textarea yang reusable dengan label, error message, dan integrasi React Hook Form.

---

## Buat File

**BUAT FILE**: `src/components/ui/Input.tsx`

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted-light dark:text-text-muted-dark">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'flex h-10 w-full rounded-lg border bg-card-light px-3 py-2 text-sm text-text-primary-light',
              'placeholder:text-text-muted-light',
              'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'dark:border-border-dark dark:bg-card-dark dark:text-text-primary-dark dark:placeholder:text-text-muted-dark dark:focus:ring-primary/30',
              'transition-colors duration-200',
              error
                ? 'border-danger focus:border-danger focus:ring-danger/20'
                : 'border-border-light',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted-light dark:text-text-muted-dark">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-danger">{error}</p>
        )}

        {hint && !error && (
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ============================================
// TEXTAREA
// ============================================
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'flex min-h-[80px] w-full rounded-lg border bg-card-light px-3 py-2 text-sm text-text-primary-light',
            'placeholder:text-text-muted-light',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'dark:border-border-dark dark:bg-card-dark dark:text-text-primary-dark dark:placeholder:text-text-muted-dark',
            'transition-colors duration-200 resize-none',
            error
              ? 'border-danger focus:border-danger focus:ring-danger/20'
              : 'border-border-light',
            className,
          )}
          {...props}
        />

        {error && <p className="text-xs text-danger">{error}</p>}
        {hint && !error && (
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Input, Textarea };
```

---

## Validasi

- [ ] File `src/components/ui/Input.tsx` sudah ada
- [ ] Export `Input` dan `Textarea`
- [ ] Jalankan `npm run dev` — tidak ada error

---

**Selesai? Lanjut ke `03-komponen-card.md`**

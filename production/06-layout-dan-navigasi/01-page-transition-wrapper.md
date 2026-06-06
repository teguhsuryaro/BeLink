# 01 - Page Transition Wrapper

## Tujuan
Membuat wrapper animasi transisi halaman menggunakan Framer Motion.

---

## Buat File

**BUAT FILE**: `src/components/layout/PageTransition.tsx`

```typescript
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper untuk animasi transisi halaman.
 * Membungkus konten halaman dengan fade + slide up ringan.
 *
 * Penggunaan:
 * function HomePage() {
 *   return (
 *     <PageTransition>
 *       <h1>Beranda</h1>
 *     </PageTransition>
 *   );
 * }
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: 0.25,
        ease: [0.25, 0.1, 0.25, 1], // cubic-bezier smooth
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Wrapper khusus untuk elemen yang muncul bertahap (staggered).
 * Digunakan untuk list item atau card yang muncul satu per satu.
 */
export function StaggerContainer({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Item child untuk StaggerContainer.
 */
export function StaggerItem({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.3, ease: 'easeOut' },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
```

---

## Validasi

- [ ] File `src/components/layout/PageTransition.tsx` sudah ada
- [ ] Export 3 komponen: PageTransition, StaggerContainer, StaggerItem

---

**Selesai? Lanjut ke `02-mobile-bottom-navigation.md`**

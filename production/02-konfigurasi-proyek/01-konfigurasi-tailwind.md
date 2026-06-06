# 01 - Konfigurasi Tailwind CSS

## Tujuan
Mengkonfigurasi Tailwind CSS dengan custom design tokens (warna, font, breakpoints) sesuai tema BeLink.

---

## Langkah-Langkah

### 1. Rename File Konfigurasi

Rename file `tailwind.config.js` menjadi `tailwind.config.ts` agar mendapat type-checking.

**PERINTAH**:

```bash
mv tailwind.config.js tailwind.config.ts
```

Jika di Windows (PowerShell):

```powershell
Rename-Item tailwind.config.js tailwind.config.ts
```

### 2. Edit Tailwind Config

**EDIT FILE**: `tailwind.config.ts`

**Ganti seluruh isi file** dengan:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  // Dark mode menggunakan class (toggle manual, bukan system preference)
  darkMode: 'class',

  // File yang akan di-scan untuk class Tailwind
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      // === WARNA KUSTOM ===
      colors: {
        primary: {
          DEFAULT: '#3661E2',
          light: '#5B80F0',
          dark: '#1E47C8',
          muted: 'rgba(54, 97, 226, 0.06)',
          '50': '#EEF2FF',
          '100': '#DCE5FE',
          '200': '#B9CBFD',
          '300': '#8EADFC',
          '400': '#5B80F0',
          '500': '#3661E2',
          '600': '#2550CC',
          '700': '#1E47C8',
          '800': '#1A3A9E',
          '900': '#16307D',
        },
        surface: {
          light: '#F8F9FF',
          dark: '#0F1117',
        },
        card: {
          light: '#FFFFFF',
          dark: '#1A1D27',
        },
        // Warna teks
        'text-primary': {
          light: '#1A1F36',
          dark: '#E8EAED',
        },
        'text-muted': {
          light: '#6B7280',
          dark: '#9CA3AF',
        },
        // Warna status
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
          dark: '#065F46',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          dark: '#92400E',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
          dark: '#991B1B',
        },
        // Warna border
        border: {
          light: '#E5E7EB',
          dark: '#2D3748',
        },
      },

      // === FONT ===
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },

      // === FONT SIZE KUSTOM ===
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },

      // === BORDER RADIUS ===
      borderRadius: {
        'sm': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.25rem',
      },

      // === BOX SHADOW ===
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'strong': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'primary-glow': '0 4px 24px rgba(54, 97, 226, 0.25)',
        'dark-soft': '0 2px 8px rgba(0, 0, 0, 0.2)',
        'dark-medium': '0 4px 16px rgba(0, 0, 0, 0.3)',
      },

      // === ANIMASI KUSTOM ===
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'fade-in-down': 'fadeInDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      // === TRANSISI ===
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },

      // === SPACING KUSTOM ===
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        'safe-bottom': 'env(safe-area-inset-bottom, 0px)',
      },

      // === SCREEN BREAKPOINTS ===
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
      },
    },
  },

  plugins: [],
};

export default config;
```

### 3. Edit File CSS Utama

**EDIT FILE**: `src/index.css`

**Ganti seluruh isi file** dengan:

```css
/* ============================================
   BeLink — Base Styles
   ============================================ */

/* Google Font: Plus Jakarta Sans */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');

/* Tailwind Layers */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ============================================
   BASE LAYER — Reset & Defaults
   ============================================ */
@layer base {
  /* Smooth color transition untuk dark/light mode */
  *,
  *::before,
  *::after {
    transition-property: background-color, border-color, color;
    transition-duration: 250ms;
    transition-timing-function: ease-in-out;
  }

  /* Mencegah transition animasi saat pertama kali load */
  .preload *,
  .preload *::before,
  .preload *::after {
    transition: none !important;
  }

  html {
    @apply scroll-smooth antialiased;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    -webkit-tap-highlight-color: transparent;
  }

  /* === MODE TERANG (default) === */
  body {
    @apply bg-surface-light text-text-primary-light;
  }

  /* === MODE GELAP === */
  .dark body {
    @apply bg-surface-dark text-text-primary-dark;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    @apply bg-transparent;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-border-light rounded-full;
  }

  .dark ::-webkit-scrollbar-thumb {
    @apply bg-border-dark;
  }

  /* Focus outline yang konsisten */
  *:focus-visible {
    @apply outline-2 outline-offset-2 outline-primary;
  }

  /* Placeholder styling */
  input::placeholder,
  textarea::placeholder {
    @apply text-text-muted-light;
  }

  .dark input::placeholder,
  .dark textarea::placeholder {
    @apply text-text-muted-dark;
  }
}

/* ============================================
   COMPONENTS LAYER — Reusable classes
   ============================================ */
@layer components {
  /* Card base */
  .card {
    @apply bg-card-light border border-border-light rounded-xl shadow-soft;
  }

  .dark .card {
    @apply bg-card-dark border-border-dark shadow-dark-soft;
  }

  /* Gradient tipis primary */
  .gradient-primary {
    background: linear-gradient(135deg, #3661E2 0%, #5B80F0 100%);
  }

  .gradient-primary-soft {
    background: linear-gradient(135deg, rgba(54, 97, 226, 0.08) 0%, rgba(91, 128, 240, 0.04) 100%);
  }

  .dark .gradient-primary-soft {
    background: linear-gradient(135deg, rgba(54, 97, 226, 0.15) 0%, rgba(91, 128, 240, 0.08) 100%);
  }

  /* Progress bar di atas halaman (NProgress-style) */
  .page-progress-bar {
    @apply fixed top-0 left-0 right-0 h-[2px] z-50;
    background: linear-gradient(90deg, transparent 0%, #3661E2 50%, #5B80F0 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s linear infinite;
  }

  /* Skeleton loading */
  .skeleton {
    @apply bg-border-light rounded-md animate-pulse;
  }

  .dark .skeleton {
    @apply bg-border-dark;
  }

  /* Badge status */
  .badge-success {
    @apply bg-success-light text-success-dark text-xs font-medium px-2.5 py-0.5 rounded-full;
  }

  .badge-warning {
    @apply bg-warning-light text-warning-dark text-xs font-medium px-2.5 py-0.5 rounded-full;
  }

  .badge-danger {
    @apply bg-danger-light text-danger-dark text-xs font-medium px-2.5 py-0.5 rounded-full;
  }

  .dark .badge-success {
    @apply bg-success/20 text-success;
  }

  .dark .badge-warning {
    @apply bg-warning/20 text-warning;
  }

  .dark .badge-danger {
    @apply bg-danger/20 text-danger;
  }
}

/* ============================================
   UTILITIES LAYER — Helper classes
   ============================================ */
@layer utilities {
  /* Safe area padding untuk mobile */
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }

  .pt-safe {
    padding-top: env(safe-area-inset-top, 0px);
  }

  /* Glassmorphism effect */
  .glass {
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .dark .glass {
    background: rgba(26, 29, 39, 0.75);
    border: 1px solid rgba(45, 55, 72, 0.3);
  }

  /* Text gradient */
  .text-gradient-primary {
    @apply bg-clip-text text-transparent;
    background-image: linear-gradient(135deg, #3661E2, #5B80F0);
  }

  /* Hide scrollbar but keep scroll functionality */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* Hover card effect */
  .hover-lift {
    @apply transition-all duration-250;
  }

  .hover-lift:hover {
    @apply -translate-y-0.5 shadow-medium;
  }

  .dark .hover-lift:hover {
    @apply shadow-dark-medium;
  }
}

/* ============================================
   LEAFLET MAP OVERRIDES
   ============================================ */
.leaflet-container {
  @apply rounded-xl;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
}

.leaflet-popup-content-wrapper {
  @apply rounded-lg shadow-medium !important;
}

.dark .leaflet-popup-content-wrapper {
  @apply bg-card-dark text-text-primary-dark !important;
}

.dark .leaflet-popup-tip {
  @apply bg-card-dark !important;
}
```

---

## Validasi

- [ ] File `tailwind.config.ts` sudah ada (bukan `.js`)
- [ ] File `src/index.css` berisi import Google Fonts dan 3 layer Tailwind
- [ ] Jalankan `npm run dev` — tidak ada error di terminal
- [ ] Buka browser → background halaman berubah warna sesuai `surface-light` (`#F8F9FF`)
- [ ] Font teks berubah menjadi Plus Jakarta Sans (lebih modern dari default)

---

## Catatan

- Warna `#F8F9FF` (surface-light) dipilih agar tidak terlalu putih dan tidak menyilaukan mata
- Dark mode akan diaktifkan nanti saat membuat komponen theme toggle
- Safe area utilities (`pb-safe`, `pt-safe`) penting untuk kompatibilitas iPhone dengan notch/dynamic island

---

**Selesai? Lanjut ke `02-konfigurasi-typescript.md`**

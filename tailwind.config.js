const config = {
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

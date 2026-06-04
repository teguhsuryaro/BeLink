import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light', // Default: terang

  setTheme: (theme) => {
    set({ theme });

    // Update class di <html> element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Simpan preferensi di localStorage
    localStorage.setItem('belink-theme', theme);
  },

  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(newTheme);
  },

  initializeTheme: () => {
    // Cek localStorage dulu
    const savedTheme = localStorage.getItem('belink-theme') as Theme | null;

    if (savedTheme) {
      get().setTheme(savedTheme);
    } else {
      // Default ke light
      get().setTheme('light');
    }
  },
}));

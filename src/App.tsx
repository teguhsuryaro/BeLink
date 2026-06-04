import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import AppRouter from '@/router';

function App() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // Inisialisasi tema dari localStorage
    initializeTheme();
    // Inisialisasi auth (cek session aktif)
    initialize();
  }, [initializeTheme, initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Router akan dibuat di folder 06-layout-dan-navigasi */}
        <AppRouter />

        {/* Toast notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: '"Plus Jakarta Sans", sans-serif',
            },
          }}
          richColors
          closeButton
        />
      </BrowserRouter>

      {/* DevTools hanya muncul di development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

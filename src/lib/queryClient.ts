import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data dianggap "fresh" selama 30 detik
      staleTime: 30 * 1000,
      // Cache disimpan selama 5 menit
      gcTime: 5 * 60 * 1000,
      // Retry 1 kali jika gagal
      retry: 1,
      // Refetch saat window kembali fokus
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Retry 0 kali untuk mutations
      retry: 0,
    },
  },
});

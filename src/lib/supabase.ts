import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY sudah diisi di file .env.local'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Simpan session di localStorage
    persistSession: true,
    // Auto-refresh token sebelum expired
    autoRefreshToken: true,
    // Deteksi session dari URL (untuk OAuth, tapi kita tidak pakai)
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      // Perkecil heartbeat interval untuk koneksi yang lebih responsif
      eventsPerSecond: 10,
    },
  },
});

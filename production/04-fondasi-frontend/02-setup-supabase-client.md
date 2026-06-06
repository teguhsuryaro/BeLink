# 02 - Setup Supabase Client

## Tujuan
Membuat file konfigurasi Supabase client yang akan digunakan di seluruh aplikasi.

---

## Langkah-Langkah

### 1. Buat Supabase Client

**BUAT FILE**: `src/lib/supabase.ts`

```typescript
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
```

---

## Penjelasan

- `createClient` — membuat instance Supabase client yang akan digunakan untuk:
  - **Auth**: login, register, logout
  - **Database**: query tabel, insert, update, delete
  - **Storage**: upload/download file
  - **Realtime**: subscribe ke perubahan data
- `persistSession: true` — session user disimpan di `localStorage`, jadi user tidak perlu login ulang saat refresh halaman
- `autoRefreshToken: true` — token JWT akan di-refresh otomatis sebelum expired

---

## Validasi

- [ ] File `src/lib/supabase.ts` sudah ada
- [ ] Jalankan `npm run dev` — tidak ada error (catatan: jika `.env.local` masih berisi placeholder, akan muncul error dari validasi. Pastikan sudah diisi dengan nilai Supabase yang benar)

---

**Selesai? Lanjut ke `03-setup-design-system-css.md`**

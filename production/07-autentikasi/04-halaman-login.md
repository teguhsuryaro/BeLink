# 04 - Halaman Login

## Tujuan
Membuat halaman login dengan form Email + Password.

---

## Instruksi

**EDIT FILE**: `src/pages/public/LoginPage.tsx`

Struktur dan desain sangat mirip dengan halaman Register, tapi lebih sederhana:

### Struktur Halaman

1. **Header**: Logo + judul `auth.login_title` + subjudul `auth.login_subtitle`
2. **Form** (React Hook Form + Zod):
   - Input `email`
   - Input `password`
   - Tombol submit `auth.login`, primary, full width, size `lg`
3. **Footer**: `auth.no_account` + link `auth.register_here` → `/register`

### Logika

```typescript
import { loginSchema, type LoginFormData } from '@/lib/validators';
import { useAuth } from '@/hooks/useAuth';

const onSubmit = async (data: LoginFormData) => {
  try {
    await signIn(data);
    navigate('/home');
  } catch (error: any) {
    toast.error(error.message || 'Gagal masuk');
  }
};
```

### Desain: sama dengan Register page — card centered, max-w-sm, bungkus dengan `<PageTransition>`

---

## Validasi

- [ ] Buka `/login` — form muncul
- [ ] Login dengan akun yang sudah didaftarkan → redirect ke `/home`
- [ ] Login dengan kredensial salah → error toast muncul
- [ ] Link "Daftar di sini" navigasi ke `/register`

---

**Selesai? Lanjut ke `05-protected-route-dan-redirect.md`**

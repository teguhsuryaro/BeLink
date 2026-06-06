# 03 - Halaman Register

## Tujuan
Membuat halaman registrasi user baru dengan form Email + Password.

---

## Instruksi

**EDIT FILE**: `src/pages/public/RegisterPage.tsx`

**Ganti seluruh isi file** dengan halaman register yang memiliki:

### Struktur Halaman

Layout: Card di tengah layar, max-width `sm` (tdk terlalu lebar)

1. **Header**
   - Logo BeLink (icon Wrench + teks)
   - Judul: `auth.register_title` ("Buat Akun Baru")
   - Subjudul: `auth.register_subtitle`

2. **Form** (menggunakan React Hook Form + Zod)
   - Input `full_name`: Komponen `Input` dengan label `auth.full_name`, required
   - Input `email`: Komponen `Input` type email, label `auth.email`, required
   - Input `password`: Komponen `Input` type password, label `auth.password`, required
   - Input `confirm_password`: Komponen `Input` type password, label `auth.confirm_password`, required
   - Input `phone`: Komponen `Input` type tel, label `auth.phone`, optional
   - Tombol submit: `Button` primary, full width, size `lg`, teks `auth.register`
   - State loading di tombol saat proses registrasi

3. **Footer**
   - Teks: `auth.has_account` + link `auth.login_here` → navigasi ke `/login`

### Logika

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '@/lib/validators';
import { useAuth } from '@/hooks/useAuth';

// Di dalam komponen:
const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
  resolver: zodResolver(registerSchema),
});

const { signUp } = useAuth();
const navigate = useNavigate();

const onSubmit = async (data: RegisterFormData) => {
  try {
    await signUp(data);
    navigate('/home');
  } catch (error: any) {
    toast.error(error.message || 'Gagal membuat akun');
  }
};
```

### Spesifikasi Desain

- **Background**: `bg-surface-light dark:bg-surface-dark` dengan gradient tipis
- **Card**: `max-w-sm mx-auto`, shadow medium, rounded-2xl
- **Input field**: menggunakan komponen `<Input />` yang sudah dibuat
- **Error messages**: ditampilkan di bawah setiap input (prop `error`)
- **Animasi**: PageTransition wrapper + input fields muncul bertahap
- **Bungkus dengan `<PageTransition>`**

### Catatan

- Validasi `registerSchema` sudah ada di `src/lib/validators.ts`:
  - `full_name`: min 2 karakter
  - `email`: format email valid
  - `password`: min 6 karakter
  - `confirm_password`: harus sama dengan password
- Tanpa verifikasi email — user langsung bisa login setelah register
- Setelah register berhasil, redirect ke `/home`

---

## Validasi

- [ ] Buka `/register` — form muncul dengan 5 field
- [ ] Submit form kosong — error validasi muncul di bawah setiap field
- [ ] Isi form dengan data valid → submit → redirect ke `/home`
- [ ] Isi email yang sama 2x → error "Email sudah terdaftar"
- [ ] Password berbeda → error "Kata sandi tidak cocok"
- [ ] Tombol menunjukkan loading spinner saat proses

---

**Selesai? Lanjut ke `04-halaman-login.md`**

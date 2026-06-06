# 02 - Manajemen User

## Tujuan
Membuat halaman `/admin/users` untuk mengelola semua user (ban/unban, lihat detail).

---

## Instruksi

**EDIT FILE**: `src/pages/admin/UsersManagementPage.tsx`

**Ganti seluruh isi file placeholder**.

### Struktur Halaman

1. **Header + Search Bar**
   - Judul: `admin.user_management`
   - Input search: filter berdasarkan nama atau email (client-side filter)

2. **Filter Tabs**: Semua | User | Mitra | Banned

3. **User Table** (desktop) / **User Cards** (mobile)
   - Kolom: Avatar, Nama, Email, Role (badge), Status (Online/Offline dot), Aksi
   - Badge role: warna berbeda (user=neutral, mitra=primary, admin=warning)
   - Banned user: baris/card dengan opacity rendah + badge "Banned" (danger)
   - Tombol aksi per user:
     - "Ban" → modal konfirmasi → update `profiles.is_banned = true`
     - "Unban" (jika sudah banned) → update `profiles.is_banned = false`

### Data Fetching

```typescript
const { data: users, isLoading } = useQuery({
  queryKey: ['admin', 'users'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as Profile[];
  },
});

// Filter client-side berdasarkan search + tab
const filteredUsers = useMemo(() => {
  let result = users || [];

  // Search filter
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    result = result.filter(u =>
      u.full_name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  }

  // Tab filter
  switch (activeTab) {
    case 'user': return result.filter(u => u.role === 'user');
    case 'mitra': return result.filter(u => u.role === 'mitra_independen' || u.role === 'mitra_bengkel');
    case 'banned': return result.filter(u => u.is_banned);
    default: return result;
  }
}, [users, searchQuery, activeTab]);
```

### Ban/Unban Logic

```typescript
const handleBan = async (userId: string, ban: boolean) => {
  const { error } = await supabase
    .from('profiles')
    .update({ is_banned: ban, is_online: false })
    .eq('id', userId);

  if (error) throw error;

  // Jika mitra, juga set offline
  if (ban) {
    await supabase
      .from('mitra_profiles')
      .update({ is_accepting_orders: false })
      .eq('id', userId);
  }

  queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
  toast.success(ban ? 'User telah di-ban' : 'User telah diaktifkan kembali');
};
```

### Spesifikasi Desain

- Desktop: table dengan header kolom, hover row highlight
- Mobile: card list, setiap card berisi avatar + nama + role badge + tombol aksi
- Search: debounce 300ms
- Bungkus konten dengan `<PageTransition>`

---

## Validasi

- [ ] Buka `/admin/users` — daftar user muncul
- [ ] Search filter bekerja (ketik nama/email)
- [ ] Tab filter bekerja (User, Mitra, Banned)
- [ ] Ban user → user menjadi opacity rendah + badge "Banned"
- [ ] Unban user → user kembali normal

---

**Selesai? Lanjut ke `03-verifikasi-mitra.md`**

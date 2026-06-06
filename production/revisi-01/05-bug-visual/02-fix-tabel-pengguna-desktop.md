# 02 — Fix Tabel Pengguna Desktop (Responsivitas)

## Tujuan
Memperbaiki tabel di `UsersManagementPage.tsx` (mode desktop) yang terlalu lebar dan meluber (horizontal overflow) akibat penggunaan `whitespace-nowrap`.

---

## File yang Dimodifikasi

### `src/pages/admin/UsersManagementPage.tsx`

---

## Akar Masalah

Pada tabel di mode desktop (baris 250+), pembungkus tabel memiliki class `overflow-x-auto`, dan elemen `table` memiliki class `whitespace-nowrap`.
Jika layar lebih kecil dari konten tabel (misal iPad/tablet atau resolusi 1024px), konten tidak di-*wrap* sehingga membuat tabel sangat lebar.

Terlebih lagi, kolom nama dan email pengguna tidak di-*truncate* (dipotong) secara efektif di dalam sel tabel.

---

## Langkah Perbaikan

### 1. Modifikasi Container Tabel dan Tabel

Ganti *styling* di struktur tabel:

**Ubah di tag `<table ...>` (hilangkan `whitespace-nowrap` yang global, aplikasikan hanya pada kolom yang butuh):**
```tsx
{/* Desktop View: Table */}
<div className="hidden md:block overflow-x-auto w-full">
  <table className="w-full text-left text-sm table-auto md:table-fixed">
    <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-text-muted-light dark:text-text-muted-dark border-b border-border-light dark:border-border-dark">
      <tr>
        <th className="w-2/5 px-4 py-4 font-medium">Pengguna</th>
        <th className="w-1/5 px-4 py-4 font-medium">Role</th>
        <th className="w-1/5 px-4 py-4 font-medium">Status</th>
        <th className="w-1/5 px-4 py-4 font-medium">Terdaftar</th>
        <th className="w-auto px-4 py-4 font-medium text-right">Aksi</th>
      </tr>
    </thead>
```

### 2. Truncate Teks Nama & Email

Pada sel pertama tabel, pastikan strukturnya membatasi lebar agar bisa ditruncate:

```tsx
<td className="px-4 py-4 truncate">
  <div className="flex items-center gap-3 w-full">
    <div className="relative shrink-0">
      <img 
        src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`} 
        alt={user.full_name}
        className="h-10 w-10 rounded-full object-cover"
      />
      <div className={cn("absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900", user.is_online ? "bg-success" : "bg-gray-400")} />
    </div>
    <div className="min-w-0 flex-1 overflow-hidden">
      <div className="font-semibold text-text-primary-light dark:text-text-primary-dark truncate w-full" title={user.full_name}>
        {user.full_name}
      </div>
      <div className="text-xs text-text-muted-light dark:text-text-muted-dark truncate w-full" title={user.email}>
        {user.email}
      </div>
    </div>
  </div>
</td>
```
*(Tambahkan atribut `title` agar teks penuh bisa dibaca saat dihover)*

### 3. Whitespace Nowrap pada Kolom Lain

Untuk kolom Role, Status, Terdaftar, dan Aksi, tambahkan class `whitespace-nowrap` pada masing-masing `<td>` jika diperlukan agar isi kolom tersebut tidak turun baris jika layarnya menyusut.

---

## Validasi

- [ ] Buka `/admin/users` di desktop.
- [ ] Kecilkan *window* *browser* ke ukuran tablet (768px - 1024px).
- [ ] Tabel tidak boleh meluber keluar area layar.
- [ ] Teks nama panjang dan email panjang akan terpotong dengan tanda titik-titik (`...`).

---

**Selesai? Lanjut ke `03-fix-icon-landing-card.md`**

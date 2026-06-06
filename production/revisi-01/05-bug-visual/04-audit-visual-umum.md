# 04 — Audit Visual Umum (Sweep & Check)

## Tujuan
Melakukan pengecekan menyeluruh terhadap seluruh komponen UI untuk menemukan dan memperbaiki minor visual *bugs* yang terlewat, terutama pada mode *dark mode* dan tampilan *mobile*.

---

## Daftar Pengecekan

Tugas ini membutuhkan developer untuk mengakses semua halaman dan memastikan hal-hal berikut:

### 1. Konsistensi Mode Gelap (Dark Mode)
- [ ] Periksa input form (warna teks input dan warna *placeholder*).
- [ ] Pastikan border dan bayangan (*shadow*) pada `<Card>` disesuaikan dengan benar di mode gelap.
- [ ] Pastikan modal/overlay memiliki *background color* gelap.
- [ ] Cek warna ikon (*lucide icons*) apakah cukup kontras.
- [ ] Cek status *badges* (hijau, kuning, merah) pada mode gelap. Kadang background terlalu terang.

### 2. Responsivitas (Mobile Sweep)
- [ ] Buka `DevTools -> Mobile View (misalnya iPhone 12/Pro)`.
- [ ] Periksa form order (*wizard* 3 tahap): Apakah peta bisa digeser tanpa menggeser halaman?
- [ ] Periksa modal/pop-up: Apakah melebihi lebar layar?
- [ ] Pastikan tidak ada horizontal scroll pada halaman utama/dashboard manapun.
- [ ] Cek *bottom navigation bar* agar tidak menutupi tombol Submit/CTA di bagian bawah layar.

### 3. Teks dan Tipografi
- [ ] Pastikan nama mitra/pengguna yang panjang di-`truncate` agar tidak merusak layout *card*.
- [ ] Cek i18n (*Internationalization*): Pastikan tidak ada kunci (key) yang belum diterjemahkan bocor ke *UI*.

---

## Tindakan yang Perlu Dilakukan

Jika ditemukan *bug* selama proses *audit* ini, lakukan *styling override* ringan dengan Tailwind class secara langsung pada file yang bersangkutan.

**Contoh perbaikan umum:**
- *Bug margin bawah di mobile:* Tambahkan `pb-24` di container luar.
- *Warna teks hilang di dark mode:* Pastikan class `dark:text-text-primary-dark` atau `dark:text-white` tersemat.
- *Teks meluber:* Tambahkan `truncate` atau `line-clamp-2`.

---

**Selesai!** Jika seluruh dokumen dalam folder ini telah selesai dikerjakan, maka kualitas *Quality Assurance* pasca-peluncuran telah terpenuhi 100%.

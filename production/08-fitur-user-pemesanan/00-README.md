# Folder 08 — Fitur User Pemesanan

Folder ini berisi 10 file yang membangun seluruh alur pemesanan darurat dari perspektif user. Ini adalah **inti dari aplikasi BeLink** — bagian terpenting yang harus dibangun dengan benar.

## Daftar File

| No | File | Deskripsi |
|---|---|---|
| 01 | `01-home-page-user.md` | Halaman beranda user setelah login |
| 02 | `02-integrasi-peta-leaflet.md` | Setup peta interaktif dengan OpenStreetMap |
| 03 | `03-form-darurat-step-wizard.md` | Form 3 langkah untuk memesan mekanik |
| 04 | `04-pencarian-mitra-dan-osrm.md` | Logika pencarian mitra + kalkulasi jarak |
| 05 | `05-halaman-active-order.md` | Halaman saat order aktif berlangsung |
| 06 | `06-real-time-chat.md` | Chat real-time antara user dan mitra |
| 07 | `07-anti-bypass-filter.md` | Filter pesan untuk mencegah bypass platform |
| 08 | `08-tombol-aksi-dan-tracking.md` | Tombol Deal, OTW, Selesai + tracking peta |
| 09 | `09-review-dan-rating.md` | Modal review setelah order selesai |
| 10 | `10-halaman-riwayat-order.md` | Halaman history semua order |

## Urutan Dependensi

```
01 (Home) ─────────────────────┐
02 (Peta) ──────┐              │
03 (Form) ──────┼─ 04 (Cari) ─┼─ 05 (Active Order) ─┬─ 06 (Chat) ─ 07 (Filter)
                │              │                      └─ 08 (Aksi) ─ 09 (Review)
                │              │
                │              └─ 10 (History)
```

Artinya: file 02 dan 03 bisa dikerjakan secara paralel, tapi 04 membutuhkan keduanya, 05 membutuhkan 04, dst.

# 04 - Setup Internasionalisasi (i18n)

## Tujuan
Mengkonfigurasi i18next untuk mendukung 2 bahasa: Bahasa Indonesia (default) dan English.

---

## Langkah-Langkah

### 1. Buat File Terjemahan Bahasa Indonesia

**BUAT FILE**: `public/locales/id/translation.json`

```json
{
  "app": {
    "name": "BeLink",
    "tagline": "Bantuan Mekanik Terdekat, Kapan Saja",
    "description": "Platform layanan darurat kendaraan berbasis GPS. Hubungkan dirimu dengan mekanik terdekat dalam hitungan menit."
  },
  "nav": {
    "home": "Beranda",
    "messages": "Pesan",
    "history": "Riwayat",
    "notifications": "Notifikasi",
    "profile": "Profil",
    "dashboard": "Dashboard",
    "orders": "Pesanan",
    "deposit": "Deposit",
    "settings": "Pengaturan",
    "admin": "Admin Panel",
    "users": "Pengguna",
    "verification": "Verifikasi",
    "reports": "Laporan",
    "statistics": "Statistik"
  },
  "auth": {
    "login": "Masuk",
    "register": "Daftar",
    "logout": "Keluar",
    "email": "Alamat Email",
    "password": "Kata Sandi",
    "confirm_password": "Konfirmasi Kata Sandi",
    "full_name": "Nama Lengkap",
    "phone": "Nomor Telepon",
    "login_title": "Selamat Datang Kembali",
    "login_subtitle": "Masuk ke akun BeLink kamu",
    "register_title": "Buat Akun Baru",
    "register_subtitle": "Daftar untuk mulai menggunakan BeLink",
    "no_account": "Belum punya akun?",
    "has_account": "Sudah punya akun?",
    "register_here": "Daftar di sini",
    "login_here": "Masuk di sini",
    "error_email_exists": "Email sudah terdaftar",
    "error_invalid_credentials": "Email atau kata sandi salah",
    "error_password_mismatch": "Kata sandi tidak cocok",
    "error_password_min": "Kata sandi minimal 6 karakter"
  },
  "landing": {
    "hero_title": "Kendaraan Mogok?",
    "hero_subtitle": "Mekanik Terdekat Siap Membantu",
    "hero_description": "Cukup 1 klik untuk memanggil mekanik profesional ke lokasimu. Cepat, aman, dan transparan.",
    "cta_button": "Mulai Sekarang",
    "cta_login": "Sudah Punya Akun?",
    "feature_1_title": "Cepat & Mudah",
    "feature_1_desc": "Pesan mekanik hanya dalam beberapa langkah sederhana",
    "feature_2_title": "GPS Akurat",
    "feature_2_desc": "Deteksi lokasi otomatis, mekanik tahu persis posisimu",
    "feature_3_title": "Harga Transparan",
    "feature_3_desc": "Ongkos jalan ditentukan di awal, tanpa biaya tersembunyi",
    "feature_4_title": "Chat Langsung",
    "feature_4_desc": "Negosiasi langsung dengan mekanik melalui chat real-time"
  },
  "order": {
    "emergency_title": "Minta Bantuan Mekanik",
    "step_vehicle": "Data Kendaraan",
    "step_damage": "Detail Kerusakan",
    "step_location": "Lokasi & Biaya",
    "vehicle_type": "Tipe Kendaraan",
    "motor": "Motor",
    "mobil": "Mobil",
    "vehicle_brand": "Merek / Jenis Kendaraan",
    "vehicle_brand_placeholder": "Contoh: Honda Beat, Toyota Avanza",
    "vehicle_photo": "Foto Kendaraan (opsional)",
    "damage_type": "Jenis Kerusakan",
    "damage_types": {
      "ban_bocor": "Ban Bocor / Pecah",
      "mesin_mati": "Mesin Mati / Mogok",
      "aki_soak": "Aki Soak / Habis",
      "rantai_putus": "Rantai Putus / Lepas",
      "rem_blong": "Rem Blong",
      "kelistrikan": "Masalah Kelistrikan",
      "lainnya": "Lainnya"
    },
    "damage_description": "Deskripsi Kerusakan",
    "damage_description_placeholder": "Jelaskan kerusakan secara singkat...",
    "damage_photo": "Foto Kerusakan (wajib)",
    "upload_photo": "Unggah Foto",
    "change_photo": "Ganti Foto",
    "your_location": "Lokasi Kamu",
    "detect_location": "Deteksi Lokasi GPS",
    "detecting": "Mendeteksi lokasi...",
    "location_detected": "Lokasi berhasil terdeteksi",
    "travel_fee": "Ongkos Jalan",
    "price_per_km": "Harga per Kilometer",
    "min_fee_alert": "Ongkos jalan minimum Rp5.000/km dari total jarak",
    "higher_fee_alert": "Menaikkan harga akan mempercepat ditemukannya mekanik",
    "total_fee": "Total Ongkos Jalan",
    "estimated_distance": "Estimasi Jarak",
    "submit_order": "Kirim Permintaan",
    "searching": "Mencari Mekanik...",
    "searching_desc": "Mengirim permintaan ke mekanik terdekat",
    "no_mitra_found": "Belum ada mekanik yang merespons",
    "cancel_search": "Batalkan Pencarian",
    "next": "Lanjut",
    "prev": "Kembali"
  },
  "chat": {
    "placeholder": "Ketik pesan...",
    "send": "Kirim",
    "filtered_message": "[Pesan tidak dapat ditampilkan]",
    "tab_chat": "Chat",
    "tab_status": "Status",
    "no_messages": "Belum ada pesan"
  },
  "status": {
    "searching": "Mencari",
    "negotiating": "Negosiasi",
    "agreed": "Deal",
    "otw": "Dalam Perjalanan",
    "arrived": "Sudah Tiba",
    "in_progress": "Dikerjakan",
    "completed": "Selesai",
    "cancelled_user": "Dibatalkan User",
    "cancelled_mitra": "Dibatalkan Mitra",
    "expired": "Kedaluwarsa"
  },
  "action": {
    "come_here": "Datang Kesini",
    "still_negotiating": "Masih Nego",
    "on_the_way": "OTW",
    "arrived": "Sudah Tiba",
    "start_work": "Mulai Kerjakan",
    "complete": "Selesai",
    "cancel": "Batalkan",
    "cancel_order": "Batalkan Pesanan",
    "confirm": "Konfirmasi",
    "save": "Simpan",
    "edit": "Edit",
    "delete": "Hapus",
    "close": "Tutup",
    "back": "Kembali",
    "view_detail": "Lihat Detail",
    "open_maps": "Buka di Maps",
    "call": "Telepon"
  },
  "review": {
    "title": "Beri Ulasan",
    "subtitle": "Bagaimana pengalamanmu dengan mekanik ini?",
    "rating_label": "Rating",
    "comment_label": "Komentar (opsional)",
    "comment_placeholder": "Ceritakan pengalamanmu...",
    "submit": "Kirim Ulasan",
    "thank_you": "Terima kasih atas ulasanmu!"
  },
  "mitra": {
    "dashboard_title": "Dashboard Mitra",
    "status_online": "Online",
    "status_offline": "Offline",
    "toggle_status": "Status Ketersediaan",
    "deposit_balance": "Saldo Deposit",
    "total_orders": "Total Pesanan",
    "avg_rating": "Rating Rata-rata",
    "incoming_orders": "Pesanan Masuk",
    "no_incoming": "Belum ada pesanan masuk",
    "active_order": "Pesanan Aktif",
    "deposit_history": "Riwayat Deposit",
    "topup": "Top Up",
    "commission": "Komisi Platform",
    "low_balance_warning": "Saldo deposit mendekati batas minimum!",
    "min_deposit_alert": "Saldo deposit minimum Rp10.000 untuk menerima pesanan",
    "register_title": "Daftar Menjadi Mitra",
    "register_subtitle": "Lengkapi data untuk menjadi mitra BeLink",
    "business_name": "Nama Bengkel / Usaha",
    "bio": "Bio Singkat",
    "ktp_upload": "Upload KTP",
    "selfie_upload": "Upload Foto Diri",
    "workshop_photo": "Foto Bengkel (opsional)",
    "submit_registration": "Kirim Pendaftaran",
    "verification_pending": "Menunggu Verifikasi",
    "verification_rejected": "Pendaftaran Ditolak"
  },
  "admin": {
    "dashboard_title": "Admin Dashboard",
    "total_users": "Total Pengguna",
    "total_mitra": "Total Mitra",
    "total_orders": "Total Pesanan",
    "total_revenue": "Total Revenue Komisi",
    "pending_verification": "Menunggu Verifikasi",
    "open_reports": "Laporan Terbuka",
    "user_management": "Manajemen Pengguna",
    "mitra_verification": "Verifikasi Mitra",
    "reports_management": "Manajemen Laporan",
    "ban": "Banned",
    "unban": "Aktifkan",
    "approve": "Setujui",
    "reject": "Tolak",
    "review_report": "Tinjau",
    "resolve": "Selesaikan",
    "dismiss": "Abaikan"
  },
  "profile": {
    "title": "Profil Saya",
    "edit_profile": "Edit Profil",
    "change_avatar": "Ganti Foto",
    "language": "Bahasa",
    "theme": "Tema",
    "theme_light": "Terang",
    "theme_dark": "Gelap",
    "become_mitra": "Daftar Menjadi Mitra",
    "member_since": "Bergabung sejak"
  },
  "history": {
    "title": "Riwayat Pesanan",
    "empty": "Belum ada riwayat pesanan",
    "filter_all": "Semua",
    "filter_completed": "Selesai",
    "filter_cancelled": "Dibatalkan",
    "filter_active": "Aktif"
  },
  "notification": {
    "title": "Notifikasi",
    "empty": "Tidak ada notifikasi",
    "mark_all_read": "Tandai semua dibaca"
  },
  "common": {
    "loading": "Memuat...",
    "error": "Terjadi kesalahan",
    "retry": "Coba lagi",
    "no_data": "Tidak ada data",
    "search": "Cari...",
    "km": "km",
    "currency": "Rp",
    "per_km": "/km"
  },
  "error": {
    "404_title": "Halaman Tidak Ditemukan",
    "404_desc": "Halaman yang kamu cari tidak ada atau sudah dipindahkan.",
    "go_home": "Kembali ke Beranda"
  }
}
```

### 2. Buat File Terjemahan Bahasa Inggris

**BUAT FILE**: `public/locales/en/translation.json`

```json
{
  "app": {
    "name": "BeLink",
    "tagline": "Nearest Mechanic Help, Anytime",
    "description": "GPS-based emergency vehicle service platform. Connect with the nearest mechanic in minutes."
  },
  "nav": {
    "home": "Home",
    "messages": "Messages",
    "history": "History",
    "notifications": "Notifications",
    "profile": "Profile",
    "dashboard": "Dashboard",
    "orders": "Orders",
    "deposit": "Deposit",
    "settings": "Settings",
    "admin": "Admin Panel",
    "users": "Users",
    "verification": "Verification",
    "reports": "Reports",
    "statistics": "Statistics"
  },
  "auth": {
    "login": "Sign In",
    "register": "Sign Up",
    "logout": "Sign Out",
    "email": "Email Address",
    "password": "Password",
    "confirm_password": "Confirm Password",
    "full_name": "Full Name",
    "phone": "Phone Number",
    "login_title": "Welcome Back",
    "login_subtitle": "Sign in to your BeLink account",
    "register_title": "Create Account",
    "register_subtitle": "Sign up to start using BeLink",
    "no_account": "Don't have an account?",
    "has_account": "Already have an account?",
    "register_here": "Sign up here",
    "login_here": "Sign in here",
    "error_email_exists": "Email already registered",
    "error_invalid_credentials": "Invalid email or password",
    "error_password_mismatch": "Passwords do not match",
    "error_password_min": "Password must be at least 6 characters"
  },
  "landing": {
    "hero_title": "Vehicle Breakdown?",
    "hero_subtitle": "Nearest Mechanic Ready to Help",
    "hero_description": "Just 1 click to call a professional mechanic to your location. Fast, safe, and transparent.",
    "cta_button": "Get Started",
    "cta_login": "Already Have an Account?",
    "feature_1_title": "Fast & Easy",
    "feature_1_desc": "Order a mechanic in just a few simple steps",
    "feature_2_title": "Accurate GPS",
    "feature_2_desc": "Auto location detection, mechanic knows your exact position",
    "feature_3_title": "Transparent Pricing",
    "feature_3_desc": "Travel fee set upfront, no hidden costs",
    "feature_4_title": "Direct Chat",
    "feature_4_desc": "Negotiate directly with mechanic via real-time chat"
  },
  "order": {
    "emergency_title": "Request Mechanic Help",
    "step_vehicle": "Vehicle Info",
    "step_damage": "Damage Details",
    "step_location": "Location & Cost",
    "vehicle_type": "Vehicle Type",
    "motor": "Motorcycle",
    "mobil": "Car",
    "vehicle_brand": "Vehicle Brand / Model",
    "vehicle_brand_placeholder": "e.g. Honda Beat, Toyota Avanza",
    "vehicle_photo": "Vehicle Photo (optional)",
    "damage_type": "Damage Type",
    "damage_types": {
      "ban_bocor": "Flat / Blown Tire",
      "mesin_mati": "Engine Dead / Stalled",
      "aki_soak": "Dead Battery",
      "rantai_putus": "Broken / Loose Chain",
      "rem_blong": "Brake Failure",
      "kelistrikan": "Electrical Issue",
      "lainnya": "Other"
    },
    "damage_description": "Damage Description",
    "damage_description_placeholder": "Briefly describe the damage...",
    "damage_photo": "Damage Photo (required)",
    "upload_photo": "Upload Photo",
    "change_photo": "Change Photo",
    "your_location": "Your Location",
    "detect_location": "Detect GPS Location",
    "detecting": "Detecting location...",
    "location_detected": "Location detected successfully",
    "travel_fee": "Travel Fee",
    "price_per_km": "Price per Kilometer",
    "min_fee_alert": "Minimum travel fee is Rp5,000/km of total distance",
    "higher_fee_alert": "Higher price will help find a mechanic faster",
    "total_fee": "Total Travel Fee",
    "estimated_distance": "Estimated Distance",
    "submit_order": "Submit Request",
    "searching": "Searching for Mechanic...",
    "searching_desc": "Sending request to nearby mechanics",
    "no_mitra_found": "No mechanic has responded yet",
    "cancel_search": "Cancel Search",
    "next": "Next",
    "prev": "Back"
  },
  "chat": {
    "placeholder": "Type a message...",
    "send": "Send",
    "filtered_message": "[Message cannot be displayed]",
    "tab_chat": "Chat",
    "tab_status": "Status",
    "no_messages": "No messages yet"
  },
  "status": {
    "searching": "Searching",
    "negotiating": "Negotiating",
    "agreed": "Agreed",
    "otw": "On the Way",
    "arrived": "Arrived",
    "in_progress": "In Progress",
    "completed": "Completed",
    "cancelled_user": "Cancelled by User",
    "cancelled_mitra": "Cancelled by Mitra",
    "expired": "Expired"
  },
  "action": {
    "come_here": "Come Here",
    "still_negotiating": "Still Negotiating",
    "on_the_way": "On My Way",
    "arrived": "I've Arrived",
    "start_work": "Start Working",
    "complete": "Complete",
    "cancel": "Cancel",
    "cancel_order": "Cancel Order",
    "confirm": "Confirm",
    "save": "Save",
    "edit": "Edit",
    "delete": "Delete",
    "close": "Close",
    "back": "Back",
    "view_detail": "View Detail",
    "open_maps": "Open in Maps",
    "call": "Call"
  },
  "review": {
    "title": "Leave a Review",
    "subtitle": "How was your experience with this mechanic?",
    "rating_label": "Rating",
    "comment_label": "Comment (optional)",
    "comment_placeholder": "Tell us about your experience...",
    "submit": "Submit Review",
    "thank_you": "Thank you for your review!"
  },
  "mitra": {
    "dashboard_title": "Mitra Dashboard",
    "status_online": "Online",
    "status_offline": "Offline",
    "toggle_status": "Availability Status",
    "deposit_balance": "Deposit Balance",
    "total_orders": "Total Orders",
    "avg_rating": "Average Rating",
    "incoming_orders": "Incoming Orders",
    "no_incoming": "No incoming orders",
    "active_order": "Active Order",
    "deposit_history": "Deposit History",
    "topup": "Top Up",
    "commission": "Platform Commission",
    "low_balance_warning": "Deposit balance is near the minimum limit!",
    "min_deposit_alert": "Minimum deposit balance of Rp10,000 required to accept orders",
    "register_title": "Become a Mitra",
    "register_subtitle": "Complete your data to become a BeLink mitra",
    "business_name": "Workshop / Business Name",
    "bio": "Short Bio",
    "ktp_upload": "Upload ID Card",
    "selfie_upload": "Upload Selfie",
    "workshop_photo": "Workshop Photo (optional)",
    "submit_registration": "Submit Registration",
    "verification_pending": "Pending Verification",
    "verification_rejected": "Registration Rejected"
  },
  "admin": {
    "dashboard_title": "Admin Dashboard",
    "total_users": "Total Users",
    "total_mitra": "Total Mitra",
    "total_orders": "Total Orders",
    "total_revenue": "Total Commission Revenue",
    "pending_verification": "Pending Verification",
    "open_reports": "Open Reports",
    "user_management": "User Management",
    "mitra_verification": "Mitra Verification",
    "reports_management": "Reports Management",
    "ban": "Ban",
    "unban": "Unban",
    "approve": "Approve",
    "reject": "Reject",
    "review_report": "Review",
    "resolve": "Resolve",
    "dismiss": "Dismiss"
  },
  "profile": {
    "title": "My Profile",
    "edit_profile": "Edit Profile",
    "change_avatar": "Change Photo",
    "language": "Language",
    "theme": "Theme",
    "theme_light": "Light",
    "theme_dark": "Dark",
    "become_mitra": "Become a Mitra",
    "member_since": "Member since"
  },
  "history": {
    "title": "Order History",
    "empty": "No order history yet",
    "filter_all": "All",
    "filter_completed": "Completed",
    "filter_cancelled": "Cancelled",
    "filter_active": "Active"
  },
  "notification": {
    "title": "Notifications",
    "empty": "No notifications",
    "mark_all_read": "Mark all as read"
  },
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong",
    "retry": "Try again",
    "no_data": "No data available",
    "search": "Search...",
    "km": "km",
    "currency": "Rp",
    "per_km": "/km"
  },
  "error": {
    "404_title": "Page Not Found",
    "404_desc": "The page you're looking for doesn't exist or has been moved.",
    "go_home": "Back to Home"
  }
}
```

### 3. Buat File Konfigurasi i18n

**BUAT FILE**: `src/lib/i18n.ts`

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Bahasa default: Indonesia
    fallbackLng: 'id',

    // Bahasa yang didukung
    supportedLngs: ['id', 'en'],

    // Namespace
    ns: ['translation'],
    defaultNS: 'translation',

    // Konfigurasi deteksi bahasa
    detection: {
      // Urutan prioritas deteksi bahasa
      order: ['localStorage', 'navigator'],
      // Simpan pilihan bahasa di localStorage
      caches: ['localStorage'],
      // Key localStorage
      lookupLocalStorage: 'belink-language',
    },

    // Interpolasi
    interpolation: {
      // React sudah melakukan XSS escaping
      escapeValue: false,
    },

    // Backend: load file JSON dari public/locales/
    // Kita gunakan dynamic import untuk mendukung Vite
    resources: undefined, // Akan diisi di bawah
  });

// Load translation files
const loadResources = async () => {
  try {
    const idTranslation = await fetch('/locales/id/translation.json').then((r) => r.json());
    const enTranslation = await fetch('/locales/en/translation.json').then((r) => r.json());

    i18n.addResourceBundle('id', 'translation', idTranslation);
    i18n.addResourceBundle('en', 'translation', enTranslation);
  } catch (error) {
    console.error('Failed to load translation files:', error);
  }
};

loadResources();

export default i18n;
```

---

## Validasi

- [ ] File `public/locales/id/translation.json` ada dan berisi terjemahan Bahasa Indonesia
- [ ] File `public/locales/en/translation.json` ada dan berisi terjemahan Bahasa Inggris
- [ ] File `src/lib/i18n.ts` ada
- [ ] Kedua file JSON valid (tidak ada trailing comma, syntax error)

---

## Cara Penggunaan (Referensi)

Di komponen React nanti, kita akan menggunakan:

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return <h1>{t('landing.hero_title')}</h1>;
  // Output ID: "Kendaraan Mogok?"
  // Output EN: "Vehicle Breakdown?"
}
```

---

**Selesai? Lanjut ke `05-buat-utility-functions.md`**

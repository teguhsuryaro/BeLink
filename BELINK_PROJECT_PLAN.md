# 🔗 BeLink — Dokumen Perencanaan Proyek (Project Blueprint)

> **Platform On-Demand Layanan Darurat Kendaraan Berbasis GPS**
> Dokumen ini adalah panduan lengkap pembangunan website BeLink dari nol untuk keperluan vibe coding.

---

## 📌 Daftar Isi

1. [Ringkasan Proyek](#1-ringkasan-proyek)
2. [Tech Stack & Arsitektur](#2-tech-stack--arsitektur)
3. [Dependency Lengkap](#3-dependency-lengkap)
4. [Desain Sistem & Tema](#4-desain-sistem--tema)
5. [Struktur Database (Supabase)](#5-struktur-database-supabase)
6. [Struktur Folder Proyek](#6-struktur-folder-proyek)
7. [Fitur Per Role](#7-fitur-per-role)
8. [Alur Halaman (Page Flow)](#8-alur-halaman-page-flow)
9. [Komponen UI Utama](#9-komponen-ui-utama)
10. [Internasionalisasi (i18n)](#10-internasionalisasi-i18n)
11. [Strategi Deployment](#11-strategi-deployment)
12. [Data Dummy & Seeding](#12-data-dummy--seeding)
13. [Checklist Pengerjaan](#13-checklist-pengerjaan)

---

## 1. Ringkasan Proyek

| Atribut | Detail |
|---|---|
| **Nama Platform** | BeLink |
| **Konsep** | On-demand layanan darurat kendaraan berbasis GPS |
| **Target Pengguna** | Pengguna umum (pemilik kendaraan), Mitra (mekanik/bengkel), Superadmin |
| **Model Bisnis** | Komisi 10% dari ongkos jalan, dipotong dari deposit mitra |
| **Fase** | Prototype (data dummy, tanpa verifikasi email) |
| **Bahasa UI** | Bilingual: Bahasa Indonesia & English (i18n) |
| **Platform Target** | Mobile-first, responsive untuk desktop |

---

## 2. Tech Stack & Arsitektur

### 🏗️ Frontend

| Layer | Teknologi | Alasan |
|---|---|---|
| **Framework** | [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/) | Bundler tercepat, HMR instan, DX terbaik |
| **Bahasa** | TypeScript | Type safety, mengurangi bug runtime |
| **Styling** | [Tailwind CSS v3](https://tailwindcss.com/) | Utility-first, dark mode built-in |
| **Routing** | [React Router DOM v6](https://reactrouter.com/) | Client-side routing, nested routes |
| **State Global** | [Zustand](https://zustand-demo.pmnd.rs/) | Ringan, simple, tanpa boilerplate |
| **Server State** | [TanStack Query v5](https://tanstack.com/query) | Caching, refetching, loading states |
| **Form** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Performa tinggi + validasi schema |
| **Animasi** | [Framer Motion](https://www.framer.com/motion/) | Smooth transition, gesture support |
| **Peta** | [React Leaflet](https://react-leaflet.js.org/) + [Leaflet](https://leafletjs.com/) | 100% gratis, no API key |
| **Tile Map** | OpenStreetMap | 100% gratis, open source |
| **Routing Jalan** | [OSRM](http://project-osrm.org/) (free public API) | Kalkulasi jarak rute berkendara gratis |
| **Icons** | [Lucide React](https://lucide.dev/) | Modern, konsisten, tree-shakeable |
| **i18n** | [i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/) | Solusi i18n paling mature di ekosistem React |
| **Date/Time** | [date-fns](https://date-fns.org/) | Ringan, tree-shakeable, no moment.js |
| **Toast/Notif** | [Sonner](https://sonner.emilkowal.ski/) | Minimalis, elegan, zero config |
| **Tooltip & UI Primitif** | [Radix UI](https://www.radix-ui.com/) | Accessible, headless, bisa dicustom penuh |

### 🗄️ Backend & Infrastruktur

| Layer | Teknologi | Alasan |
|---|---|---|
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) | Gratis 500MB, real-time, auth bawaan |
| **Auth** | Supabase Auth (Email + Password) | Built-in, tanpa verifikasi email (prototype) |
| **Real-time** | Supabase Realtime (Channels) | WebSocket gratis untuk chat & status order |
| **Storage** | Supabase Storage | 1GB gratis untuk foto profil, kendaraan, kerusakan |
| **Edge Functions** | Supabase Edge Functions (Deno) | Untuk logika komisi, anti-bypass filter |
| **RLS** | Supabase Row Level Security | Keamanan data per-role langsung di database |

### 🚀 DevOps & Deployment

| Layer | Teknologi | Alasan |
|---|---|---|
| **Version Control** | GitHub | Gratis, integrasi Vercel |
| **Hosting** | [Vercel](https://vercel.com/) | Gratis, auto-deploy dari GitHub push |
| **Environment** | `.env.local` + Vercel Env Vars | Memisahkan secrets dari kode |

### 🏛️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────┐
│                  BROWSER (Client)                │
│  React + Vite + TypeScript + Tailwind CSS        │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │  Zustand │ │  TanStack│ │  React Leaflet   │ │
│  │  (State) │ │  Query   │ │  + OSM + OSRM    │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
└───────────────────┬─────────────────────────────┘
                    │ HTTPS / WebSocket
┌───────────────────▼─────────────────────────────┐
│                  SUPABASE                        │
│  ┌─────────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ PostgreSQL  │ │Realtime  │ │   Storage    │  │
│  │ + RLS       │ │(Channels)│ │  (1GB Free)  │  │
│  └─────────────┘ └──────────┘ └──────────────┘  │
│  ┌─────────────┐                                 │
│  │   Auth      │                                 │
│  │(Email+Pass) │                                 │
│  └─────────────┘                                 │
└─────────────────────────────────────────────────┘
```

---

## 3. Dependency Lengkap

### `package.json` — Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "typescript": "^5.5.3",

    "@supabase/supabase-js": "^2.45.4",

    "zustand": "^4.5.5",
    "@tanstack/react-query": "^5.56.2",
    "@tanstack/react-query-devtools": "^5.56.2",

    "react-hook-form": "^7.53.0",
    "zod": "^3.23.8",
    "@hookform/resolvers": "^3.9.0",

    "framer-motion": "^11.9.0",

    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "@types/leaflet": "^1.9.12",

    "lucide-react": "^0.441.0",

    "i18next": "^23.15.1",
    "react-i18next": "^15.0.2",
    "i18next-browser-languagedetector": "^8.0.0",

    "date-fns": "^3.6.0",

    "sonner": "^1.5.0",

    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-tabs": "^1.1.1",
    "@radix-ui/react-tooltip": "^1.1.3",
    "@radix-ui/react-avatar": "^1.1.1",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-switch": "^1.1.1",
    "@radix-ui/react-badge": "^1.0.0",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slot": "^1.1.0",

    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.8",
    "@types/react": "^18.3.9",
    "@types/react-dom": "^18.3.0",
    "tailwindcss": "^3.4.13",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "eslint": "^9.11.1",
    "@typescript-eslint/eslint-plugin": "^8.7.0",
    "@typescript-eslint/parser": "^8.7.0",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.12",
    "prettier": "^3.3.3",
    "prettier-plugin-tailwindcss": "^0.6.8"
  }
}
```

### Inisialisasi Proyek

```bash
# 1. Buat proyek baru di folder BELINK
npm create vite@latest . -- --template react-ts

# 2. Install semua dependencies sekaligus
npm install react-router-dom @supabase/supabase-js zustand @tanstack/react-query @tanstack/react-query-devtools react-hook-form zod @hookform/resolvers framer-motion leaflet react-leaflet @types/leaflet lucide-react i18next react-i18next i18next-browser-languagedetector date-fns sonner @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs @radix-ui/react-tooltip @radix-ui/react-avatar @radix-ui/react-select @radix-ui/react-switch @radix-ui/react-progress @radix-ui/react-separator @radix-ui/react-slot clsx tailwind-merge class-variance-authority

# 3. Install dev dependencies
npm install -D tailwindcss autoprefixer postcss prettier prettier-plugin-tailwindcss eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react-hooks eslint-plugin-react-refresh

# 4. Setup Tailwind
npx tailwindcss init -p
```

---

## 4. Desain Sistem & Tema

### 🎨 Palet Warna

| Token | Nilai | Penggunaan |
|---|---|---|
| `primary` | `#3661E2` | CTA, tombol utama, link aktif |
| `primary-light` | `#5B80F0` | Hover state, gradient awal |
| `primary-dark` | `#1E47C8` | Active state, pressed |
| `primary-muted` | `#3661E210` | Background tinted, card highlight |
| `surface-light` | `#F8F9FF` | Background halaman (mode terang, tidak menyilaukan) |
| `surface-dark` | `#0F1117` | Background halaman (mode gelap) |
| `card-light` | `#FFFFFF` | Card/panel (mode terang) |
| `card-dark` | `#1A1D27` | Card/panel (mode gelap) |
| `text-primary-light` | `#1A1F36` | Teks utama (mode terang) |
| `text-primary-dark` | `#E8EAED` | Teks utama (mode gelap) |
| `text-muted-light` | `#6B7280` | Teks sekunder (mode terang) |
| `text-muted-dark` | `#9CA3AF` | Teks sekunder (mode gelap) |
| `success` | `#10B981` | Status selesai, berhasil |
| `warning` | `#F59E0B` | Peringatan, saldo menipis |
| `danger` | `#EF4444` | Error, pembatalan |
| `border-light` | `#E5E7EB` | Garis pembatas (mode terang) |
| `border-dark` | `#2D3748` | Garis pembatas (mode gelap) |

### 🌙 Dark / Light Mode

- **Default**: Mode Terang (`light`)
- **Persistensi**: Disimpan di `localStorage` via Zustand
- **Implementasi**: Tailwind `darkMode: 'class'` — toggle class `dark` pada `<html>`
- **Transisi**: `transition-colors duration-300` pada seluruh elemen agar perpindahan tema halus

### ✍️ Tipografi

```css
/* Font dari Google Fonts (gratis) */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

/* Plus Jakarta Sans — modern, humanis, nyaman dibaca di layar kecil */
font-family: 'Plus Jakarta Sans', sans-serif;
```

### ✨ Panduan Animasi

| Tipe Animasi | Library | Keterangan |
|---|---|---|
| **Page Transition** | Framer Motion `AnimatePresence` | Fade + slight slide saat pindah halaman |
| **Skeleton Loading** | CSS animation (`animate-pulse` Tailwind) | Placeholder saat data loading |
| **Button Press** | Framer Motion `whileTap` | Scale down 0.96 saat diklik |
| **Card Hover** | CSS `transition + transform` | Elevate ringan `translateY(-2px) shadow-md` |
| **Notification Toast** | Sonner bawaan | Slide in dari bawah, auto-dismiss |
| **Modal/Dialog** | Framer Motion + Radix | Fade + scale masuk dari tengah |
| **Status Badge** | CSS keyframe `ping` | Pulse dot untuk status online/aktif |
| **Map Pin** | Leaflet CSS + Framer | Drop-in saat marker ditambahkan |

### 🔄 Loading States

- **Skeleton Screen** — untuk list mitra, riwayat order, dashboard stats
- **Spinner Circular** — untuk aksi tombol (submit, OTW, selesai)
- **Progress Bar** — di atas halaman saat navigasi antar route (NProgress-style, pure CSS)
- **Optimistic Update** — status order langsung diupdate di UI sebelum konfirmasi server (via TanStack Query)

### 📐 Prinsip Layout

- **Mobile-first**: semua breakpoint dimulai dari `sm:` ke atas
- **Safe Area**: padding bottom untuk menghindari gesture bar di iOS/Android
- **Bottom Navigation**: navigasi utama di bawah layar untuk mobile (bukan header)
- **Side Navigation**: sidebar collapsible untuk dashboard desktop

---

## 5. Struktur Database (Supabase)

### Tabel: `profiles`

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'mitra_independen', 'mitra_bengkel', 'superadmin')),
  is_banned BOOLEAN DEFAULT FALSE,
  is_online BOOLEAN DEFAULT FALSE,
  language_preference TEXT DEFAULT 'id' CHECK (language_preference IN ('id', 'en')),
  theme_preference TEXT DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabel: `mitra_profiles`

```sql
CREATE TABLE mitra_profiles (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  business_name TEXT,
  bio TEXT,
  ktp_url TEXT,
  selfie_url TEXT,
  workshop_photo_url TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  address TEXT,
  deposit_balance NUMERIC(12, 2) DEFAULT 0.00,
  total_orders_completed INTEGER DEFAULT 0,
  average_rating NUMERIC(3, 2) DEFAULT 0.00,
  verification_status TEXT DEFAULT 'pending'
    CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  is_accepting_orders BOOLEAN DEFAULT TRUE,
  max_concurrent_orders INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabel: `orders`

```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  mitra_id UUID REFERENCES profiles(id),
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('motor', 'mobil')),
  vehicle_brand TEXT,
  vehicle_photo_url TEXT,
  damage_description TEXT,
  damage_photo_url TEXT,
  user_lat DOUBLE PRECISION NOT NULL,
  user_lng DOUBLE PRECISION NOT NULL,
  user_address TEXT,
  mitra_lat DOUBLE PRECISION,
  mitra_lng DOUBLE PRECISION,
  route_distance_km NUMERIC(8, 2),
  travel_fee NUMERIC(12, 2) NOT NULL,
  platform_commission NUMERIC(12, 2),
  status TEXT DEFAULT 'searching'
    CHECK (status IN (
      'searching',
      'negotiating',
      'agreed',
      'otw',
      'arrived',
      'in_progress',
      'completed',
      'cancelled_user',
      'cancelled_mitra',
      'expired'
    )),
  agreed_at TIMESTAMPTZ,
  otw_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabel: `order_reviews`

```sql
CREATE TABLE order_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) UNIQUE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) NOT NULL,
  reviewee_id UUID REFERENCES profiles(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabel: `chats`

```sql
CREATE TABLE chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) NOT NULL,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  message TEXT NOT NULL,
  is_filtered BOOLEAN DEFAULT FALSE,
  original_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabel: `deposit_transactions`

```sql
CREATE TABLE deposit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mitra_id UUID REFERENCES profiles(id) NOT NULL,
  order_id UUID REFERENCES orders(id),
  type TEXT NOT NULL CHECK (type IN ('topup', 'commission_deduction')),
  amount NUMERIC(12, 2) NOT NULL,
  balance_after NUMERIC(12, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabel: `reports`

```sql
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) NOT NULL,
  reported_id UUID REFERENCES profiles(id) NOT NULL,
  order_id UUID REFERENCES orders(id),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'reviewed', 'resolved', 'dismissed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabel: `notifications`

```sql
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('order', 'chat', 'deposit', 'system', 'review')),
  is_read BOOLEAN DEFAULT FALSE,
  related_order_id UUID REFERENCES orders(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS) — Ringkasan

| Tabel | Policy |
|---|---|
| `profiles` | User hanya bisa baca/edit profil sendiri. Superadmin bisa baca semua. |
| `mitra_profiles` | Semua user terautentikasi bisa baca data publik mitra. Mitra hanya bisa edit miliknya sendiri. |
| `orders` | User hanya bisa baca order miliknya. Mitra bisa baca order yang ditugaskan padanya. |
| `chats` | Hanya peserta order (user + mitra) yang bisa baca/kirim pesan. |
| `deposit_transactions` | Hanya mitra yang bersangkutan yang bisa membaca transaksinya. Superadmin bisa baca semua. |
| `reports` | Reporter bisa baca laporannya sendiri. Superadmin bisa baca dan update semua. |
| `notifications` | User hanya bisa baca notifikasi miliknya. |

### Supabase Realtime — Subscribe Channels

| Channel | Trigger | Penerima |
|---|---|---|
| `order:order_id` | UPDATE pada tabel `orders` | User & Mitra pada order tersebut |
| `chat:order_id` | INSERT pada tabel `chats` | User & Mitra pada order tersebut |
| `notifications:user_id` | INSERT pada tabel `notifications` | User yang bersangkutan |
| `mitra_location` | UPDATE `lat/lng` pada `mitra_profiles` | User yang sedang dalam status `otw` |

---

## 6. Struktur Folder Proyek

```
belink/
├── public/
│   ├── favicon.svg
│   ├── logo.svg
│   └── locales/
│       ├── id/
│       │   └── translation.json
│       └── en/
│           └── translation.json
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── ui/                     # Komponen dasar (Button, Input, Badge, dll)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Avatar.tsx
│   │   │   └── Toast.tsx
│   │   ├── layout/                 # Layout wrappers
│   │   │   ├── AppLayout.tsx       # Layout utama (navbar + konten)
│   │   │   ├── DashboardLayout.tsx # Layout dashboard dengan sidebar
│   │   │   ├── MobileNav.tsx       # Bottom navigation mobile
│   │   │   ├── DesktopNav.tsx      # Topbar / sidebar desktop
│   │   │   └── PageTransition.tsx  # Wrapper animasi perpindahan halaman
│   │   ├── map/                    # Komponen peta
│   │   │   ├── MapView.tsx
│   │   │   ├── LocationPicker.tsx
│   │   │   └── MitraMarkers.tsx
│   │   ├── order/                  # Komponen spesifik order
│   │   │   ├── OrderForm.tsx       # Form darurat
│   │   │   ├── OrderCard.tsx
│   │   │   ├── OrderStatusBadge.tsx
│   │   │   └── ReviewModal.tsx
│   │   ├── chat/                   # Komponen chat
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── ChatBubble.tsx
│   │   │   └── ChatInput.tsx
│   │   ├── mitra/                  # Komponen spesifik mitra
│   │   │   ├── MitraCard.tsx
│   │   │   ├── DepositWidget.tsx
│   │   │   └── MitraStatsCard.tsx
│   │   └── admin/                  # Komponen panel superadmin
│   │       ├── UserTable.tsx
│   │       ├── VerificationCard.tsx
│   │       └── StatsWidget.tsx
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useOrders.ts
│   │   ├── useChat.ts
│   │   ├── useGeolocation.ts
│   │   ├── useRealtimeOrder.ts
│   │   ├── useTheme.ts
│   │   └── useLanguage.ts
│   ├── lib/                        # Utilities dan konfigurasi
│   │   ├── supabase.ts             # Supabase client
│   │   ├── queryClient.ts          # TanStack Query client
│   │   ├── i18n.ts                 # Konfigurasi i18next
│   │   ├── utils.ts                # Helper functions (cn, formatIDR, dll)
│   │   ├── constants.ts            # Konstanta (MIN_DEPOSIT, COMMISSION_RATE, dll)
│   │   └── validators.ts           # Zod schemas
│   ├── pages/
│   │   ├── public/                 # Halaman tanpa auth
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── user/                   # Halaman pengguna biasa
│   │   │   ├── HomePage.tsx
│   │   │   ├── OrderPage.tsx       # Form pemesanan darurat
│   │   │   ├── ActiveOrderPage.tsx # Halaman saat sedang ada order aktif
│   │   │   ├── HistoryPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── RegisterMitraPage.tsx
│   │   ├── mitra/                  # Halaman dashboard mitra
│   │   │   ├── MitraDashboard.tsx
│   │   │   ├── IncomingOrdersPage.tsx
│   │   │   ├── ActiveNegotiationPage.tsx
│   │   │   ├── MitraHistoryPage.tsx
│   │   │   ├── DepositPage.tsx
│   │   │   └── MitraProfilePage.tsx
│   │   ├── admin/                  # Halaman panel superadmin
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── UsersManagementPage.tsx
│   │   │   ├── MitraVerificationPage.tsx
│   │   │   ├── ReportsPage.tsx
│   │   │   └── StatisticsPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── store/                      # Zustand stores
│   │   ├── authStore.ts            # State autentikasi & user session
│   │   ├── themeStore.ts           # State tema (light/dark)
│   │   ├── orderStore.ts           # State order aktif
│   │   └── notificationStore.ts    # State notifikasi
│   ├── types/                      # TypeScript type definitions
│   │   ├── database.types.ts       # Generated dari Supabase CLI
│   │   ├── order.types.ts
│   │   ├── user.types.ts
│   │   └── mitra.types.ts
│   ├── router/
│   │   ├── index.tsx               # Definisi semua routes
│   │   ├── ProtectedRoute.tsx      # Guard route berdasarkan role
│   │   └── PublicRoute.tsx         # Redirect jika sudah login
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                   # Base styles + Tailwind imports + CSS vars
├── .env.local                      # Environment variables (tidak di-commit)
├── .env.example                    # Template .env untuk tim
├── .gitignore
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── postcss.config.js
├── .eslintrc.cjs
├── .prettierrc
└── README.md
```

---

## 7. Fitur Per Role

### 👤 Pengguna Biasa (`user`)

| Fitur | Deskripsi |
|---|---|
| Landing page | Bisa diakses tanpa login (guest mode) |
| Register / Login | Email + Password, tanpa verifikasi email |
| Form Darurat | Input kendaraan, kerusakan, lokasi GPS otomatis |
| Pemilihan Ongkos Jalan | Slider/input dengan batas min Rp5.000/km |
| Searching Mitra | Animasi pencarian, ping ke mitra terdekat |
| Halaman Negosiasi | Chat + Tab Status order |
| Tombol "Datang Kesini" | Konfirmasi deal, tombol berubah warna |
| Tracking OTW | Lihat posisi mitra di peta saat status OTW |
| Beri Ulasan | Setelah order selesai |
| Riwayat Order | Semua order dengan detail dan status |
| Pengaturan Profil | Nama, foto, ganti bahasa, ganti tema |
| Daftar Menjadi Mitra | Upload KTP, foto diri, info bengkel |

### 🔧 Mitra Independen & Bengkel (`mitra_independen` / `mitra_bengkel`)

| Fitur | Deskripsi |
|---|---|
| Dashboard Mitra | Statistik, saldo deposit, status online/offline |
| Toggle Online/Offline | Muncul/hilang dari radar pencarian pengguna |
| Notifikasi Order Masuk | Real-time ping saat ada order di area |
| Halaman Negosiasi | Chat + lihat detail order + tombol OTW |
| Tombol OTW | Aktif setelah pengguna setuju, mengunci pembatalan user |
| Navigasi ke Lokasi | Buka Google Maps / Waze dengan koordinat tujuan |
| Tombol Selesai | Tandai order selesai, trigger pemotongan komisi |
| Riwayat Order | Termasuk history komisi yang dipotong |
| Manajemen Deposit | Lihat saldo, lihat riwayat transaksi |
| Profil Mitra | Edit info, upload foto profil baru |
| Soft Alert Saldo Rendah | Notifikasi jika saldo mendekati batas minimum |

### 👑 Superadmin (`superadmin`)

| Fitur | Deskripsi |
|---|---|
| Dashboard Admin | Statistik total user, mitra, order, revenue komisi |
| Verifikasi Pendaftaran Mitra | Review dokumen, approve/reject |
| Manajemen User | Ban/unban user, lihat detail profil |
| Manajemen Mitra | Ban/unban mitra, lihat data deposit |
| Manajemen Laporan | Tinjau report dari user/mitra |
| Statistik Platform | Grafik order, revenue, user growth (sederhana) |

---

## 8. Alur Halaman (Page Flow)

```
[Landing Page]
     │
     ├─── [Login Page] ──────────────────────────────────────────────────┐
     └─── [Register Page] ──────────────────────────────────────────────┐│
                                                                         ││
     ┌───────────────────────────────────────────────────────────────────┘│
     │   ┌────────────────────────────────────────────────────────────────┘
     ▼   ▼
[Home Page (user)]
     │
     ├─── [Order Page] (Form darurat)
     │         │
     │         └─── [Active Order Page] (Searching → Negotiating → OTW → Completed)
     │                   │
     │                   └─── [Review Modal]
     │
     ├─── [History Page]
     ├─── [Profile Page]
     │         └─── [Register Mitra Page]
     └─── [Settings] (bahasa, tema — terintegrasi di Profile)

[Mitra Dashboard]
     │
     ├─── [Incoming Orders Page] (list order baru)
     │         └─── [Active Negotiation Page]
     │
     ├─── [Mitra History Page]
     ├─── [Deposit Page]
     └─── [Mitra Profile Page]

[Admin Dashboard]
     │
     ├─── [Users Management Page]
     ├─── [Mitra Verification Page]
     ├─── [Reports Page]
     └─── [Statistics Page]
```

---

## 9. Komponen UI Utama

### Navigasi Mobile (Bottom Navigation)
- 5 item: Beranda, Pesan, Riwayat, Notifikasi, Profil
- Icon dari Lucide React
- Active indicator: garis biru di atas icon + warna primary
- Animasi: tab switcher dengan slide indicator menggunakan Framer Motion

### Navigasi Desktop (Sidebar / Topbar)
- Sidebar collapsible untuk dashboard mitra dan admin
- Topbar dengan logo, notifikasi bell, avatar dropdown untuk halaman user biasa
- Responsive: sidebar terlipat jadi bottom nav di mobile

### Kartu Order (OrderCard)
- Menampilkan: status badge (warna), alamat, jenis kendaraan, ongkos jalan, waktu
- Hover: slight elevation
- Klik: buka detail

### Halaman Negosiasi (ActiveOrderPage / ActiveNegotiationPage)
- Tab Switcher: **CHAT** | **STATUS** (menggunakan Radix UI Tabs)
- Chat bubble: pesan user di kanan (primary color), mitra di kiri (neutral)
- Pesan yang difilter ditampilkan dengan tanda `[Pesan tidak dapat ditampilkan]` bergaris
- Status tab: peta mini, detail order, tombol aksi

### Map View
- Fullscreen dengan overlay kontrol di atas
- Marker user: ikon lokasi biru
- Marker mitra: ikon motor/mobil dengan warna berdasarkan status
- Radius pencarian: lingkaran animasi pulsing saat searching

### Form Darurat
- Step-by-step wizard (3 langkah):
  1. Data Kendaraan (tipe, merek/foto)
  2. Detail Kerusakan (pilihan / manual + foto)
  3. Lokasi & Ongkos Jalan
- Progress indicator di atas (stepper)
- Tombol navigasi antar langkah dengan animasi slide

---

## 10. Internasionalisasi (i18n)

### Konfigurasi

```typescript
// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'id',
    supportedLngs: ['id', 'en'],
    ns: ['translation'],
    defaultNS: 'translation',
    resources: {
      id: { translation: require('../public/locales/id/translation.json') },
      en: { translation: require('../public/locales/en/translation.json') },
    },
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
```

### Struktur File Terjemahan (Contoh)

```json
// public/locales/id/translation.json (ringkasan kunci)
{
  "nav": {
    "home": "Beranda",
    "history": "Riwayat",
    "profile": "Profil",
    "notifications": "Notifikasi"
  },
  "order": {
    "emergency_title": "Minta Bantuan Mekanik",
    "vehicle_type": "Tipe Kendaraan",
    "motor": "Motor",
    "mobil": "Mobil",
    "damage_description": "Deskripsi Kerusakan",
    "travel_fee": "Ongkos Jalan",
    "searching": "Mencari Mekanik...",
    "min_fee_alert": "Ongkos jalan minimum Rp5.000/km dari total jarak"
  },
  "chat": {
    "placeholder": "Ketik pesan...",
    "filtered_message": "[Pesan tidak dapat ditampilkan]",
    "tab_chat": "Chat",
    "tab_status": "Status"
  },
  "status": {
    "searching": "Mencari",
    "negotiating": "Negosiasi",
    "agreed": "Deal",
    "otw": "Dalam Perjalanan",
    "completed": "Selesai",
    "cancelled": "Dibatalkan"
  }
}
```

---

## 11. Strategi Deployment

### Environment Variables (`.env.local`)

```env
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_APP_NAME=BeLink
VITE_APP_ENV=development
```

### `.env.example` (dikompres ke GitHub)

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_APP_NAME=BeLink
VITE_APP_ENV=development
```

### Alur GitHub → Vercel

```
1. Push ke GitHub (branch: main)
      │
      ▼
2. Vercel mendeteksi push otomatis
      │
      ▼
3. Vercel menjalankan: npm run build (vite build)
      │
      ▼
4. Output: /dist — di-serve sebagai static site
      │
      ▼
5. URL Production: https://belink.vercel.app
```

### Konfigurasi Vercel

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Set `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` di dashboard Vercel
- **SPA Routing**: Tambahkan file `vercel.json` untuk redirect semua route ke `index.html`

```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Supabase Config untuk Prototype

Di **Supabase Dashboard → Auth → Settings**:
- ✅ Matikan **Email Confirmations** (`Confirm email` → OFF)
- ✅ Aktifkan **Allow new users to sign up**
- ✅ Set **Site URL** ke URL Vercel production

---

## 12. Data Dummy & Seeding

### Akun Test yang Akan Dibuat

| Role | Email | Password | Catatan |
|---|---|---|---|
| User biasa | `user1@belink.id` | `Test1234!` | Pengguna yang akan memesan |
| User biasa 2 | `user2@belink.id` | `Test1234!` | |
| Mitra Independen | `mitra1@belink.id` | `Test1234!` | Deposit cukup, verified |
| Mitra Independen 2 | `mitra2@belink.id` | `Test1234!` | Deposit rendah (soft alert) |
| Mitra Bengkel | `bengkel1@belink.id` | `Test1234!` | Bisa terima banyak order |
| Superadmin | `admin@belink.id` | `Admin1234!` | Full akses |

### Data Dummy yang Diisi

- 10+ order dengan berbagai status (selesai, dibatalkan, dalam proses)
- Chat history per order (minimal 5 pesan per chat)
- Riwayat deposit & komisi untuk mitra
- 3+ laporan (reports) dengan status berbeda
- Rating & ulasan untuk mitra

### Script Seeding

Seeding akan dilakukan menggunakan **Supabase SQL Editor** dengan file SQL terpisah (`seed.sql`) yang dijalankan sekali saat setup pertama kali. File seed akan mencakup INSERT statements untuk semua tabel dummy di atas.

---

## 13. Checklist Pengerjaan

### Phase 0 — Setup & Konfigurasi
- [ ] Init proyek Vite + React + TypeScript
- [ ] Setup Tailwind CSS + custom config (warna, font)
- [ ] Setup ESLint + Prettier
- [ ] Konfigurasi Supabase project (buat project baru)
- [ ] Setup environment variables
- [ ] Buat repository GitHub, push initial commit
- [ ] Connect GitHub ke Vercel

### Phase 1 — Fondasi
- [ ] Buat semua tabel database di Supabase
- [ ] Setup RLS policies
- [ ] Setup Supabase Realtime channels
- [ ] Setup Supabase Storage buckets (avatars, vehicles, damage)
- [ ] Konfigurasi i18n (id + en)
- [ ] Buat komponen UI dasar (Button, Input, Card, Badge, Skeleton, Modal)
- [ ] Buat layout utama (AppLayout, MobileNav, DesktopNav)
- [ ] Buat PageTransition wrapper
- [ ] Implementasi Dark/Light mode toggle
- [ ] Setup routing + ProtectedRoute

### Phase 2 — Autentikasi
- [ ] Halaman Landing Page (guest mode)
- [ ] Halaman Register (Email + Password, tanpa verifikasi)
- [ ] Halaman Login
- [ ] Auth store (Zustand)
- [ ] Redirect logic sesuai role setelah login

### Phase 3 — Fitur User (Pemesanan)
- [ ] Home Page user
- [ ] Form Darurat (step wizard)
- [ ] Integrasi Leaflet Map + OpenStreetMap
- [ ] Deteksi lokasi GPS otomatis
- [ ] Kalkulasi jarak via OSRM API
- [ ] Logika pencarian mitra terdekat
- [ ] Halaman Active Order (searching → negotiating)
- [ ] Real-time chat (Supabase Realtime)
- [ ] Anti-bypass filter (filter nomor HP dan URL)
- [ ] Tab Status order
- [ ] Tombol "Datang Kesini" + "OTW"
- [ ] Tracking peta saat OTW
- [ ] Tombol Selesai + Review Modal
- [ ] Halaman History Order

### Phase 4 — Fitur Mitra (Dashboard)
- [ ] Dashboard Mitra (statistik, saldo)
- [ ] Toggle Online/Offline
- [ ] Halaman Incoming Orders (real-time)
- [ ] Halaman Active Negotiation
- [ ] Logika OTW → Selesai + auto-potong komisi
- [ ] Halaman Deposit (riwayat transaksi)
- [ ] Soft alert saldo rendah
- [ ] Mitra History Page

### Phase 5 — Fitur Superadmin
- [ ] Admin Dashboard (statistik)
- [ ] Users Management (ban/unban)
- [ ] Mitra Verification (approve/reject)
- [ ] Reports Management
- [ ] Statistics Page

### Phase 6 — Polishing & Testing
- [ ] Seeding data dummy
- [ ] Review semua animasi & loading states
- [ ] Test responsivitas mobile (375px, 414px)
- [ ] Test responsivitas desktop (1280px, 1440px)
- [ ] Test dark/light mode di semua halaman
- [ ] Test ganti bahasa (id/en) di semua halaman
- [ ] Performance check (lazy loading, code splitting)
- [ ] Deploy final ke Vercel + set env vars
- [ ] Test end-to-end: Register → Order → Chat → OTW → Selesai

---

## 📝 Catatan Penting

> **Gratis 100%** — Seluruh stack ini dapat dioperasikan tanpa biaya:
> - Supabase Free Tier: 500MB DB, 1GB Storage, 50MB Edge Functions
> - Vercel Free Tier: 100GB bandwidth/bulan, unlimited deployments
> - OpenStreetMap + OSRM: 100% gratis tanpa API key
> - Semua library NPM: MIT License

> **Prototype Notes** — Karena ini adalah prototype:
> - Verifikasi email dinonaktifkan di Supabase
> - Top-up deposit mitra adalah proses manual (admin input manual lewat SQL atau panel admin)
> - Pembayaran antara user dan mitra dilakukan di luar sistem (cash/transfer)

> **Anti-Bypass Filter** — Implementasi sederhana via regex di sisi client dan Edge Function:
> ```
> Pattern HP: /(\+62|08)[0-9]{8,12}/g
> Pattern URL: /(https?:\/\/|www\.)[^\s]+/gi
> Pattern nomor umum: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g
> ```

---

*Dokumen ini dibuat sebagai panduan vibe coding BeLink. Selalu rujuk dokumen ini sebelum memulai pengerjaan setiap phase.*

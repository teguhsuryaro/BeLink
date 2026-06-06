# 02 - Konfigurasi TypeScript

## Tujuan
Mengoptimalkan konfigurasi TypeScript untuk proyek React + Vite dengan path aliases.

---

## Langkah-Langkah

### 1. Edit `tsconfig.json`

**EDIT FILE**: `tsconfig.json`

**Ganti seluruh isi file** dengan:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,

    /* Path Aliases — agar bisa import dengan @/ */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "vite-env.d.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 2. Pastikan `tsconfig.node.json` Ada

File ini biasanya sudah dibuat oleh Vite. Jika ada, biarkan apa adanya. Jika tidak ada:

**BUAT FILE**: `tsconfig.node.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["vite.config.ts", "tailwind.config.ts"]
}
```

---

## Penjelasan Path Alias

Dengan konfigurasi di atas, kamu bisa mengimport file dengan `@/` alih-alih path relatif panjang:

```typescript
// Sebelum (tanpa alias) — sulit dibaca
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';

// Sesudah (dengan alias @/) — bersih dan jelas
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
```

Path alias `@/` ini akan dikonfigurasi juga di `vite.config.ts` nanti (file `04-konfigurasi-vite.md`).

---

## Validasi

- [ ] File `tsconfig.json` berisi konfigurasi di atas termasuk `paths` dengan `@/*`
- [ ] File `tsconfig.node.json` ada dan include `vite.config.ts` dan `tailwind.config.ts`
- [ ] Jalankan `npm run dev` — tidak ada error TypeScript

---

**Selesai? Lanjut ke `03-konfigurasi-eslint-prettier.md`**

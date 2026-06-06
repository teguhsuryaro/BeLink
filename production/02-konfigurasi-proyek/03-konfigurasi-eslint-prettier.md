# 03 - Konfigurasi ESLint dan Prettier

## Tujuan
Setup code linting (ESLint) dan formatting (Prettier) agar kode konsisten dan bersih.

---

## Langkah-Langkah

### 1. Buat File ESLint Config

**BUAT FILE**: `.eslintrc.cjs`

Jika file ESLint sudah ada (misalnya `eslint.config.js` dari Vite), **hapus** file lama tersebut dan buat file baru ini:

```javascript
/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react-refresh'],
  rules: {
    // React Refresh
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    // TypeScript — izinkan `any` dalam beberapa kasus (prototype)
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],

    // Umum
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
  },
};
```

### 2. Buat File Prettier Config

**BUAT FILE**: `.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 3. Buat File Prettier Ignore

**BUAT FILE**: `.prettierignore`

```
node_modules/
dist/
build/
*.min.js
*.min.css
package-lock.json
```

### 4. Hapus File ESLint Lama (Jika Ada)

Vite terbaru mungkin membuat `eslint.config.js` (flat config). Kita menggunakan format lama (`.eslintrc.cjs`) karena lebih stabil dengan plugin yang kita pakai.

**PERINTAH** — Hapus file lama jika ada:

```powershell
# Hanya jika file eslint.config.js ada
Remove-Item eslint.config.js -ErrorAction SilentlyContinue
```

### 5. Tambahkan Script di package.json

**EDIT FILE**: `package.json`

Tambahkan script berikut di bagian `"scripts"` (jangan hapus script yang sudah ada, tambahkan saja):

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,json}\""
  }
}
```

---

## Validasi

- [ ] File `.eslintrc.cjs` sudah ada
- [ ] File `.prettierrc` sudah ada
- [ ] File `.prettierignore` sudah ada
- [ ] Tidak ada file `eslint.config.js` (sudah diganti `.eslintrc.cjs`)
- [ ] Jalankan `npm run lint` — tidak ada error kritis (warning tidak apa-apa)
- [ ] Jalankan `npm run format` — file-file di `src/` terformat ulang tanpa error

---

**Selesai? Lanjut ke `04-konfigurasi-vite.md`**

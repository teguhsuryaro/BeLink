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

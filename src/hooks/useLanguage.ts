import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export function useLanguage() {
  const { i18n, t } = useTranslation();

  const currentLanguage = i18n.language as 'id' | 'en';

  const setLanguage = useCallback(
    (lang: 'id' | 'en') => {
      i18n.changeLanguage(lang);
    },
    [i18n],
  );

  const toggleLanguage = useCallback(() => {
    const newLang = currentLanguage === 'id' ? 'en' : 'id';
    i18n.changeLanguage(newLang);
  }, [currentLanguage, i18n]);

  return {
    language: currentLanguage,
    isIndonesian: currentLanguage === 'id',
    isEnglish: currentLanguage === 'en',
    setLanguage,
    toggleLanguage,
    t,
  };
}

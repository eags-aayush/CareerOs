
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import enTranslations, { TranslationKeys } from '../localization/en';
import hiTranslations from '../localization/hi';
import mrTranslations from '../localization/mr';

type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => any;
}

const translations: Record<Language, TranslationKeys> = {
  en: enTranslations,
  hi: hiTranslations,
  mr: mrTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to get nested values from translation object
const getNestedTranslation = (obj: any, key: string): string => {
  return key.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('language') as Language) || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);
  
  const t = (key: string): any => {
    const translation = getNestedTranslation(translations[language], key);
    if (translation === undefined) {
      console.warn(`Translation key "${key}" not found for language "${language}". Falling back to English.`);
      return getNestedTranslation(translations['en'], key) || key;
    }
    return translation;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

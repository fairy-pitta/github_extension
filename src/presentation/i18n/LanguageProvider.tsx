import React, { useState, useEffect, ReactNode } from 'react';
import { Container } from '@/application/di/Container';
import { StorageKeys } from '@/application/config/StorageKeys';
import { Language, translations } from './translations';
import { LanguageContext } from './useLanguage';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const container = Container.getInstance();
        const storage = container.getStorage();
        const savedLanguage = await storage.get<Language>(StorageKeys.LANGUAGE);
        
        if (savedLanguage === 'en' || savedLanguage === 'ja') {
          setLanguageState(savedLanguage);
        } else {
          setLanguageState('en');
        }
      } catch (error) {
        console.error('Failed to load language:', error);
        setLanguageState('en');
      }
    };

    loadLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    try {
      const container = Container.getInstance();
      const storage = container.getStorage();
      await storage.set(StorageKeys.LANGUAGE, lang);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  // Always provide the context, even during loading, to prevent errors
  // Use current language state (defaults to 'en') and translations
  return (
    <LanguageContext.Provider value={{ language, t: translations[language], setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}


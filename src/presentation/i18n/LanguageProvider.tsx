import React, { useState, useEffect, ReactNode } from 'react';
import { Language, translations } from './translations';
import { LanguageContext } from './useLanguage';
import { useServices } from '../context/ServiceContext';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const services = useServices();
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const settingsService = services.getSettingsService();
        const savedLanguage = await settingsService.getLanguage();
        setLanguageState(savedLanguage);
      } catch (error) {
        console.error('Failed to load language:', error);
        setLanguageState('en');
      }
    };

    loadLanguage();
  }, [services]);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    try {
      const settingsService = services.getSettingsService();
      await settingsService.setLanguage(lang);
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


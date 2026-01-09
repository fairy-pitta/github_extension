import { useState, useEffect } from 'react';
import { useServices } from '../../context/ServiceContext';
import type { Theme as SettingsTheme } from '@/application/services/SettingsService';

export type Theme = 'light' | 'dark' | 'light-blue' | 'light-purple' | 'light-green' | 'light-pink' | 'light-white';

export function useTheme() {
  const services = useServices();
  const [theme, setTheme] = useState<Theme>('light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const settingsService = services.getSettingsService();
        const savedTheme = await settingsService.getTheme();
        setTheme(savedTheme);
        applyTheme(savedTheme);
      } catch (error) {
        console.error('Failed to load theme:', error);
        applyTheme('light');
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, [services]);

  const applyTheme = (newTheme: Theme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const setThemeValue = async (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);

    try {
      const settingsService = services.getSettingsService();
      await settingsService.setTheme(newTheme as SettingsTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    await setThemeValue(newTheme);
  };

  return { theme, toggleTheme, setThemeValue, loading };
}


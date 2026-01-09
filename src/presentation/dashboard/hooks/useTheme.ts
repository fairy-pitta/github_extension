import { useState, useEffect } from 'react';
import { Container } from '@/application/di/Container';
import { StorageKeys } from '@/application/config/StorageKeys';

export type Theme = 'light' | 'dark' | 'light-blue' | 'light-purple' | 'light-green' | 'light-pink' | 'light-white';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const container = Container.getInstance();
        const storage = container.getStorage();
        const savedTheme = await storage.get<Theme>(StorageKeys.THEME);
        
        const validThemes: Theme[] = ['light', 'dark', 'light-blue', 'light-purple', 'light-green', 'light-pink', 'light-white'];
        if (savedTheme && validThemes.includes(savedTheme as Theme)) {
          setTheme(savedTheme as Theme);
          applyTheme(savedTheme as Theme);
        } else {
          // Default to light theme
          applyTheme('light');
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
        applyTheme('light');
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  const applyTheme = (newTheme: Theme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const setThemeValue = async (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);

    try {
      const container = Container.getInstance();
      const storage = container.getStorage();
      await storage.set(StorageKeys.THEME, newTheme);
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


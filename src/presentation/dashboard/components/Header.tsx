import React, { useState, useEffect } from 'react';
import { RefreshButton } from '../../components/RefreshButton';
import { FilterToggle } from '../../components/FilterToggle';
import { StatsButton } from '../../components/StatsButton';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../../i18n/useLanguage';
import { SettingsMenu } from './SettingsMenu';
import { Container } from '@/infrastructure/di/Container';
import { StorageKeys } from '@/application/config/StorageKeys';
import { User } from '@/domain/entities/User';
import './header.css';

interface HeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
  filter: 'all' | 'open';
  onFilterChange: (filter: 'all' | 'open') => void;
  user: User | null;
  onStatsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRefresh,
  refreshing,
  filter,
  onFilterChange,
  user,
  onStatsClick,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const isInIframe = window.self !== window.top;
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showOnGitHub, setShowOnGitHub] = useState(false);

  useEffect(() => {
    const checkShowOnGitHub = async () => {
      try {
        const container = Container.getInstance();
        const storage = container.getStorage();
        const value = await storage.get<boolean>(StorageKeys.SHOW_ON_GITHUB);
        setShowOnGitHub(value !== false); // Default to true
      } catch {
        // If container is not initialized, assume showOnGitHub is enabled
        setShowOnGitHub(true);
      }
    };
    checkShowOnGitHub();

    // Listen for storage changes
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes[StorageKeys.SHOW_ON_GITHUB]) {
        setShowOnGitHub(changes[StorageKeys.SHOW_ON_GITHUB].newValue !== false);
      }
    };
    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ja' : 'en');
  };

  const revertToGitHub = async () => {
    try {
      const container = Container.getInstance();
      const storage = container.getStorage();
      // Disable dashboard on GitHub pages
      await storage.set(StorageKeys.SHOW_ON_GITHUB, false);
      
      // If in iframe, reload the parent page to restore original GitHub content
      if (isInIframe && window.top) {
        window.top.location.reload();
      } else {
        // If not in iframe, navigate to GitHub
        window.location.href = 'https://github.com';
      }
    } catch (error) {
      console.error('Failed to revert to GitHub:', error);
      // Fallback: just reload
      if (isInIframe && window.top) {
        window.top.location.reload();
      } else {
        window.location.href = 'https://github.com';
      }
    }
  };

  const getDashboardTitle = () => {
    if (!user) {
      return t.dashboardTitle;
    }
    const displayName = user.name || user.login;
    return t.dashboardTitleTemplate.replace('{name}', displayName);
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1 className="dashboard-title">{getDashboardTitle()}</h1>
      </div>
      <div className="header-right">
        <StatsButton onClick={onStatsClick} />
        <FilterToggle value={filter} onChange={onFilterChange} disabled={refreshing} />
        <RefreshButton onClick={onRefresh} loading={refreshing} />
        {showOnGitHub && (
          <button
            onClick={revertToGitHub}
            className="revert-button"
            aria-label={t.revertToGitHub}
            title={t.revertToGitHub}
          >
            <i className="fas fa-arrow-left"></i>
            <span>{t.revertToGitHub}</span>
          </button>
        )}
        <button
          onClick={toggleLanguage}
          className="language-toggle-button"
          aria-label={language === 'en' ? 'Switch to Japanese' : 'Switch to English'}
          title={language === 'en' ? '日本語に切り替え' : 'Switch to English'}
        >
          <i className="fas fa-globe"></i>
        </button>
        <button
          onClick={toggleTheme}
          className="theme-toggle-button"
          aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
        >
          <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
        </button>
        <button 
          onClick={() => setIsSettingsOpen(true)} 
          className="settings-button" 
          aria-label={t.settings}
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>
      <SettingsMenu 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </header>
  );
};


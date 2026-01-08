import React from 'react';
import { RefreshButton } from '../../components/RefreshButton';
import { FilterToggle } from '../../components/FilterToggle';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../../i18n/useLanguage';
import './header.css';

interface HeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
  filter: 'all' | 'open';
  onFilterChange: (filter: 'all' | 'open') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRefresh,
  refreshing,
  filter,
  onFilterChange,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ja' : 'en');
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1 className="dashboard-title">{t.dashboardTitle}</h1>
      </div>
      <div className="header-right">
        <FilterToggle value={filter} onChange={onFilterChange} disabled={refreshing} />
        <RefreshButton onClick={onRefresh} loading={refreshing} />
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
        <button onClick={openOptions} className="settings-button" aria-label={t.settings}>
          <i className="fas fa-cog"></i>
        </button>
      </div>
    </header>
  );
};



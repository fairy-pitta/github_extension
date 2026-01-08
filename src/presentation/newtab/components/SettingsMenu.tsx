import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { TokenInput } from '../../options/components/TokenInput';
import { SaveButton } from '../../options/components/SaveButton';
import { StatusMessage } from '../../options/components/StatusMessage';
import { Container } from '@/application/di/Container';
import { StorageKeys } from '@/infrastructure/storage/StorageKeys';
import { useLanguage } from '../../i18n/useLanguage';
import { useTheme } from '../hooks/useTheme';
import './settings-menu.css';

type Theme = 'light' | 'dark';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ isOpen, onClose }) => {
  const { t, language, setLanguage } = useLanguage();
  const { theme: currentTheme, toggleTheme } = useTheme();
  const [token, setToken] = useState('');
  const [showOnGitHub, setShowOnGitHub] = useState(true);
  const [theme, setTheme] = useState<Theme>(currentTheme);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);


  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme]);

  const loadSettings = useCallback(async () => {
    try {
      const container = Container.getInstance();
      const storage = container.getStorage();
      const savedToken = await storage.get<string>(StorageKeys.PAT_TOKEN);
      const savedShowOnGitHub = await storage.get<boolean>(StorageKeys.SHOW_ON_GITHUB);
      
      if (savedToken) {
        setToken(savedToken);
      }
      
      if (savedShowOnGitHub !== undefined) {
        setShowOnGitHub(savedShowOnGitHub);
      }
    } catch {
      // Ignore errors
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen, loadSettings]);

  const handleSave = async () => {
    if (!token.trim()) {
      setStatus({
        type: 'error',
        message: t.tokenEmpty,
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const container = Container.getInstance();
      const storage = container.getStorage();

      await container.initialize(token.trim());
      await storage.set(StorageKeys.PAT_TOKEN, token.trim());

      setStatus({
        type: 'success',
        message: t.tokenSaved,
      });
    } catch (error) {
      console.error('Token save error:', error);
      setStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : t.tokenSaveFailed,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDismissStatus = () => {
    setStatus(null);
  };

  const handleToggleShowOnGitHub = async () => {
    const newValue = !showOnGitHub;
    setShowOnGitHub(newValue);
    try {
      const container = Container.getInstance();
      const storage = container.getStorage();
      await storage.set(StorageKeys.SHOW_ON_GITHUB, newValue);
      setStatus({
        type: 'success',
        message: newValue
          ? t.dashboardEnabled
          : t.dashboardDisabled,
      });
    } catch (error) {
      console.error('Failed to save setting:', error);
      setShowOnGitHub(!newValue);
    }
  };

  const handleThemeChange = async (newTheme: Theme) => {
    if (newTheme === currentTheme) return;
    
    setTheme(newTheme);
    try {
      const container = Container.getInstance();
      const storage = container.getStorage();
      await storage.set(StorageKeys.THEME, newTheme);
      toggleTheme();
      setStatus({
        type: 'success',
        message: t.themeChanged.replace('{theme}', newTheme === 'light' ? t.light : t.dark),
      });
    } catch (error) {
      console.error('Failed to save theme:', error);
      setTheme(currentTheme);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ja' : 'en');
  };

  if (!isOpen) return null;

  const menuContent = (
    <>
      <div className="settings-overlay" onClick={onClose} />
      <div className="settings-menu">
        <div className="settings-menu-header">
          <h2>{t.settingsTitle}</h2>
          <button onClick={onClose} className="settings-close-button" aria-label="Close">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="settings-menu-content">
          <div className="settings-section">
            <h3>{t.tokenLabel}</h3>
            <div className="settings-help-text">
              <p>{t.createPATInstructions}</p>
              <ol className="settings-steps">
                <li>
                  <a
                    href="https://github.com/settings/tokens/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="settings-link"
                  >
                    {t.createPATLink}
                  </a>
                </li>
                <li>{t.requiredPermissions}</li>
                <li>{t.copyTokenInstruction}</li>
              </ol>
            </div>
            <div style={{ marginTop: '20px' }}>
              <TokenInput
                value={token}
                onChange={setToken}
                error={status?.type === 'error' ? status.message : undefined}
                disabled={loading}
              />
            </div>
            <SaveButton
              onClick={handleSave}
              loading={loading}
              disabled={!token.trim()}
            />
          </div>

          <div className="settings-section">
            <label className="settings-checkbox-label">
              <input
                type="checkbox"
                checked={showOnGitHub}
                onChange={handleToggleShowOnGitHub}
                className="settings-checkbox"
              />
              <span>{t.showOnGitHub}</span>
            </label>
            <p className="settings-description">
              {t.showOnGitHubDescription}
            </p>
          </div>

          <div className="settings-section">
            <label className="settings-label">{t.theme}</label>
            <div className="settings-theme-selector">
              <button
                type="button"
                className={`settings-theme-option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                <i className="fas fa-sun"></i>
                <span>{t.light}</span>
              </button>
              <button
                type="button"
                className={`settings-theme-option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                <i className="fas fa-moon"></i>
                <span>{t.dark}</span>
              </button>
            </div>
            <p className="settings-description">
              {t.themeDescription}
            </p>
          </div>

          <div className="settings-section">
            <label className="settings-label">{t.languageLabel}</label>
            <div className="settings-theme-selector">
              <button
                type="button"
                className={`settings-theme-option ${language === 'en' ? 'active' : ''}`}
                onClick={toggleLanguage}
              >
                <i className="fas fa-globe"></i>
                <span>{t.english}</span>
              </button>
              <button
                type="button"
                className={`settings-theme-option ${language === 'ja' ? 'active' : ''}`}
                onClick={toggleLanguage}
              >
                <i className="fas fa-globe"></i>
                <span>{t.japanese}</span>
              </button>
            </div>
          </div>

          {status && (
            <StatusMessage
              type={status.type}
              message={status.message}
              onDismiss={handleDismissStatus}
            />
          )}
        </div>
      </div>
    </>
  );

  return createPortal(menuContent, document.body);
};


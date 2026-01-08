import React, { useState, useEffect } from 'react';
import { TokenInput } from './components/TokenInput';
import { SaveButton } from './components/SaveButton';
import { StatusMessage } from './components/StatusMessage';
import { Container } from '@/application/di/Container';
import { StorageKeys } from '@/infrastructure/storage/StorageKeys';
import { useLanguage } from '../i18n/useLanguage';
import './styles/options.css';

type Theme = 'light' | 'dark';

export const OptionsApp: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [token, setToken] = useState('');
  const [showOnGitHub, setShowOnGitHub] = useState(true);
  const [theme, setTheme] = useState<Theme>('light');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  useEffect(() => {
    // Load saved token and settings
    const loadSettings = async () => {
      try {
        const container = Container.getInstance();
        const storage = container.getStorage();
        const savedToken = await storage.get<string>(StorageKeys.PAT_TOKEN);
        const savedShowOnGitHub = await storage.get<boolean>(StorageKeys.SHOW_ON_GITHUB);
        const savedTheme = await storage.get<Theme>(StorageKeys.THEME);
        
        if (savedToken) {
          setToken(savedToken);
          // Initialize container if token exists
          try {
            await container.initialize(savedToken);
          } catch {
            // Ignore initialization errors
          }
        }
        
        if (savedShowOnGitHub !== undefined) {
          setShowOnGitHub(savedShowOnGitHub);
        }
        
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
        }
      } catch {
        // Ignore errors
      }
    };
    loadSettings();
  }, []);

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

      // First, validate the token by initializing container with it
      await container.initialize(token.trim());

      // If initialization succeeds, save token to storage
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
      setShowOnGitHub(!newValue); // Revert on error
    }
  };

  const handleThemeChange = async (newTheme: Theme) => {
    setTheme(newTheme);
    try {
      const container = Container.getInstance();
      const storage = container.getStorage();
      await storage.set(StorageKeys.THEME, newTheme);
      setStatus({
        type: 'success',
        message: t.themeChanged.replace('{theme}', newTheme === 'light' ? t.light : t.dark),
      });
    } catch (error) {
      console.error('Failed to save theme:', error);
      setTheme(theme); // Revert on error
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ja' : 'en');
  };

  return (
    <div className="options-container">
      <div className="options-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>{t.settingsTitle}</h1>
          <button
            onClick={toggleLanguage}
            className="language-toggle-button"
            aria-label={language === 'en' ? 'Switch to Japanese' : 'Switch to English'}
            title={language === 'en' ? '日本語に切り替え' : 'Switch to English'}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              background: 'var(--bg-button, #fff)',
              border: '1px solid var(--border-button, #d1d5db)',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <i className="fas fa-globe"></i>
            <span style={{ marginLeft: '8px' }}>{language === 'en' ? '日本語' : 'English'}</span>
          </button>
        </div>
        <p className="options-description">
          {t.settingsDescription}
        </p>

        <div className="options-form">
          <TokenInput
            value={token}
            onChange={setToken}
            error={status?.type === 'error' ? status.message : undefined}
            disabled={loading}
          />

          <SaveButton
            onClick={handleSave}
            loading={loading}
            disabled={!token.trim()}
          />

          <div className="options-setting">
            <label className="options-setting-label">
              <input
                type="checkbox"
                checked={showOnGitHub}
                onChange={handleToggleShowOnGitHub}
                className="options-checkbox"
              />
              <span>{t.showOnGitHub}</span>
            </label>
            <p className="options-setting-description">
              {t.showOnGitHubDescription}
            </p>
          </div>

          <div className="options-setting">
            <label className="options-setting-label">{t.theme}</label>
            <div className="options-theme-selector">
              <button
                type="button"
                className={`options-theme-option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                <i className="fas fa-sun"></i>
                <span>{t.light}</span>
              </button>
              <button
                type="button"
                className={`options-theme-option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                <i className="fas fa-moon"></i>
                <span>{t.dark}</span>
              </button>
            </div>
            <p className="options-setting-description">
              {t.themeDescription}
            </p>
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
    </div>
  );
};


import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { TokenInput } from '../../options/components/TokenInput';
import { SaveButton } from '../../options/components/SaveButton';
import { StatusMessage } from '../../options/components/StatusMessage';
import { Container } from '@/application/di/Container';
import { StorageKeys } from '@/infrastructure/storage/StorageKeys';
import { GitHubOAuthService, type DeviceCodeInfo } from '@/infrastructure/auth/GitHubOAuthService';
import { useLanguage } from '../../i18n/useLanguage';
import { useTheme, Theme } from '../hooks/useTheme';
import './settings-menu.css';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ isOpen, onClose }) => {
  const { t, language, setLanguage } = useLanguage();
  const { theme: currentTheme, setThemeValue } = useTheme();
  const [token, setToken] = useState('');
  const [showOnGitHub, setShowOnGitHub] = useState(true);
  const [showMotivationMessage, setShowMotivationMessage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [showManualTokenInput, setShowManualTokenInput] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [deviceCodeInfo, setDeviceCodeInfo] = useState<DeviceCodeInfo | null>(null);
  const [patError, setPatError] = useState<string | null>(null);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  const [showAuthInfo, setShowAuthInfo] = useState(false);



  const loadSettings = useCallback(async () => {
    try {
      const container = Container.getInstance();
      const storage = container.getStorage();
      const savedToken = await storage.get<string>(StorageKeys.PAT_TOKEN);
      const savedShowOnGitHub = await storage.get<boolean>(StorageKeys.SHOW_ON_GITHUB);
      const savedShowMotivationMessage = await storage.get<boolean>(StorageKeys.SHOW_MOTIVATION_MESSAGE);
      
      if (savedToken) {
        setToken(savedToken);
      }
      
      if (savedShowOnGitHub !== undefined) {
        setShowOnGitHub(savedShowOnGitHub);
      }
      
      if (savedShowMotivationMessage !== undefined) {
        setShowMotivationMessage(savedShowMotivationMessage);
      } else {
        // Default to true if not set
        setShowMotivationMessage(true);
      }

      // Check if OAuth is configured (but don't show error if not)
      try {
        const { AppConfig } = await import('@/application/config/AppConfig');
        if (!AppConfig.oauth.clientId) {
          // OAuth is not configured, but this is OK - user can use PAT
          // Don't show error, just silently allow PAT usage
        }
      } catch {
        // Ignore OAuth config check errors
      }
    } catch {
      // Ignore errors
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
      // Reset errors when settings menu is opened
      setOauthError(null);
      setDeviceCodeInfo(null);
      setPatError(null);
      setStatus(null);
    }
  }, [isOpen, loadSettings]);

  const handleOAuthAuthenticate = async () => {
    setOauthLoading(true);
    setOauthError(null);
    setStatus(null);
    setDeviceCodeInfo(null);

    try {
      // Check if OAuth is configured before attempting authentication
      const { AppConfig } = await import('@/application/config/AppConfig');
      if (!AppConfig.oauth.clientId || AppConfig.oauth.clientId.trim() === '') {
        setOauthError(
          'OAuth client ID is not configured. Please set VITE_GITHUB_OAUTH_CLIENT_ID environment variable or configure it in AppConfig.ts. For now, please use the manual token input option below.'
        );
        setOauthLoading(false);
        return;
      }

      // Use OAuthService directly since Container needs to be initialized with a token
      const oauthService = new GitHubOAuthService({
        onDeviceCode: (info) => {
          setDeviceCodeInfo(info);
        },
      });
      const accessToken = await oauthService.authenticate();

      const container = Container.getInstance();
      const storage = container.getStorage();

      // Save OAuth token BEFORE validation (validateCurrentToken() reads from storage)
      await storage.set(StorageKeys.GITHUB_TOKEN, accessToken);

      // Initialize container with the OAuth token
      await container.initialize(accessToken);

      // Validate the token
      const authService = container.getAuthService();
      const user = await authService.validateCurrentToken();

      if (!user) {
        throw new Error('Failed to validate OAuth token');
      }

      setOauthError(null);
      setStatus({
        type: 'success',
        message: t.oauthSuccess,
      });

      // Close settings after successful authentication
      setTimeout(() => {
        onClose();
        // Reload the page to reflect the authentication
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('OAuth authentication error:', error);
      let errorMessage = t.oauthError;
      if (error instanceof Error) {
        if (error.message.includes('canceled') || error.message.includes('cancel')) {
          errorMessage = t.oauthCanceled;
        } else if (error.message.includes('client ID is not configured')) {
          errorMessage = error.message;
        } else {
          errorMessage = `${t.oauthError}: ${error.message}`;
        }
      }
      setOauthError(errorMessage);
    } finally {
      setOauthLoading(false);
    }
  };

  const handleSave = async () => {
    if (!token.trim()) {
      setPatError(t.tokenEmpty);
      return;
    }

    setLoading(true);
    setPatError(null);
    setStatus(null);

    try {
      const container = Container.getInstance();
      const storage = container.getStorage();

      await container.initialize(token.trim());
      await storage.set(StorageKeys.PAT_TOKEN, token.trim());

      setPatError(null);
      setStatus({
        type: 'success',
        message: t.tokenSaved,
      });
    } catch (error) {
      console.error('Token save error:', error);
      setPatError(
        error instanceof Error
          ? error.message
          : t.tokenSaveFailed
      );
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

  const handleToggleShowMotivationMessage = async () => {
    const newValue = !showMotivationMessage;
    setShowMotivationMessage(newValue);
    try {
      const container = Container.getInstance();
      const storage = container.getStorage();
      await storage.set(StorageKeys.SHOW_MOTIVATION_MESSAGE, newValue);
    } catch (error) {
      console.error('Failed to save setting:', error);
      setShowMotivationMessage(!newValue);
    }
  };

  const handleThemeChange = async (newTheme: Theme) => {
    if (newTheme === currentTheme) return;
    
    try {
      await setThemeValue(newTheme);
      const themeName = getThemeDisplayName(newTheme, t);
      setStatus({
        type: 'success',
        message: t.themeChanged.replace('{theme}', themeName),
      });
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const getThemeDisplayName = (theme: Theme, translations: typeof t): string => {
    const themeNames: Record<Theme, string> = {
      'light': translations.light,
      'dark': translations.dark,
      'light-blue': translations.lightBlue,
      'light-purple': translations.lightPurple,
      'light-green': translations.lightGreen,
      'light-pink': translations.lightPink,
      'light-white': translations.lightWhite,
    };
    return themeNames[theme] || theme;
  };

  const themes: Array<{ value: Theme; icon: string; color: string }> = [
    { value: 'light', icon: 'fas fa-sun', color: '#FFF4E6' },
    { value: 'dark', icon: 'fas fa-moon', color: '#1a1a2e' },
    { value: 'light-blue', icon: 'fas fa-cloud', color: '#E6F3FF' },
    { value: 'light-purple', icon: 'fas fa-gem', color: '#F0E6FF' },
    { value: 'light-green', icon: 'fas fa-leaf', color: '#E6FFE6' },
    { value: 'light-pink', icon: 'fas fa-heart', color: '#FFE6F0' },
    { value: 'light-white', icon: 'fas fa-snowflake', color: '#FFFFFF' },
  ];

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>{t.tokenLabel}</h3>
              <button
                onClick={() => setShowAuthInfo(!showAuthInfo)}
                className="auth-info-button"
                aria-label={t.authInfoTitle}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#666',
                  fontSize: '16px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#0366d6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#666';
                }}
              >
                <i className="fas fa-info-circle"></i>
              </button>
            </div>
            
            {/* Auth Info Popup */}
            {showAuthInfo && (
              <div
                className="auth-info-popup"
                style={{
                  marginBottom: '16px',
                  padding: '16px',
                  backgroundColor: '#f6f8fa',
                  border: '1px solid #d1d9e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: '#24292f',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#24292f' }}>
                    {t.authInfoTitle}
                  </h4>
                  <button
                    onClick={() => setShowAuthInfo(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0',
                      color: '#666',
                      fontSize: '18px',
                      lineHeight: 1,
                    }}
                    aria-label={t.close}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <strong style={{ display: 'block', marginBottom: '8px', color: '#24292f' }}>
                    About Write Permissions:
                  </strong>
                  <p style={{ margin: 0, color: '#57606a' }}>
                    {t.authInfoWritePermissions}
                  </p>
                </div>
                <div>
                  <strong style={{ display: 'block', marginBottom: '8px', color: '#24292f' }}>
                    OAuth vs Personal Access Token:
                  </strong>
                  <p style={{ margin: 0, color: '#57606a' }}>
                    {t.authInfoOAuthVsPAT}
                  </p>
                </div>
              </div>
            )}
            
            {/* OAuth Authentication Section */}
            <div className="oauth-section">
              <p className="oauth-instructions">{t.oauthInstructions}</p>
              {deviceCodeInfo && (
                <div
                  style={{
                    padding: '12px',
                    marginBottom: '16px',
                    backgroundColor: '#eef6ff',
                    border: '1px solid #cfe8ff',
                    borderRadius: '6px',
                    color: '#084298',
                    fontSize: '14px',
                    lineHeight: 1.5,
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>
                    {t.oauthDeviceFlowTitle}
                  </div>
                  <div style={{ marginBottom: '6px' }}>
                    {t.oauthDeviceFlowCodeLabel}{' '}
                    <code style={{ fontWeight: 700 }}>{deviceCodeInfo.userCode}</code>
                  </div>
                  <div>
                    {t.oauthDeviceFlowOpenLabel}{' '}
                    <a
                      href={deviceCodeInfo.verificationUriComplete || deviceCodeInfo.verificationUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="settings-link"
                    >
                      {deviceCodeInfo.verificationUri}
                    </a>
                  </div>
                  <div style={{ marginTop: '8px', opacity: 0.9 }}>
                    {t.oauthDeviceFlowWaiting}
                  </div>
                </div>
              )}
              {oauthError && (
                <div
                  style={{
                    padding: '12px',
                    marginBottom: '16px',
                    backgroundColor: '#fee',
                    border: '1px solid #fcc',
                    borderRadius: '6px',
                    color: '#c33',
                    fontSize: '14px',
                  }}
                >
                  <strong>Error:</strong> {oauthError}
                </div>
              )}
              <button
                onClick={handleOAuthAuthenticate}
                disabled={oauthLoading || loading}
                className="oauth-button"
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#fff',
                  backgroundColor: oauthLoading ? '#ccc' : '#24292e',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: oauthLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                }}
              >
                {oauthLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>{t.oauthAuthenticating}</span>
                  </>
                ) : (
                  <>
                    <i className="fab fa-github"></i>
                    <span>{t.signInWithGitHub}</span>
                  </>
                )}
              </button>
            </div>

            {/* Manual Token Input Section (Collapsible) */}
            <div className="manual-token-section">
              <button
                onClick={() => setShowManualTokenInput(!showManualTokenInput)}
                className="manual-token-toggle"
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  fontSize: '14px',
                  color: '#586069',
                  backgroundColor: 'transparent',
                  border: '1px solid #e1e4e8',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginBottom: showManualTokenInput ? '16px' : '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{t.manualTokenInput}</span>
                <i className={`fas fa-chevron-${showManualTokenInput ? 'up' : 'down'}`}></i>
              </button>

              {showManualTokenInput && (
                <div>
                  <div className="settings-help-text" style={{ marginTop: '16px' }}>
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
                      error={patError || undefined}
                      disabled={loading || oauthLoading}
                    />
                  </div>
                  <SaveButton
                    onClick={handleSave}
                    loading={loading}
                    disabled={!token.trim() || oauthLoading}
                  />
                </div>
              )}
            </div>
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
            <label className="settings-checkbox-label">
              <input
                type="checkbox"
                checked={showMotivationMessage}
                onChange={handleToggleShowMotivationMessage}
                className="settings-checkbox"
              />
              <span>{t.showMotivationMessage}</span>
            </label>
            <p className="settings-description">
              {t.showMotivationMessageDescription}
            </p>
          </div>

          <div className="settings-section">
            <label className="settings-label">{t.theme}</label>
            <div className="settings-theme-selector">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.value}
                  type="button"
                  className={`settings-theme-option ${currentTheme === themeOption.value ? 'active' : ''}`}
                  onClick={() => handleThemeChange(themeOption.value)}
                  title={getThemeDisplayName(themeOption.value, t)}
                >
                  <span 
                    className="theme-color-preview" 
                    style={{ backgroundColor: themeOption.color }}
                  ></span>
                  <i className={themeOption.icon}></i>
                  <span>{getThemeDisplayName(themeOption.value, t)}</span>
                </button>
              ))}
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


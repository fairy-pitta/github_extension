import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/useLanguage';
import { SettingsMenu } from './SettingsMenu';
import './authguard.css';

export const AuthGuard: React.FC = () => {
  const { t } = useLanguage();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Auto-open settings menu on first load (onboarding)
  useEffect(() => {
    // Small delay to ensure smooth animation
    const timer = setTimeout(() => {
      setIsSettingsOpen(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="auth-guard">
      <div className="auth-guard-content">
        <h1>{t.githubExtension}</h1>
        <p>{t.configureToken}</p>
        <div className="auth-guard-instructions">
          <p className="auth-guard-step">
            <strong>{t.createPATInstructions}</strong>
          </p>
          <ol className="auth-guard-steps">
            <li>
              <a
                href="https://github.com/settings/tokens/new"
                target="_blank"
                rel="noopener noreferrer"
                className="auth-guard-link"
              >
                {t.createPATLink}
              </a>
            </li>
            <li>{t.requiredPermissions}</li>
            <li>{t.language === 'en' ? 'Copy the token and paste it below' : 'トークンをコピーして、下に入力してください'}</li>
          </ol>
        </div>
        <button onClick={() => setIsSettingsOpen(true)} className="configure-button">
          <i className="fas fa-cog"></i>
          <span>{t.openSettings}</span>
        </button>
      </div>
      <SettingsMenu isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};


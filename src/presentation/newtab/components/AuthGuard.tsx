import React from 'react';
import { useLanguage } from '../../i18n/useLanguage';
import './authguard.css';

export const AuthGuard: React.FC = () => {
  const { t } = useLanguage();
  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="auth-guard">
      <div className="auth-guard-content">
        <h1>{t.githubExtension}</h1>
        <p>{t.configureToken}</p>
        <button onClick={openOptions} className="configure-button">
          <i className="fas fa-cog"></i>
          <span>{t.openSettings}</span>
        </button>
      </div>
    </div>
  );
};



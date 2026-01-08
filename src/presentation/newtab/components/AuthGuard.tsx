import React from 'react';
import './authguard.css';

export const AuthGuard: React.FC = () => {
  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="auth-guard">
      <div className="auth-guard-content">
        <h1>GitHub Extension</h1>
        <p>Please configure your GitHub Personal Access Token to use this extension.</p>
        <button onClick={openOptions} className="configure-button">
          Open Settings
        </button>
      </div>
    </div>
  );
};



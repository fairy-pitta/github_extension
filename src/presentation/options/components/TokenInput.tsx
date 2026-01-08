import React, { useState } from 'react';
import { useLanguage } from '../../i18n/useLanguage';

interface TokenInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const TokenInput: React.FC<TokenInputProps> = ({
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const { t, language } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="token-input-container">
      <label htmlFor="token-input" className="token-label">
        {t.tokenLabel}
      </label>
      <div className="token-input-wrapper">
        <input
          id="token-input"
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={t.tokenPlaceholder}
          className={`token-input ${error ? 'error' : ''}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="toggle-password"
          disabled={disabled}
          aria-label={showPassword ? (language === 'ja' ? 'トークンを非表示' : 'Hide token') : (language === 'ja' ? 'トークンを表示' : 'Show token')}
        >
          <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="token-help">
        <a
          href="https://github.com/settings/tokens"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.createToken}
        </a>
        <span className="help-text">
          {t.tokenPermissions}
        </span>
      </div>
    </div>
  );
};



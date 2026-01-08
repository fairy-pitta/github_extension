import React, { useState } from 'react';

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
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="token-input-container">
      <label htmlFor="token-input" className="token-label">
        GitHub Personal Access Token
      </label>
      <div className="token-input-wrapper">
        <input
          id="token-input"
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          className={`token-input ${error ? 'error' : ''}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="toggle-password"
          disabled={disabled}
          aria-label={showPassword ? 'Hide token' : 'Show token'}
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="token-help">
        <a
          href="https://github.com/settings/tokens"
          target="_blank"
          rel="noopener noreferrer"
        >
          Create a Personal Access Token
        </a>
        <span className="help-text">
          Required permissions: repo, read:org, read:user
        </span>
      </div>
    </div>
  );
};



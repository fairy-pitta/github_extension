import React, { useState, useEffect } from 'react';
import { TokenInput } from './components/TokenInput';
import { SaveButton } from './components/SaveButton';
import { StatusMessage } from './components/StatusMessage';
import { Container } from '@/application/di/Container';
import { StorageKeys } from '@/infrastructure/storage/StorageKeys';
import './styles/options.css';

export const OptionsApp: React.FC = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  useEffect(() => {
    // Load saved token
    const loadToken = async () => {
      const storage = Container.getInstance().getStorage();
      const savedToken = await storage.get<string>(StorageKeys.PAT_TOKEN);
      if (savedToken) {
        setToken(savedToken);
      }
    };
    loadToken();
  }, []);

  const handleSave = async () => {
    if (!token.trim()) {
      setStatus({
        type: 'error',
        message: 'Token cannot be empty',
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const container = Container.getInstance();
      const authService = container.getAuthService();

      // Validate and save token
      await authService.saveToken(token.trim());

      // Initialize container with new token
      await container.initialize(token.trim());

      setStatus({
        type: 'success',
        message: 'Token saved successfully!',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to save token. Please check your token and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDismissStatus = () => {
    setStatus(null);
  };

  return (
    <div className="options-container">
      <div className="options-content">
        <h1>GitHub Extension Settings</h1>
        <p className="options-description">
          Enter your GitHub Personal Access Token to enable the extension.
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


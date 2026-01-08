import React from 'react';

interface StatusMessageProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onDismiss?: () => void;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  type,
  message,
  onDismiss,
}) => {
  if (!message) {
    return null;
  }

  return (
    <div className={`status-message ${type}`}>
      <span className="status-icon">
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'info' && 'ℹ'}
      </span>
      <span className="status-text">{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="dismiss-button"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
};


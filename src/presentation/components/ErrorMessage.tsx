import React from 'react';
import { RateLimitError, AuthenticationError, PermissionError, NetworkError } from '@/domain/errors/DomainError';
import './styles/error.css';

interface ErrorMessageProps {
  error: Error | string;
  onRetry?: () => void;
}

const getErrorDetails = (error: Error): { title: string; message: string; suggestion?: string } => {
  if (error instanceof RateLimitError) {
    return {
      title: 'Rate Limit Exceeded',
      message: error.message,
      suggestion: 'Please wait a few minutes before trying again. The rate limit will reset automatically.',
    };
  }
  if (error instanceof AuthenticationError) {
    return {
      title: 'Authentication Error',
      message: error.message,
      suggestion: 'Please check your Personal Access Token in the extension settings.',
    };
  }
  if (error instanceof PermissionError) {
    return {
      title: 'Permission Error',
      message: error.message,
      suggestion: 'Your token may not have the required permissions. Please check your token settings.',
    };
  }
  if (error instanceof NetworkError) {
    return {
      title: 'Network Error',
      message: error.message,
      suggestion: 'Please check your internet connection and try again.',
    };
  }
  return {
    title: 'Error',
    message: error.message || 'An unexpected error occurred',
  };
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
}) => {
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  const { title, message, suggestion } = getErrorDetails(errorObj);

  return (
    <div className="error-message-container">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <h3>{title}</h3>
        <p>{message}</p>
        {suggestion && (
          <p className="error-suggestion">{suggestion}</p>
        )}
        {onRetry && (
          <button onClick={onRetry} className="retry-button">
            Retry
          </button>
        )}
      </div>
    </div>
  );
};


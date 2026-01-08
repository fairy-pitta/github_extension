import React from 'react';
import './styles/refresh.css';

interface RefreshButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  onClick,
  loading = false,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="refresh-button"
      aria-label="Refresh"
    >
      {loading ? (
        <>
          <span className="spinner-small"></span>
          Refreshing...
        </>
      ) : (
        <>
          <span className="refresh-icon">🔄</span>
          Refresh
        </>
      )}
    </button>
  );
};



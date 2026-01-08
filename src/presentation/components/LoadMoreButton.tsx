import React from 'react';
import './styles/loadmore.css';

interface LoadMoreButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  hasMore?: boolean;
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  onClick,
  loading = false,
  disabled = false,
  hasMore = true,
}) => {
  if (!hasMore) {
    return null;
  }

  return (
    <div className="load-more-container">
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className="load-more-button"
      >
        {loading ? (
          <>
            <span className="spinner-small"></span>
            Loading...
          </>
        ) : (
          'Load More'
        )}
      </button>
    </div>
  );
};



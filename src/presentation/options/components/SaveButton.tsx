import React from 'react';

interface SaveButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  onClick,
  loading = false,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="save-button"
    >
      {loading ? (
        <>
          <span className="spinner"></span>
          Saving...
        </>
      ) : (
        'Save Token'
      )}
    </button>
  );
};



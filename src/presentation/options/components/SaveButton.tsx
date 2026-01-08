import React from 'react';
import { useLanguage } from '../../i18n/useLanguage';

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
  const { t, language } = useLanguage();
  
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
          <span>{language === 'ja' ? '保存中...' : 'Saving...'}</span>
        </>
      ) : (
        t.save
      )}
    </button>
  );
};



import React from 'react';
import { useLanguage } from '../i18n/useLanguage';

interface StatsButtonProps {
  onClick: () => void;
}

export const StatsButton: React.FC<StatsButtonProps> = ({ onClick }) => {
  const { t } = useLanguage();

  return (
    <button
      onClick={onClick}
      className="stats-button"
      aria-label={t.statsButton || '統計情報'}
      title={t.statsButton || '統計情報'}
    >
      <i className="fas fa-chart-bar"></i>
      <span className="stats-button-text">{t.statsButton || '統計'}</span>
    </button>
  );
};



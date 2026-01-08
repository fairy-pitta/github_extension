import React from 'react';
import { ContributionStreak } from '@/domain/entities/ContributionStreak';
import { useLanguage } from '../i18n/useLanguage';
import './styles/streak.css';

interface StreakDisplayProps {
  streak: ContributionStreak | null;
  loading?: boolean;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak, loading = false }) => {
  const { t } = useLanguage();

  if (loading || !streak) {
    return (
      <div className="streak-display-compact">
        <div className="streak-skeleton-compact"></div>
      </div>
    );
  }

  const getReminderIcon = () => {
    if (streak.todayContributed) {
      return null;
    }
    return (
      <span className="streak-reminder-icon" title={t.streakReminder || '今日まだコントリビュートしていません！'}>
        <i className="fas fa-bell"></i>
      </span>
    );
  };

  return (
    <div className="streak-display-compact">
      <span className="streak-icon-compact">
        <i className="fas fa-fire"></i>
      </span>
      <span className="streak-current-compact">
        <span className="streak-number-compact">{streak.currentStreak}</span>
        <span className="streak-label-compact">{t.streakDays || '日連続'}</span>
      </span>
      {streak.longestStreak > streak.currentStreak && (
        <>
          <span className="streak-separator">|</span>
          <span className="streak-longest-compact">
            <span className="streak-longest-label-compact">{t.streakLongest || '最長'}: </span>
            <span className="streak-longest-number-compact">{streak.longestStreak}</span>
          </span>
        </>
      )}
      {getReminderIcon()}
    </div>
  );
};


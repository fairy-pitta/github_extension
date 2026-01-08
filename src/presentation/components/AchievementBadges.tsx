import React, { useEffect, useState } from 'react';
import { AchievementBadge } from '@/domain/entities/AchievementBadge';
import { useLanguage } from '../i18n/useLanguage';
import './styles/achievement-badges.css';

interface AchievementBadgesProps {
  badges: AchievementBadge[];
  loading?: boolean;
}

export const AchievementBadges: React.FC<AchievementBadgesProps> = ({ badges, loading = false }) => {
  const { t } = useLanguage();
  const [newlyAchieved, setNewlyAchieved] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Check for newly achieved badges
    const achievedIds = new Set(
      badges.filter((b) => b.achieved).map((b) => b.id)
    );
    setNewlyAchieved(achievedIds);
  }, [badges]);

  if (loading) {
    return (
      <div className="achievement-badges-compact">
        <div className="achievement-badges-skeleton-compact">
          <div className="skeleton-badge-compact"></div>
          <div className="skeleton-badge-compact"></div>
          <div className="skeleton-badge-compact"></div>
        </div>
      </div>
    );
  }

  // Separate badges: achieved and in-progress (not achieved)
  const achievedBadges = badges.filter((b) => b.achieved);
  const inProgressBadges = badges.filter((b) => !b.achieved && b.progress > 0);

  if (achievedBadges.length === 0 && inProgressBadges.length === 0) {
    return null;
  }

  return (
    <div className="achievement-badges-compact">
      <span className="achievement-icon-compact" title={t.achievementsTitle || '実績バッジ'}>
        <i className="fas fa-trophy"></i>
        <span className="achievement-icon-text">{t.achievementsTitle || '実績'}</span>
      </span>
      <div className="achievement-badges-list">
        {achievedBadges.map((badge) => (
          <span
            key={badge.id}
            className={`achievement-badge-compact achievement-badge-achieved ${
              newlyAchieved.has(badge.id) ? 'achievement-badge-new' : ''
            }`}
          >
            <i className={`fas ${badge.icon}`}></i>
            {newlyAchieved.has(badge.id) && (
              <span className="achievement-badge-sparkle-compact">
                <i className="fas fa-sparkles"></i>
              </span>
            )}
            <span className="achievement-badge-tooltip achievement-badge-tooltip-achieved">
              <span className="achievement-badge-tooltip-name">{badge.name}</span>
              <span className="achievement-badge-tooltip-description">{badge.description}</span>
              {badge.nextTarget && badge.nextTarget > badge.progress && (
                <span className="achievement-badge-tooltip-remaining">
                  次の称号（{badge.nextName ?? '次'}）まであと {badge.nextTarget - badge.progress}
                </span>
              )}
            </span>
          </span>
        ))}
        {inProgressBadges.map((badge) => {
          const remaining = Math.max(0, badge.target - badge.progress);
          return (
            <span
              key={badge.id}
              className="achievement-badge-compact achievement-badge-progress"
            >
              <i className={`fas ${badge.icon}`}></i>
              <span className="achievement-badge-progress-indicator">
                {badge.progress}/{badge.target}
              </span>
              <span className="achievement-badge-tooltip achievement-badge-tooltip-progress">
                <span className="achievement-badge-tooltip-name">{badge.name}</span>
                <span className="achievement-badge-tooltip-description">{badge.description}</span>
                <span className="achievement-badge-tooltip-progress">
                  進捗: {badge.progress} / {badge.target}
                </span>
                {remaining > 0 && (
                  <span className="achievement-badge-tooltip-remaining">
                    次の称号まであと {remaining}
                  </span>
                )}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};


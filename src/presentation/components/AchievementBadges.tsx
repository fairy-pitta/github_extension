import React, { useEffect, useState } from 'react';
import { AchievementBadge } from '@/domain/entities/AchievementBadge';
import { useLanguage } from '../i18n/useLanguage';
import { AchievementInfoModal } from './AchievementInfoModal';
import './styles/achievement-badges.css';

interface AchievementBadgesProps {
  badges: AchievementBadge[];
  loading?: boolean;
}

export const AchievementBadges: React.FC<AchievementBadgesProps> = ({ badges, loading = false }) => {
  const { t } = useLanguage();
  const [newlyAchieved, setNewlyAchieved] = useState<Set<string>>(new Set());
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

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

  // Only show badges that have been achieved (at least one level)
  const achievedBadges = badges.filter((b) => b.achieved);

  if (achievedBadges.length === 0) {
    return null;
  }

  return (
    <>
      <div className="achievement-badges-compact">
        <span className="achievement-icon-compact" title={t.achievementsTitle || '実績バッジ'}>
          <i className="fas fa-trophy"></i>
          <span className="achievement-icon-text">{t.achievementsTitle || '実績'}</span>
        </span>
        <button
          className="achievement-info-button"
          onClick={() => setIsInfoModalOpen(true)}
          title={t.achievementInfoTitle}
          aria-label={t.achievementInfoTitle}
        >
          <i className="fas fa-info-circle"></i>
        </button>
        <div className="achievement-badges-list">
        {achievedBadges.map((badge) => {
          const remaining = badge.nextTarget ? Math.max(0, badge.nextTarget - badge.progress) : null;

          return (
            <div
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
              <div className="achievement-badge-tooltip">
                <div className="achievement-badge-tooltip-name">{badge.name}</div>
                <div className="achievement-badge-tooltip-description">{badge.description}</div>
                {badge.nextTarget && remaining !== null && remaining > 0 && (
                  <div className="achievement-badge-tooltip-remaining">
                    {t.achievementNextTitle}（{badge.nextName ?? t.achievementNext}）{t.achievementRemaining} {remaining}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        </div>
      </div>
      <AchievementInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </>
  );
};

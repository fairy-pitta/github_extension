import React, { useEffect, useState, useRef } from 'react';
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
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number; arrowLeft: number } | null>(null);
  const badgeRefs = useRef<Map<string, HTMLSpanElement>>(new Map());

  useEffect(() => {
    // Check for newly achieved badges
    const achievedIds = new Set(
      badges.filter((b) => b.achieved).map((b) => b.id)
    );
    setNewlyAchieved(achievedIds);
  }, [badges]);

  const handleBadgeMouseEnter = (badgeId: string, event: React.MouseEvent<HTMLSpanElement>) => {
    const badgeElement = badgeRefs.current.get(badgeId);
    if (!badgeElement) return;

    const rect = badgeElement.getBoundingClientRect();
    const tooltipWidth = 200; // Approximate tooltip width
    const tooltipHeight = 100; // Approximate tooltip height
    const spacing = 8;

    // Calculate position: above the badge, centered
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    const top = rect.top - tooltipHeight - spacing;
    const badgeCenterX = rect.left + rect.width / 2;

    // Adjust if tooltip would go off screen
    let adjustedLeft = left;
    if (left < 10) {
      adjustedLeft = 10;
    } else if (left + tooltipWidth > window.innerWidth - 10) {
      adjustedLeft = window.innerWidth - tooltipWidth - 10;
    }

    // Calculate arrow position relative to tooltip
    const arrowLeft = badgeCenterX - adjustedLeft;

    setTooltipPosition({ top, left: adjustedLeft, arrowLeft });
    setHoveredBadge(badgeId);
  };

  const handleBadgeMouseLeave = () => {
    setHoveredBadge(null);
    setTooltipPosition(null);
  };

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

  const hoveredBadgeData = achievedBadges.find((b) => b.id === hoveredBadge);
  const remaining = hoveredBadgeData?.nextTarget ? Math.max(0, hoveredBadgeData.nextTarget - hoveredBadgeData.progress) : null;

  return (
    <>
      <div className="achievement-badges-compact">
        <span className="achievement-icon-compact" title={t.achievementsTitle || '実績バッジ'}>
          <i className="fas fa-trophy"></i>
          <span className="achievement-icon-text">{t.achievementsTitle || '実績'}</span>
        </span>
        <div className="achievement-badges-list">
          {achievedBadges.map((badge) => (
            <span
              key={badge.id}
              ref={(el) => {
                if (el) {
                  badgeRefs.current.set(badge.id, el);
                } else {
                  badgeRefs.current.delete(badge.id);
                }
              }}
              className={`achievement-badge-compact achievement-badge-achieved ${
                newlyAchieved.has(badge.id) ? 'achievement-badge-new' : ''
              }`}
              onMouseEnter={(e) => handleBadgeMouseEnter(badge.id, e)}
              onMouseLeave={handleBadgeMouseLeave}
            >
              <i className={`fas ${badge.icon}`}></i>
              {newlyAchieved.has(badge.id) && (
                <span className="achievement-badge-sparkle-compact">
                  <i className="fas fa-sparkles"></i>
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
      {hoveredBadgeData && tooltipPosition && (
        <div
          className="achievement-badge-tooltip achievement-badge-tooltip-fixed"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            '--arrow-left': `${tooltipPosition.arrowLeft}px`,
          } as React.CSSProperties}
        >
          <span className="achievement-badge-tooltip-name">{hoveredBadgeData.name}</span>
          <span className="achievement-badge-tooltip-description">{hoveredBadgeData.description}</span>
          {hoveredBadgeData.nextTarget && remaining !== null && remaining > 0 && (
            <span className="achievement-badge-tooltip-remaining">
              次の称号（{hoveredBadgeData.nextName ?? '次'}）まであと {remaining}
            </span>
          )}
        </div>
      )}
    </>
  );
};


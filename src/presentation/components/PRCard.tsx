import React, { useMemo, useCallback } from 'react';
import { PullRequest } from '@/domain/entities/PullRequest';
import { formatRelativeDate } from '../utils/dateUtils';
import { useLanguage } from '../i18n/useLanguage';
import './styles/cards.css';

interface PRCardProps {
  pr: PullRequest;
  onClick?: () => void;
  isReviewed?: boolean;
}

const getStateBadgeClass = (state: string, reviewDecision: string | null): string => {
  if (state === 'MERGED') return 'badge-merged';
  if (state === 'CLOSED') return 'badge-closed';
  if (reviewDecision === 'APPROVED') return 'badge-approved';
  if (reviewDecision === 'CHANGES_REQUESTED') return 'badge-changes-requested';
  return 'badge-open';
};

const getStateLabel = (
  state: string,
  reviewDecision: string | null,
  t: { reviewApproved: string; reviewChangesRequested: string; prMerged: string; prClosed: string; prOpen: string }
): string => {
  if (state === 'MERGED') return t.prMerged;
  if (state === 'CLOSED') return t.prClosed;
  if (reviewDecision === 'APPROVED') return t.reviewApproved;
  if (reviewDecision === 'CHANGES_REQUESTED') return t.reviewChangesRequested;
  return t.prOpen;
};

export const PRCard: React.FC<PRCardProps> = React.memo(({ pr, onClick, isReviewed = false }) => {
  const { t } = useLanguage();
  const badgeClass = useMemo(
    () => getStateBadgeClass(pr.state, pr.reviewDecision),
    [pr.state, pr.reviewDecision]
  );

  const stateLabel = useMemo(
    () => getStateLabel(pr.state, pr.reviewDecision, t),
    [pr.state, pr.reviewDecision, t]
  );

  const formattedDate = useMemo(() => formatRelativeDate(pr.updatedAt), [pr.updatedAt]);

  const reviewStats = useMemo(() => {
    const stats = {
      approved: 0,
      commented: 0,
      changesRequested: 0,
      dismissed: 0,
      pending: 0,
    };
    pr.reviews.forEach((review) => {
      switch (review.state) {
        case 'APPROVED':
          stats.approved++;
          break;
        case 'COMMENTED':
          stats.commented++;
          break;
        case 'CHANGES_REQUESTED':
          stats.changesRequested++;
          break;
        case 'DISMISSED':
          stats.dismissed++;
          break;
        case 'PENDING':
          stats.pending++;
          break;
      }
    });
    return stats;
  }, [pr.reviews]);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    } else {
      window.open(pr.url, '_blank');
    }
  }, [onClick, pr.url]);

  const hasConflict = pr.mergeable === 'CONFLICTING';

  return (
    <div className="card pr-card" onClick={handleClick}>
      <div className="card-header">
        <span className={`badge ${badgeClass}`}>
          {stateLabel}
        </span>
        {hasConflict && (
          <span className="badge badge-conflict" title={t.hasMergeConflicts}>
            <i className="fas fa-exclamation-triangle"></i> {t.conflict}
          </span>
        )}
        {isReviewed && (
          <span className="badge badge-reviewed" title={t.reviewedByYou}>
            <i className="fas fa-check-circle"></i> {t.reviewed}
          </span>
        )}
        <span className="card-repo">{pr.repository.nameWithOwner}</span>
      </div>
      <h3 className="card-title">{pr.title}</h3>
      <div className="card-meta">
        <span className="card-number">#{pr.number}</span>
        <span className="card-separator">•</span>
        <span className="card-updated">{t.updated} {formattedDate}</span>
        {pr.commentsCount > 0 && (
          <>
            <span className="card-separator">•</span>
            <span className="card-comments">{pr.commentsCount} {t.comments}</span>
          </>
        )}
        {pr.reviews.length > 0 && (
          <>
            <span className="card-separator">•</span>
            <span className="card-reviews">
              {reviewStats.approved > 0 && (
                <span className="review-stat approved">
                  {reviewStats.approved} {t.reviewApprovedLabel}
                </span>
              )}
              {reviewStats.commented > 0 && (
                <span className="review-stat commented">
                  {reviewStats.commented} {t.reviewCommentedLabel}
                </span>
              )}
              {reviewStats.changesRequested > 0 && (
                <span className="review-stat changes-requested">
                  {reviewStats.changesRequested} {t.reviewChangesRequestedLabel}
                </span>
              )}
            </span>
          </>
        )}
      </div>
    </div>
  );
});


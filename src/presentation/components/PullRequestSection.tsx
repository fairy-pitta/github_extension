import React, { useState, useEffect } from 'react';
import { PullRequest } from '@/domain/entities/PullRequest';
import { PRCard } from './PRCard';
import { LoadMoreButton } from './LoadMoreButton';
import { SkeletonLoader } from './SkeletonLoader';
import { Container } from '@/application/di/Container';
import { useLanguage } from '../i18n/useLanguage';
import './styles/section.css';
import './styles/pr-tabs.css';

interface PullRequestSectionProps {
  createdPRs: PullRequest[];
  reviewRequestedPRs: PullRequest[];
  loading?: boolean;
}

type TabType = 'created' | 'review-requested';

export const PullRequestSection: React.FC<PullRequestSectionProps> = React.memo(({
  createdPRs: initialCreatedPRs,
  reviewRequestedPRs: initialReviewRequestedPRs,
  loading = false,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('created');
  const [createdPRs, setCreatedPRs] = useState<PullRequest[]>(initialCreatedPRs);
  const [reviewRequestedPRs, setReviewRequestedPRs] = useState<PullRequest[]>(initialReviewRequestedPRs);
  const [loadingMore, setLoadingMore] = useState(false);
  const [createdCursor, setCreatedCursor] = useState<string | undefined>();
  const [reviewRequestedCursor, setReviewRequestedCursor] = useState<string | undefined>();
  const [hasMoreCreated, setHasMoreCreated] = useState(true);
  const [hasMoreReviewRequested, setHasMoreReviewRequested] = useState(true);

  // Update PRs when initial PRs change
  useEffect(() => {
    setCreatedPRs(initialCreatedPRs);
    setReviewRequestedPRs(initialReviewRequestedPRs);
    // Reset cursors when initial data changes
    setCreatedCursor(undefined);
    setReviewRequestedCursor(undefined);
    setHasMoreCreated(true);
    setHasMoreReviewRequested(true);
  }, [initialCreatedPRs, initialReviewRequestedPRs]);


  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const container = Container.getInstance();
      const prRepo = container.getPullRequestRepository();
      
      if (activeTab === 'created') {
        const result = await prRepo.getCreatedByMe(10, createdCursor);
        setCreatedPRs((prev) => [...prev, ...result.prs]);
        setCreatedCursor(result.nextCursor);
        setHasMoreCreated(!!result.nextCursor);
      } else {
        const result = await prRepo.getReviewRequested(10, reviewRequestedCursor);
        setReviewRequestedPRs((prev) => [...prev, ...result.prs]);
        setReviewRequestedCursor(result.nextCursor);
        setHasMoreReviewRequested(!!result.nextCursor);
      }
    } catch (error) {
      console.error('Failed to load more PRs:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const currentPRs = activeTab === 'created' ? createdPRs : reviewRequestedPRs;
  const currentTitle = activeTab === 'created' ? t.pullRequestsCreated : t.pullRequestsReviewRequested;
  const currentEmptyMessage = activeTab === 'created' ? t.noPullRequests : t.noPullRequestsReview;
  const currentIcon = activeTab === 'created' ? 'fa-code-pull-request' : 'fa-user-check';
  const currentHasMore = activeTab === 'created' ? hasMoreCreated : hasMoreReviewRequested;

  if (loading) {
    return (
      <section className="dashboard-section">
        <div className="pr-tabs">
          <div className="pr-tab-header">
            <button
              className={`pr-tab ${activeTab === 'created' ? 'active' : ''}`}
              disabled
            >
              <i className="fas fa-code-pull-request"></i>
              {t.pullRequestsCreated}
            </button>
            <button
              className={`pr-tab ${activeTab === 'review-requested' ? 'active' : ''}`}
              disabled
            >
              <i className="fas fa-user-check"></i>
              {t.pullRequestsReviewRequested}
            </button>
          </div>
          <div className="section-content">
            <SkeletonLoader count={3} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <div className="pr-tabs">
        <div className="pr-tab-header">
          <button
            className={`pr-tab ${activeTab === 'created' ? 'active' : ''}`}
            onClick={() => setActiveTab('created')}
          >
            <i className="fas fa-code-pull-request"></i>
            {t.pullRequestsCreated}
            {createdPRs.length > 0 && (
              <span className="pr-tab-count">({createdPRs.length})</span>
            )}
          </button>
          <button
            className={`pr-tab ${activeTab === 'review-requested' ? 'active' : ''}`}
            onClick={() => setActiveTab('review-requested')}
          >
            <i className="fas fa-user-check"></i>
            {t.pullRequestsReviewRequested}
            {reviewRequestedPRs.length > 0 && (
              <span className="pr-tab-count">({reviewRequestedPRs.length})</span>
            )}
          </button>
        </div>
        <div className="section-content">
          {currentPRs.length === 0 ? (
            <p className="empty-message">{currentEmptyMessage}</p>
          ) : (
            <>
              {currentPRs.map((pr) => (
                <PRCard key={`${pr.repository.nameWithOwner}-${pr.number}`} pr={pr} />
              ))}
              <LoadMoreButton
                onClick={handleLoadMore}
                loading={loadingMore}
                hasMore={currentHasMore}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
});


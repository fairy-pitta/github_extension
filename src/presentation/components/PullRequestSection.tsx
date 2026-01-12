import React, { useState, useEffect, useMemo } from 'react';
import { PullRequest } from '@/domain/entities/PullRequest';
import { PRCard } from './PRCard';
import { LoadMoreButton } from './LoadMoreButton';
import { SkeletonLoader } from './SkeletonLoader';
import { ReviewStatusFilter, ReviewStatusFilterOption } from './ReviewStatusFilter';
import { useLanguage } from '../i18n/useLanguage';
import { useServices } from '../context/ServiceContext';
import './styles/section.css';
import './styles/pr-tabs.css';

interface PullRequestSectionProps {
  createdPRs: PullRequest[];
  reviewRequestedPRs: PullRequest[];
  reviewedPRs?: PullRequest[];
  loading?: boolean;
}

type TabType = 'created' | 'review-requested';

export const PullRequestSection: React.FC<PullRequestSectionProps> = React.memo(({
  createdPRs: initialCreatedPRs,
  reviewRequestedPRs: initialReviewRequestedPRs,
  reviewedPRs: initialReviewedPRs = [],
  loading = false,
}) => {
  const services = useServices();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('created');
  const [createdPRs, setCreatedPRs] = useState<PullRequest[]>(initialCreatedPRs);
  const [reviewRequestedPRs, setReviewRequestedPRs] = useState<PullRequest[]>(initialReviewRequestedPRs);
  const [reviewedPRs, setReviewedPRs] = useState<PullRequest[]>(initialReviewedPRs);
  const [loadingMore, setLoadingMore] = useState(false);
  const [createdCursor, setCreatedCursor] = useState<string | undefined>();
  const [reviewRequestedCursor, setReviewRequestedCursor] = useState<string | undefined>();
  const [reviewedCursor, setReviewedCursor] = useState<string | undefined>();
  const [hasMoreCreated, setHasMoreCreated] = useState(true);
  const [hasMoreReviewRequested, setHasMoreReviewRequested] = useState(true);
  const [hasMoreReviewed, setHasMoreReviewed] = useState(true);
  
  // Create a Set of reviewed PR keys for quick lookup
  const reviewedPRKeys = useMemo(() => {
    const getPRKey = (pr: PullRequest) => `${pr.repository.nameWithOwner}-${pr.number}`;
    return new Set(reviewedPRs.map(getPRKey));
  }, [reviewedPRs]);
  const [reviewFilters, setReviewFilters] = useState<ReviewStatusFilterOption[]>(['ALL']);

  // Update PRs when initial PRs change, removing duplicates
  useEffect(() => {
    // Remove duplicates by repository.nameWithOwner and number
    const getPRKey = (pr: PullRequest) => `${pr.repository.nameWithOwner}-${pr.number}`;

    const uniqueCreatedPRs = initialCreatedPRs.filter(
      (pr, index, self) =>
        index === self.findIndex((p) => getPRKey(p) === getPRKey(pr))
    );

    const uniqueReviewRequestedPRs = initialReviewRequestedPRs.filter(
      (pr, index, self) =>
        index === self.findIndex((p) => getPRKey(p) === getPRKey(pr))
    );

    const uniqueReviewedPRs = initialReviewedPRs.filter(
      (pr, index, self) =>
        index === self.findIndex((p) => getPRKey(p) === getPRKey(pr))
    );

    setCreatedPRs(uniqueCreatedPRs);
    setReviewRequestedPRs(uniqueReviewRequestedPRs);
    setReviewedPRs(uniqueReviewedPRs);
    // Reset cursors when initial data changes
    setCreatedCursor(undefined);
    setReviewRequestedCursor(undefined);
    setReviewedCursor(undefined);
    setHasMoreCreated(true);
    setHasMoreReviewRequested(true);
    setHasMoreReviewed(true);
  }, [initialCreatedPRs, initialReviewRequestedPRs, initialReviewedPRs]);

  // Load reviewed PRs when switching to review-requested tab for the first time
  useEffect(() => {
    if (activeTab === 'review-requested' && reviewedPRs.length === 0 && !loading) {
      const loadReviewedPRs = async () => {
        try {
          const prRepo = services.getPullRequestRepository();
          const result = await prRepo.getReviewedByMe(50);
          const getPRKey = (pr: PullRequest) => `${pr.repository.nameWithOwner}-${pr.number}`;
          const uniqueReviewedPRs = result.prs.filter(
            (pr, index, self) =>
              index === self.findIndex((p) => getPRKey(p) === getPRKey(pr))
          );
          setReviewedPRs(uniqueReviewedPRs);
          setReviewedCursor(result.nextCursor);
          setHasMoreReviewed(!!result.nextCursor);
        } catch (error) {
          console.error('Failed to load reviewed PRs:', error);
        }
      };
      loadReviewedPRs();
    }
  }, [activeTab, reviewedPRs.length, loading, services]);


  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const prRepo = services.getPullRequestRepository();

      // Helper function to get PR key
      const getPRKey = (pr: PullRequest) => `${pr.repository.nameWithOwner}-${pr.number}`;

      if (activeTab === 'created') {
        const result = await prRepo.getCreatedByMe(10, createdCursor);
        // Remove duplicates by repository.nameWithOwner and number
        setCreatedPRs((prev) => {
          const existingKeys = new Set(prev.map((pr) => getPRKey(pr)));
          const newPRs = result.prs.filter((pr) => !existingKeys.has(getPRKey(pr)));
          return [...prev, ...newPRs];
        });
        setCreatedCursor(result.nextCursor);
        setHasMoreCreated(!!result.nextCursor);
      } else if (activeTab === 'review-requested') {
        // Load both review requested and reviewed PRs
        const [reviewRequestedResult, reviewedResult] = await Promise.all([
          prRepo.getReviewRequested(10, reviewRequestedCursor),
          reviewedCursor ? prRepo.getReviewedByMe(10, reviewedCursor) : Promise.resolve({ prs: [], nextCursor: undefined })
        ]);
        
        // Remove duplicates by repository.nameWithOwner and number
        setReviewRequestedPRs((prev) => {
          const existingKeys = new Set(prev.map((pr) => getPRKey(pr)));
          const newPRs = reviewRequestedResult.prs.filter((pr) => !existingKeys.has(getPRKey(pr)));
          return [...prev, ...newPRs];
        });
        setReviewRequestedCursor(reviewRequestedResult.nextCursor);
        setHasMoreReviewRequested(!!reviewRequestedResult.nextCursor);
        
        // Also update reviewed PRs for the reviewed badge
        if (reviewedResult.prs.length > 0) {
          setReviewedPRs((prev) => {
            const existingKeys = new Set(prev.map((pr) => getPRKey(pr)));
            const newPRs = reviewedResult.prs.filter((pr) => !existingKeys.has(getPRKey(pr)));
            return [...prev, ...newPRs];
          });
          setReviewedCursor(reviewedResult.nextCursor);
          setHasMoreReviewed(!!reviewedResult.nextCursor);
        }
      }
    } catch (error) {
      console.error('Failed to load more PRs:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Filter PRs based on review status
  const filteredPRs = useMemo(() => {
    let prs: PullRequest[];
    if (activeTab === 'created') {
      prs = createdPRs;
    } else {
      // Merge review requested and reviewed PRs, removing duplicates
      const getPRKey = (pr: PullRequest) => `${pr.repository.nameWithOwner}-${pr.number}`;
      const prMap = new Map<string, PullRequest>();
      
      // Add review requested PRs first
      reviewRequestedPRs.forEach((pr) => {
        prMap.set(getPRKey(pr), pr);
      });
      
      // Add reviewed PRs (they will overwrite if duplicate, which is fine)
      reviewedPRs.forEach((pr) => {
        prMap.set(getPRKey(pr), pr);
      });
      
      prs = Array.from(prMap.values());
    }
    
    if (reviewFilters.includes('ALL') || reviewFilters.length === 0) {
      return prs;
    }

    return prs.filter((pr) => {
      // 選択されたフィルターのいずれかに一致するかチェック
      return reviewFilters.some((filter) => {
        switch (filter) {
          case 'REVIEW_REQUIRED':
            // REVIEW_REQUIRED: reviewDecisionがREVIEW_REQUIRED、またはレビューがまだない
            return pr.reviewDecision === 'REVIEW_REQUIRED' || 
                   (pr.reviewDecision === null && pr.reviews.length === 0);
          
          case 'APPROVED':
            // APPROVED: stateがOPENで、かつreviewDecisionがAPPROVED、またはレビューにAPPROVED状態がある
            if (pr.state !== 'OPEN') return false;
            return pr.reviewDecision === 'APPROVED' || 
                   pr.reviews.some(review => review.state === 'APPROVED');
          
          case 'CHANGES_REQUESTED':
            // CHANGES_REQUESTED: reviewDecisionがCHANGES_REQUESTED、またはレビューにCHANGES_REQUESTED状態がある
            return pr.reviewDecision === 'CHANGES_REQUESTED' || 
                   pr.reviews.some(review => review.state === 'CHANGES_REQUESTED');
          
          case 'COMMENTED':
            // COMMENTED: レビューにCOMMENTED状態がある
            return pr.reviews.some(review => review.state === 'COMMENTED');
          
          case 'DISMISSED':
            // DISMISSED: レビューにDISMISSED状態がある
            return pr.reviews.some(review => review.state === 'DISMISSED');
          
          case 'PENDING':
            // PENDING: レビューにPENDING状態がある
            return pr.reviews.some(review => review.state === 'PENDING');
          
          default:
            return false;
        }
      });
    });
  }, [activeTab, createdPRs, reviewRequestedPRs, reviewedPRs, reviewFilters]);

  const currentPRs = filteredPRs;
  const currentTitle = activeTab === 'created'
    ? t.pullRequestsCreated
    : t.pullRequestsReviewRequested;
  const currentEmptyMessage = activeTab === 'created'
    ? t.noPullRequests
    : t.noPullRequestsReview;
  const currentIcon = activeTab === 'created'
    ? 'fa-code-pull-request'
    : 'fa-user-check';
  const currentHasMore = activeTab === 'created'
    ? hasMoreCreated
    : hasMoreReviewRequested || hasMoreReviewed;

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
            {(reviewRequestedPRs.length > 0 || reviewedPRs.length > 0) && (
              <span className="pr-tab-count">({reviewRequestedPRs.length + reviewedPRs.length})</span>
            )}
          </button>
          <div className="pr-tab-header-actions">
            <ReviewStatusFilter
              selectedFilters={reviewFilters}
              onChange={setReviewFilters}
              disabled={loading}
            />
          </div>
        </div>
        <div className="section-content">
          {currentPRs.length === 0 ? (
            <p className="empty-message">{currentEmptyMessage}</p>
          ) : (
            <>
              {currentPRs.map((pr) => {
                const getPRKey = (pr: PullRequest) => `${pr.repository.nameWithOwner}-${pr.number}`;
                const isReviewed = reviewedPRKeys.has(getPRKey(pr));
                return (
                  <PRCard 
                    key={`${pr.repository.nameWithOwner}-${pr.number}`} 
                    pr={pr} 
                    isReviewed={isReviewed}
                  />
                );
              })}
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


import React, { useState, useEffect } from 'react';
import { Issue } from '@/domain/entities/Issue';
import { IssueCard } from './IssueCard';
import { LoadMoreButton } from './LoadMoreButton';
import { SkeletonLoader } from './SkeletonLoader';
import { Container } from '@/application/di/Container';
import { useLanguage } from '../i18n/useLanguage';
import './styles/section.css';

interface IssueSectionProps {
  issues: Issue[];
  loading?: boolean;
}

export const IssueSection: React.FC<IssueSectionProps> = React.memo(({
  issues: initialIssues,
  loading: initialLoading = false,
}) => {
  const { t } = useLanguage();
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>();

  // Update issues when initialIssues changes
  useEffect(() => {
    setIssues(initialIssues);
  }, [initialIssues]);

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      const container = Container.getInstance();
      const issueRepo = container.getIssueRepository();
      const result = await issueRepo.getInvolved(10, cursor);

      setIssues((prev) => [...prev, ...result.issues]);
      setCursor(result.nextCursor);
      setHasMore(!!result.nextCursor);
    } catch (error) {
      console.error('Failed to load more issues:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <section className="dashboard-section">
        <h2 className="section-title">
          <i className="fas fa-exclamation-circle"></i>
          {t.issuesInvolved}
        </h2>
        <div className="section-content">
          <SkeletonLoader count={3} />
        </div>
      </section>
    );
  }

  if (issues.length === 0) {
    return (
      <section className="dashboard-section">
        <h2 className="section-title">
          <i className="fas fa-exclamation-circle"></i>
          {t.issuesInvolved}
        </h2>
        <div className="section-content">
          <p className="empty-message">{t.noIssues}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <h2 className="section-title">
        <i className="fas fa-exclamation-circle"></i>
        {t.issuesInvolved}
      </h2>
      <div className="section-content">
        {issues.map((issue) => (
          <IssueCard
            key={`${issue.repository.nameWithOwner}-${issue.number}`}
            issue={issue}
          />
        ))}
        <LoadMoreButton
          onClick={handleLoadMore}
          loading={loading}
          hasMore={hasMore}
        />
      </div>
    </section>
  );
});


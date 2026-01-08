import React, { useState, useEffect } from 'react';
import { Repository } from '@/domain/entities/Repository';
import { RepositoryCard } from './RepositoryCard';
import { LoadMoreButton } from './LoadMoreButton';
import { SkeletonLoader } from './SkeletonLoader';
import { Container } from '@/application/di/Container';
import { useLanguage } from '../i18n/useLanguage';
import './styles/section.css';

interface RepositorySectionProps {
  repositories: Repository[];
  loading?: boolean;
}

export const RepositorySection: React.FC<RepositorySectionProps> = React.memo(({
  repositories: initialRepositories,
  loading: initialLoading = false,
}) => {
  const { t } = useLanguage();
  const [repositories, setRepositories] = useState<Repository[]>(initialRepositories);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>();

  // Update repositories when initialRepositories changes, removing duplicates
  useEffect(() => {
    // Remove duplicates by nameWithOwner
    const uniqueRepos = initialRepositories.filter(
      (repo, index, self) =>
        index === self.findIndex((r) => r.nameWithOwner === repo.nameWithOwner)
    );
    setRepositories(uniqueRepos);
  }, [initialRepositories]);

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      const container = Container.getInstance();
      const repoService = container.getRepositoryService();
      const result = await repoService.getRecentlyUpdated(10, cursor);

      // Remove duplicates by nameWithOwner
      setRepositories((prev) => {
        const existingNames = new Set(prev.map((r) => r.nameWithOwner));
        const newRepos = result.repositories.filter(
          (r) => !existingNames.has(r.nameWithOwner)
        );
        return [...prev, ...newRepos];
      });
      setCursor(result.nextCursor);
      setHasMore(!!result.nextCursor);
    } catch (error) {
      console.error('Failed to load more repositories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading && repositories.length === 0) {
    return (
      <section className="dashboard-section">
        <h2 className="section-title">
          <i className="fas fa-code-branch"></i>
          {t.recentlyUpdatedRepositories}
        </h2>
        <div className="section-content">
          <SkeletonLoader count={3} />
        </div>
      </section>
    );
  }

  if (repositories.length === 0) {
    return (
      <section className="dashboard-section">
        <h2 className="section-title">
          <i className="fas fa-code-branch"></i>
          {t.recentlyUpdatedRepositories}
        </h2>
        <div className="section-content">
          <p className="empty-message">{t.noRepositories}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <h2 className="section-title">
        <i className="fas fa-code-branch"></i>
        {t.recentlyUpdatedRepositories}
      </h2>
      <div className="section-content">
        {repositories.map((repo) => (
          <RepositoryCard key={repo.nameWithOwner} repository={repo} />
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

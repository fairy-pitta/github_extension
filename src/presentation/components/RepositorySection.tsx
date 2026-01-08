import React, { useState, useEffect } from 'react';
import { Repository } from '@/domain/entities/Repository';
import { RepositoryCard } from './RepositoryCard';
import { LoadMoreButton } from './LoadMoreButton';
import { Container } from '@/application/di/Container';
import './styles/section.css';

interface RepositorySectionProps {
  repositories: Repository[];
  loading?: boolean;
}

export const RepositorySection: React.FC<RepositorySectionProps> = ({
  repositories: initialRepositories,
  loading: initialLoading = false,
}) => {
  const [repositories, setRepositories] = useState<Repository[]>(initialRepositories);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>();

  // Update repositories when initialRepositories changes
  useEffect(() => {
    setRepositories(initialRepositories);
  }, [initialRepositories]);

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      const container = Container.getInstance();
      const repoService = container.getRepositoryService();
      const result = await repoService.getRecentlyUpdated(20, cursor);

      setRepositories((prev) => [...prev, ...result.repositories]);
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
        <h2 className="section-title">Recently Updated Repositories</h2>
        <div className="section-content">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (repositories.length === 0) {
    return (
      <section className="dashboard-section">
        <h2 className="section-title">Recently Updated Repositories</h2>
        <div className="section-content">
          <p className="empty-message">No repositories found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <h2 className="section-title">Recently Updated Repositories</h2>
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
};

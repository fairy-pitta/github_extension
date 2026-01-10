import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Repository } from '@/domain/entities/Repository';
import { Organization } from '@/domain/entities/Organization';
import { User } from '@/domain/entities/User';
import { RepositoryCard } from './RepositoryCard';
import { LoadMoreButton } from './LoadMoreButton';
import { SkeletonLoader } from './SkeletonLoader';
import { useLanguage } from '../i18n/useLanguage';
import { useServices } from '../context/ServiceContext';
import { useAuth } from '../dashboard/hooks/useAuth';
import { useFavoriteRepositories } from '../dashboard/hooks/useFavoriteRepositories';
import './styles/section.css';
import './styles/repo-tabs.css';

interface RepositorySectionProps {
  repositories: Repository[];
  loading?: boolean;
}

type TabType = 'all' | 'org' | 'me';

export const RepositorySection: React.FC<RepositorySectionProps> = React.memo(({
  repositories: initialRepositories,
  loading: initialLoading = false,
}) => {
  const services = useServices();
  const { t } = useLanguage();
  const auth = useAuth();
  const { favoriteRepositories, isFavorite } = useFavoriteRepositories();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [isStarActive, setIsStarActive] = useState(false);
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
      const repoService = services.getRepositoryService();
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

  // Filter repositories based on active tab and star state
  const filteredRepos = useMemo(() => {
    // Step 1: Filter by tab first
    let repos = repositories.filter((repo) => {
      if (activeTab === 'all') return true;
      if (activeTab === 'org') return repo.owner instanceof Organization;
      if (activeTab === 'me') {
        return (
          repo.owner instanceof User &&
          auth.user &&
          repo.owner.login === auth.user.login
        );
      }
      return true;
    });

    // Step 2: If star is active, filter to show only favorites from the tab-filtered results
    if (isStarActive) {
      repos = repos.filter((repo) =>
        favoriteRepositories.includes(repo.nameWithOwner)
      );
    }

    // Sort by updatedAt (newest first)
    return repos.sort((a, b) => {
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  }, [repositories, activeTab, isStarActive, favoriteRepositories, auth.user]);

  const handleStarClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStarActive((prev) => !prev);
  }, []);

  const getTabTitle = useCallback(
    (tab: TabType) => {
      switch (tab) {
        case 'all':
          return t.allRepositories;
        case 'org':
          return t.organizationRepositories;
        case 'me':
          return t.myRepositories;
      }
    },
    [t]
  );

  const getTabIcon = useCallback((tab: TabType) => {
    switch (tab) {
      case 'all':
        return 'fa-code-branch';
      case 'org':
        return 'fa-building';
      case 'me':
        return 'fa-user';
    }
  }, []);

  const getTabGitHubUrl = useCallback(
    (tab: TabType): string => {
      if (!auth.user) return '#';
      
      if (tab === 'all' || tab === 'me') {
        return `https://github.com/${auth.user.login}?tab=repositories`;
      }
      
      if (tab === 'org') {
        // Get first organization repository from filtered repos
        const orgRepos = filteredRepos.filter((repo) => repo.owner instanceof Organization);
        if (orgRepos.length > 0) {
          const firstOrg = orgRepos[0].owner as Organization;
          return `https://github.com/${firstOrg.login}?tab=repositories`;
        }
        // Fallback to user's repositories if no org repos
        return `https://github.com/${auth.user.login}?tab=repositories`;
      }
      
      return '#';
    },
    [auth.user, filteredRepos]
  );

  const getTabExternalLinkTitle = useCallback(
    (tab: TabType): string => {
      switch (tab) {
        case 'all':
          return t.viewAllRepositories;
        case 'org':
          return t.viewOrganizationRepositories;
        case 'me':
          return t.viewMyRepositories;
      }
    },
    [t]
  );

  if (initialLoading) {
    return (
      <section className="dashboard-section">
        <div className="repo-tabs">
          <div className="repo-tab-header">
            <button className="repo-tab active" disabled>
              <i className="fas fa-code-branch"></i>
              {t.allRepositories}
              <span className={`repo-tab-star ${isStarActive ? 'active' : ''}`}>
                <i className="fas fa-star"></i>
              </span>
            </button>
            <button className="repo-tab" disabled>
              <i className="fas fa-building"></i>
              {t.organizationRepositories}
              <span className={`repo-tab-star ${isStarActive ? 'active' : ''}`}>
                <i className="fas fa-star"></i>
              </span>
            </button>
            <button className="repo-tab" disabled>
              <i className="fas fa-user"></i>
              {t.myRepositories}
              <span className={`repo-tab-star ${isStarActive ? 'active' : ''}`}>
                <i className="fas fa-star"></i>
              </span>
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
      <div className="repo-tabs">
        <div className="repo-tab-header">
          {(['all', 'org', 'me'] as TabType[]).map((tab) => (
            <div key={tab} className="repo-tab-wrapper">
              <button
                className={`repo-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                <i className={`fas ${getTabIcon(tab)}`}></i>
                {getTabTitle(tab)}
                <span
                  className={`repo-tab-star ${isStarActive ? 'active' : ''}`}
                  onClick={handleStarClick}
                  title={t.favoriteRepositories}
                >
                  <i className="fas fa-star"></i>
                </span>
              </button>
              {auth.user && (
                <a
                  href={getTabGitHubUrl(tab)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repo-tab-external-link"
                  title={getTabExternalLinkTitle(tab)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <i className="fas fa-external-link-alt"></i>
                </a>
              )}
            </div>
          ))}
        </div>
        <div className="section-content">
          {filteredRepos.length === 0 ? (
            <p className="empty-message">{t.noRepositories}</p>
          ) : (
            <>
              {filteredRepos.map((repo) => (
                <RepositoryCard key={repo.nameWithOwner} repository={repo} />
              ))}
              <LoadMoreButton
                onClick={handleLoadMore}
                loading={loading}
                hasMore={hasMore}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
});

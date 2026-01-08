import React, { useState, lazy, Suspense, useCallback, useEffect } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { Header } from './components/Header';
import { AuthGuard } from './components/AuthGuard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { StatsWidget } from '../components/StatsWidget';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { useAuth } from './hooks/useAuth';
import { useDashboardData } from './hooks/useDashboardData';
import { useTheme } from './hooks/useTheme';
import { Container } from '@/application/di/Container';
import { StatsData } from '@/domain/entities/StatsData';
import './styles/newtab.css';

// Lazy load sections for code splitting
const ProfileSection = lazy(() =>
  import('../components/ProfileSection').then((module) => ({
    default: module.ProfileSection,
  }))
);
const PullRequestSection = lazy(() =>
  import('../components/PullRequestSection').then((module) => ({
    default: module.PullRequestSection,
  }))
);
const IssueSection = lazy(() =>
  import('../components/IssueSection').then((module) => ({
    default: module.IssueSection,
  }))
);
const RepositorySection = lazy(() =>
  import('../components/RepositorySection').then((module) => ({
    default: module.RepositorySection,
  }))
);

export const NewTabApp: React.FC = () => {
  const auth = useAuth();
  useTheme(); // Initialize theme
  const [filter, setFilter] = useState<'all' | 'open'>('open');
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const dashboard = useDashboardData(4, filter === 'open', !auth.loading && auth.isAuthenticated);

  const handleRefresh = useCallback(async () => {
    await dashboard.refresh();
  }, [dashboard.refresh]);

  const handleStatsClick = useCallback(() => {
    setIsStatsOpen(true);
    // Fetch stats when opening
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const container = Container.getInstance();
        const statsService = container.getStatsService();
        const statsData = await statsService.getStatsData();
        setStats(statsData);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setStats(null);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleStatsClose = useCallback(() => {
    setIsStatsOpen(false);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // 'r' key for refresh
      if (event.key === 'r' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        handleRefresh();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleRefresh]);

  if (!auth.isAuthenticated) {
    if (auth.loading) {
      return (
        <div className="dashboard-container">
          <LoadingSpinner size="large" />
        </div>
      );
    }
    return <AuthGuard />;
  }

  return (
    <div className="dashboard-container">
      <Header
        onRefresh={handleRefresh}
        refreshing={dashboard.loading}
        filter={filter}
        onFilterChange={setFilter}
        user={auth.user}
        onStatsClick={handleStatsClick}
      />

      {dashboard.error && (
        <div style={{ flexShrink: 0, marginBottom: '16px' }}>
          <ErrorMessage error={dashboard.error} onRetry={handleRefresh} />
        </div>
      )}

      <DashboardLayout>
        <Suspense
          fallback={
            <>
              <section className="dashboard-section profile-section">
                <div className="profile-content">
                  <SkeletonLoader count={1} />
                </div>
              </section>
              <section className="dashboard-section">
                <h2 className="section-title">
                  <i className="fas fa-code-branch"></i>
                </h2>
                <div className="section-content">
                  <SkeletonLoader count={3} />
                </div>
              </section>
              <section className="dashboard-section">
                <div className="pr-tabs">
                  <div className="pr-tab-header">
                    <button className="pr-tab active" disabled>
                      <i className="fas fa-code-pull-request"></i>
                    </button>
                    <button className="pr-tab" disabled>
                      <i className="fas fa-user-check"></i>
                    </button>
                  </div>
                  <div className="section-content">
                    <SkeletonLoader count={3} />
                  </div>
                </div>
              </section>
              <section className="dashboard-section">
                <h2 className="section-title">
                  <i className="fas fa-exclamation-circle"></i>
                </h2>
                <div className="section-content">
                  <SkeletonLoader count={3} />
                </div>
              </section>
            </>
          }
        >
          <ProfileSection user={auth.user} loading={auth.loading} />
          <RepositorySection
            repositories={dashboard.data?.recentlyUpdatedRepos ?? []}
            loading={dashboard.loading}
          />
          <PullRequestSection
            createdPRs={dashboard.data?.createdPRs ?? []}
            reviewRequestedPRs={dashboard.data?.reviewRequestedPRs ?? []}
            loading={dashboard.loading}
          />
          <IssueSection issues={dashboard.data?.involvedIssues ?? []} loading={dashboard.loading} />
        </Suspense>
      </DashboardLayout>
      <StatsWidget
        stats={stats}
        loading={statsLoading}
        isOpen={isStatsOpen}
        onClose={handleStatsClose}
      />
    </div>
  );
};


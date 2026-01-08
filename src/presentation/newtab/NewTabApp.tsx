import React, { useState, lazy, Suspense, useCallback, useEffect } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { Header } from './components/Header';
import { AuthGuard } from './components/AuthGuard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { useAuth } from './hooks/useAuth';
import { useDashboardData } from './hooks/useDashboardData';
import { useTheme } from './hooks/useTheme';
import './styles/newtab.css';

// Lazy load sections for code splitting
const CreatedPRSection = lazy(() =>
  import('../components/CreatedPRSection').then((module) => ({
    default: module.CreatedPRSection,
  }))
);
const ReviewRequestedPRSection = lazy(() =>
  import('../components/ReviewRequestedPRSection').then((module) => ({
    default: module.ReviewRequestedPRSection,
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
  const dashboard = useDashboardData(4, filter === 'open', !auth.loading && auth.isAuthenticated);

  const handleRefresh = useCallback(async () => {
    await dashboard.refresh();
  }, [dashboard.refresh]);

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

  if (auth.loading) {
    return (
      <div className="dashboard-container">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <AuthGuard />;
  }

  return (
    <div className="dashboard-container">
      <Header
        onRefresh={handleRefresh}
        refreshing={dashboard.loading}
        filter={filter}
        onFilterChange={setFilter}
      />

      {dashboard.error && (
        <div style={{ flexShrink: 0, marginBottom: '16px' }}>
          <ErrorMessage error={dashboard.error} onRetry={handleRefresh} />
        </div>
      )}

      {dashboard.loading && !dashboard.data ? (
        <LoadingSpinner size="large" />
      ) : (
        <DashboardLayout>
          <Suspense fallback={<LoadingSpinner size="small" />}>
            <RepositorySection
              repositories={dashboard.data?.recentlyUpdatedRepos ?? []}
              loading={dashboard.loading}
            />
            <CreatedPRSection prs={dashboard.data?.createdPRs ?? []} loading={dashboard.loading} />
            <ReviewRequestedPRSection
              prs={dashboard.data?.reviewRequestedPRs ?? []}
              loading={dashboard.loading}
            />
            <IssueSection issues={dashboard.data?.involvedIssues ?? []} loading={dashboard.loading} />
          </Suspense>
        </DashboardLayout>
      )}
    </div>
  );
};


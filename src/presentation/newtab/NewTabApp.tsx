import React, { useState, lazy, Suspense, useCallback } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { Header } from './components/Header';
import { AuthGuard } from './components/AuthGuard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { useAuth } from './hooks/useAuth';
import { useDashboardData } from './hooks/useDashboardData';
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
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [filter, setFilter] = useState<'all' | 'open'>('all');
  const {
    data,
    loading: dataLoading,
    error,
    refresh,
  } = useDashboardData(10, filter === 'open');

  if (authLoading) {
    return (
      <div className="dashboard-container">
        <LoadingSpinner size="large" message="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthGuard />;
  }

  const handleRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

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

  return (
    <div className="dashboard-container">
      <Header
        onRefresh={handleRefresh}
        refreshing={dataLoading}
        filter={filter}
        onFilterChange={setFilter}
      />

      {error && (
        <ErrorMessage error={error} onRetry={handleRefresh} />
      )}

      {dataLoading && !data ? (
        <LoadingSpinner size="large" message="Loading dashboard data..." />
      ) : (
        <DashboardLayout>
          <Suspense fallback={<LoadingSpinner size="small" message="Loading..." />}>
            <CreatedPRSection prs={data?.createdPRs ?? []} loading={dataLoading} />
            <ReviewRequestedPRSection
              prs={data?.reviewRequestedPRs ?? []}
              loading={dataLoading}
            />
            <IssueSection issues={data?.involvedIssues ?? []} loading={dataLoading} />
            <RepositorySection
              repositories={data?.recentlyUpdatedRepos ?? []}
              loading={dataLoading}
            />
          </Suspense>
        </DashboardLayout>
      )}
    </div>
  );
};


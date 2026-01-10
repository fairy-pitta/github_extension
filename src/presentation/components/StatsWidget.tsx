import React from 'react';
import { StatsData } from '@/domain/entities/StatsData';
import { useLanguage } from '../i18n/useLanguage';
import './styles/stats-widget.css';

interface StatsWidgetProps {
  stats: StatsData | null;
  loading?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({
  stats,
  loading = false,
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();

  if (!isOpen) {
    return null;
  }

  const formatChange = (change: number): string => {
    if (change > 0) {
      return `+${change}%`;
    }
    return `${change}%`;
  };

  const getChangeColor = (change: number): string => {
    if (change > 0) return 'var(--success-color, #28a745)';
    if (change < 0) return 'var(--error-color, #dc3545)';
    return 'var(--text-color-secondary)';
  };

  const StatCard: React.FC<{
    title: string;
    current: number;
    previous: number;
    change: number;
    icon: string;
  }> = ({ title, current, previous, change, icon }) => (
    <div className="stat-card">
      <div className="stat-card-header">
        <i className={`fas ${icon} stat-icon`}></i>
        <h4 className="stat-title">{title}</h4>
      </div>
      <div className="stat-card-content">
        <div className="stat-value">{current.toLocaleString()}</div>
        <div className="stat-comparison">
          <span className="stat-previous">前: {previous.toLocaleString()}</span>
          <span
            className="stat-change"
            style={{ color: getChangeColor(change) }}
          >
            {formatChange(change)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="stats-widget-overlay" onClick={onClose}>
      <div className="stats-widget" onClick={(e) => e.stopPropagation()}>
        <div className="stats-widget-header">
          <h2 className="stats-widget-title">{t.statsTitle || '統計情報'}</h2>
          <button
            className="stats-widget-close"
            onClick={onClose}
            aria-label={t.close || '閉じる'}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="stats-widget-content">
          {loading ? (
            <div className="stats-widget-loading">
              <div className="loading-spinner"></div>
              <p>{t.loading || '読み込み中...'}</p>
            </div>
          ) : stats ? (
            <>
              <div className="stats-section">
                <h3 className="stats-section-title">{t.statsThisWeek || '今週'}</h3>
                <div className="stats-grid">
                  <StatCard
                    title={t.statsCommits || 'コミット'}
                    current={stats.currentWeek.commits}
                    previous={stats.previousWeek.commits}
                    change={stats.getWeekChange('commits')}
                    icon="fa-code"
                  />
                  <StatCard
                    title={t.statsPullRequests || 'プルリクエスト'}
                    current={stats.currentWeek.pullRequests}
                    previous={stats.previousWeek.pullRequests}
                    change={stats.getWeekChange('pullRequests')}
                    icon="fa-code-branch"
                  />
                  <StatCard
                    title={t.statsReviews || 'レビュー'}
                    current={stats.currentWeek.reviews}
                    previous={stats.previousWeek.reviews}
                    change={stats.getWeekChange('reviews')}
                    icon="fa-eye"
                  />
                  <StatCard
                    title={t.statsIssues || 'イシュー'}
                    current={stats.currentWeek.issues}
                    previous={stats.previousWeek.issues}
                    change={stats.getWeekChange('issues')}
                    icon="fa-exclamation-circle"
                  />
                </div>
              </div>
              <div className="stats-section">
                <h3 className="stats-section-title">{t.statsThisMonth || '今月'}</h3>
                <div className="stats-grid">
                  <StatCard
                    title={t.statsCommits || 'コミット'}
                    current={stats.currentMonth.commits}
                    previous={stats.previousMonth.commits}
                    change={stats.getMonthChange('commits')}
                    icon="fa-code"
                  />
                  <StatCard
                    title={t.statsPullRequests || 'プルリクエスト'}
                    current={stats.currentMonth.pullRequests}
                    previous={stats.previousMonth.pullRequests}
                    change={stats.getMonthChange('pullRequests')}
                    icon="fa-code-branch"
                  />
                  <StatCard
                    title={t.statsReviews || 'レビュー'}
                    current={stats.currentMonth.reviews}
                    previous={stats.previousMonth.reviews}
                    change={stats.getMonthChange('reviews')}
                    icon="fa-eye"
                  />
                  <StatCard
                    title={t.statsIssues || 'イシュー'}
                    current={stats.currentMonth.issues}
                    previous={stats.previousMonth.issues}
                    change={stats.getMonthChange('issues')}
                    icon="fa-exclamation-circle"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="stats-widget-error">
              <p>{t.noData || 'データが見つかりません'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



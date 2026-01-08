import React, { useState, useEffect } from 'react';
import { User } from '@/domain/entities/User';
import { ContributionCalendar } from '@/domain/entities/ContributionCalendar';
import { ContributionStreak } from '@/domain/entities/ContributionStreak';
import { AchievementBadge } from '@/domain/entities/AchievementBadge';
import { Container } from '@/application/di/Container';
import { useLanguage } from '../i18n/useLanguage';
import { SkeletonLoader } from './SkeletonLoader';
import { StreakDisplay } from './StreakDisplay';
import { AchievementBadges } from './AchievementBadges';
import './styles/profile-section.css';

interface ProfileSectionProps {
  user: User | null;
  loading?: boolean;
}

export const ProfileSection: React.FC<ProfileSectionProps> = React.memo(({ user, loading = false }) => {
  const { t } = useLanguage();
  const [calendar, setCalendar] = useState<ContributionCalendar | null>(null);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const [streak, setStreak] = useState<ContributionStreak | null>(null);
  const [streakLoading, setStreakLoading] = useState(false);
  const [badges, setBadges] = useState<AchievementBadge[]>([]);
  const [badgesLoading, setBadgesLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setCalendarLoading(false);
      return;
    }

    const fetchCalendar = async () => {
      try {
        setCalendarLoading(true);
        setCalendarError(null);
        const container = Container.getInstance();
        const calendarRepo = container.getContributionCalendarRepository();
        
        // Get last year's contributions (exactly 365 days ago to now)
        const now = new Date();
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        // Set to start of day for consistency
        oneYearAgo.setHours(0, 0, 0, 0);
        now.setHours(23, 59, 59, 999);
        
        const calendarData = await calendarRepo.getCalendar(
          oneYearAgo.toISOString(),
          now.toISOString()
        );
        setCalendar(calendarData);
      } catch (error) {
        console.error('Failed to fetch contribution calendar:', error);
        setCalendarError(
          error instanceof Error ? error.message : 'Failed to load contribution calendar'
        );
      } finally {
        setCalendarLoading(false);
      }
    };

    fetchCalendar();
  }, [user]);

  // Fetch streak and achievements when calendar is available
  useEffect(() => {
    if (!calendar || !user) {
      return;
    }

    const fetchStreakAndBadges = async () => {
      try {
        setStreakLoading(true);
        setBadgesLoading(true);
        const container = Container.getInstance();
        const streakService = container.getStreakService();
        const achievementService = container.getAchievementService();
        const prRepository = container.getPullRequestRepository();

        // Calculate streak
        const streakData = await streakService.calculateStreak(calendar);
        setStreak(streakData);

        // Get PRs for achievements (limit to 100)
        const prsResult = await prRepository.getCreatedByMe(100);
        const pullRequests = prsResult.prs;

        // Check achievements (reviews count will be 0 for now, can be enhanced later)
        const badgesData = await achievementService.checkAchievements(
          calendar,
          pullRequests,
          0 // reviews count - can be enhanced later
        );
        setBadges(badgesData);
      } catch (error) {
        console.error('Failed to fetch streak and achievements:', error);
      } finally {
        setStreakLoading(false);
        setBadgesLoading(false);
      }
    };

    fetchStreakAndBadges();
  }, [calendar, user]);

  if (loading || !user) {
    return (
      <section className="dashboard-section profile-section">
        <div className="profile-content">
          <SkeletonLoader count={1} />
        </div>
      </section>
    );
  }

  const getContributionLevel = (count: number): string => {
    if (count === 0) return 'level-0';
    if (count <= 3) return 'level-1';
    if (count <= 6) return 'level-2';
    if (count <= 9) return 'level-3';
    return 'level-4';
  };

  // Get all contribution days from all weeks
  const allDays: Array<{ date: string; count: number; color: string }> = [];
  calendar?.weeks.forEach((week) => {
    week.contributionDays.forEach((day) => {
      allDays.push({
        date: day.date,
        count: day.contributionCount,
        color: day.color,
      });
    });
  });

  // Get last 365 days (or less if we don't have that much data)
  const displayDays = allDays.slice(-365);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <section className="dashboard-section profile-section">
      <div className="profile-content">
        <div className="profile-header">
          {user.avatarUrl && (
            <img src={user.avatarUrl} alt={user.login} className="profile-avatar" />
          )}
          <div className="profile-info">
            <h2 className="profile-name">{user.name || user.login}</h2>
            <p className="profile-username">@{user.login}</p>
            {user.bio && (
              <p className="profile-bio">{user.bio}</p>
            )}
            {calendar && (
              <p className="profile-contributions">
                {calendar.totalContributions} {t.contributionsLastYear}
              </p>
            )}
            {/* Compact Stats Badges */}
            <div className="profile-stats-badges">
              <span className="profile-stat-badge">
                <i className="fas fa-users"></i>
                {formatNumber(user.followers)}
              </span>
              <span className="profile-stat-badge">
                <i className="fas fa-user-plus"></i>
                {formatNumber(user.following)}
              </span>
              <span className="profile-stat-badge">
                <i className="fas fa-code-branch"></i>
                {formatNumber(user.repositories)}
              </span>
              <span className="profile-stat-badge">
                <i className="fas fa-star"></i>
                {formatNumber(user.starredRepositories)}
              </span>
            </div>
            {/* Organization Tags */}
            {user.organizations.length > 0 && (
              <div className="profile-org-tags">
                {user.organizations.map((org) => (
                  <a
                    key={org.login}
                    href={`https://github.com/${org.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-org-tag"
                    title={org.name || org.login}
                  >
                    {org.avatarUrl && (
                      <img src={org.avatarUrl} alt={org.login} className="org-tag-avatar" />
                    )}
                    <span>{org.name || org.login}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        {(user.location || user.company || user.websiteUrl || user.organizations.length > 0) && (
          <div className="profile-additional-info">
            {user.location && (
              <div className="profile-info-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>{user.location}</span>
              </div>
            )}
            {user.company && (
              <div className="profile-info-item">
                <i className="fas fa-building"></i>
                <span>{user.company}</span>
              </div>
            )}
            {user.websiteUrl && (
              <div className="profile-info-item">
                <i className="fas fa-link"></i>
                <a href={user.websiteUrl} target="_blank" rel="noopener noreferrer">
                  {user.websiteUrl.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        )}
        {calendarLoading ? (
          <div className="contribution-calendar-loading">
            <SkeletonLoader count={1} />
          </div>
        ) : calendarError ? (
          <div className="contribution-calendar-error">
            <p style={{ color: 'var(--text-color-secondary)', fontSize: '0.875rem' }}>
              {calendarError}
            </p>
          </div>
        ) : calendar && calendar.weeks.length > 0 ? (
          <div className="contribution-calendar">
            <div className="contribution-grid">
              {displayDays.map((day, index) => (
                <div
                  key={`${day.date}-${index}`}
                  className={`contribution-day ${getContributionLevel(day.count)}`}
                  style={{ backgroundColor: day.color }}
                  title={`${day.date}: ${day.count} contributions`}
                />
              ))}
            </div>
            <div className="contribution-legend">
              <span className="legend-label">Less</span>
              <div className="legend-levels">
                <div className="legend-level level-0" />
                <div className="legend-level level-1" />
                <div className="legend-level level-2" />
                <div className="legend-level level-3" />
                <div className="legend-level level-4" />
              </div>
              <span className="legend-label">More</span>
            </div>
          </div>
        ) : null}
        {/* Compact Streak and Achievements */}
        {(streak || badges.length > 0) && (
          <div className="streak-achievements-compact">
            <StreakDisplay streak={streak} loading={streakLoading} />
            <AchievementBadges badges={badges} loading={badgesLoading} />
          </div>
        )}
      </div>
    </section>
  );
});


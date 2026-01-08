import { AchievementBadge, BadgeType } from '../entities/AchievementBadge';
import { ContributionCalendar } from '../entities/ContributionCalendar';
import { PullRequest } from '../entities/PullRequest';
import { CalculateStreak } from './CalculateStreak';

export interface AchievementCheckInput {
  calendar: ContributionCalendar;
  pullRequests: PullRequest[];
  reviews: number;
}

/**
 * Use case: Check achievements
 * Checks which achievements have been unlocked based on user activity
 */
export class CheckAchievements {
  private readonly definitions: Array<{
    id: BadgeType;
    icon: string;
    getProgress: (input: AchievementCheckInput, currentStreak: number) => number;
    levels: Array<{ target: number; name: string; description: string }>;
  }> = [
    {
      id: 'weekly_pr',
      icon: 'fa-code-branch',
      getProgress: (input) => {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        return input.pullRequests.filter((pr) => pr.createdAt >= weekStart).length;
      },
      levels: [
        { target: 5, name: 'PR Rookie', description: '今週5個のPRを作成' },
        { target: 10, name: 'PR Master', description: '今週10個のPRを作成' },
        { target: 20, name: 'PR Elite', description: '今週20個のPRを作成' },
        { target: 40, name: 'PR Legend', description: '今週40個のPRを作成' },
      ],
    },
    {
      id: 'monthly_pr',
      icon: 'fa-trophy',
      getProgress: (input) => {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        monthStart.setHours(0, 0, 0, 0);
        return input.pullRequests.filter((pr) => pr.createdAt >= monthStart).length;
      },
      levels: [
        { target: 10, name: 'PR Builder', description: '今月10個のPRを作成' },
        { target: 25, name: 'PR Champion', description: '今月25個のPRを作成' },
        { target: 50, name: 'PR Titan', description: '今月50個のPRを作成' },
        { target: 100, name: 'PR Emperor', description: '今月100個のPRを作成' },
      ],
    },
    {
      id: 'monthly_commits',
      icon: 'fa-fire',
      getProgress: (input) => {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        monthStart.setHours(0, 0, 0, 0);
        let monthlyCommits = 0;
        input.calendar.weeks.forEach((week) => {
          week.contributionDays.forEach((day) => {
            const dayDate = new Date(day.date);
            if (dayDate >= monthStart) {
              monthlyCommits += day.contributionCount;
            }
          });
        });
        return monthlyCommits;
      },
      // Commit King has higher tiers beyond 100
      levels: [
        { target: 50, name: 'Commit Squire', description: '今月50回のコミット' },
        { target: 100, name: 'Commit King', description: '今月100回のコミット' },
        { target: 250, name: 'Commit Emperor', description: '今月250回のコミット' },
        { target: 500, name: 'Commit Titan', description: '今月500回のコミット' },
        { target: 1000, name: 'Commit Legend', description: '今月1000回のコミット' },
      ],
    },
    {
      id: 'weekly_reviews',
      icon: 'fa-eye',
      getProgress: (input) => input.reviews,
      levels: [
        { target: 3, name: 'Reviewer', description: '今週3回のレビュー' },
        { target: 5, name: 'Review Helper', description: '今週5回のレビュー' },
        { target: 10, name: 'Review Master', description: '今週10回のレビュー' },
        { target: 20, name: 'Review Legend', description: '今週20回のレビュー' },
      ],
    },
    {
      id: 'streak',
      icon: 'fa-calendar-week',
      getProgress: (_input, currentStreak) => currentStreak,
      levels: [
        { target: 3, name: 'Starter', description: '連続3日コントリビュート' },
        { target: 7, name: 'Week Warrior', description: '連続7日コントリビュート' },
        { target: 14, name: 'Fortnight Fighter', description: '連続14日コントリビュート' },
        { target: 30, name: 'Month Master', description: '連続30日コントリビュート' },
        { target: 60, name: 'Streak Veteran', description: '連続60日コントリビュート' },
        { target: 100, name: 'Streak Legend', description: '連続100日コントリビュート' },
      ],
    },
  ];

  private buildLeveledBadge(
    id: BadgeType,
    icon: string,
    progress: number,
    levels: Array<{ target: number; name: string; description: string }>
  ): AchievementBadge {
    const sorted = [...levels].sort((a, b) => a.target - b.target);
    const highestReachedIndex =
      sorted.reduce((acc, level, idx) => (progress >= level.target ? idx : acc), -1);

    // If not reached any level yet, the "current" level is the first one (locked)
    const currentIndex = Math.max(0, highestReachedIndex);
    const current = sorted[currentIndex];
    const achieved = progress >= current.target;
    const next = sorted[currentIndex + 1] ?? null;

    return AchievementBadge.fromPlain({
      id,
      name: current.name,
      description: current.description,
      icon,
      achieved,
      achievedAt: achieved ? new Date() : null,
      progress,
      target: current.target,
      nextTarget: next?.target ?? null,
      nextName: next?.name ?? null,
      nextDescription: next?.description ?? null,
    });
  }

  execute(input: AchievementCheckInput): AchievementBadge[] {
    const streakCalculator = new CalculateStreak();
    const streak = streakCalculator.execute(input.calendar);

    return this.definitions.map((def) => {
      const progress = def.getProgress(input, streak.currentStreak);
      return this.buildLeveledBadge(def.id, def.icon, progress, def.levels);
    });
  }
}


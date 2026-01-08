/**
 * AchievementBadge entity representing a user achievement
 */
export type BadgeType =
  | 'weekly_pr'
  | 'monthly_pr'
  | 'monthly_commits'
  | 'weekly_reviews'
  | 'streak';

export class AchievementBadge {
  constructor(
    public readonly id: BadgeType,
    public readonly name: string,
    public readonly description: string,
    public readonly icon: string,
    public readonly achieved: boolean,
    public readonly achievedAt: Date | null,
    public readonly progress: number,
    public readonly target: number,
    /** Next level threshold (null when already max level) */
    public readonly nextTarget: number | null,
    /** Next level title (null when already max level) */
    public readonly nextName: string | null,
    /** Next level description (null when already max level) */
    public readonly nextDescription: string | null
  ) {}

  static fromPlain(plain: {
    id: BadgeType;
    name: string;
    description: string;
    icon: string;
    achieved: boolean;
    achievedAt: string | Date | null;
    progress: number;
    target: number;
    nextTarget?: number | null;
    nextName?: string | null;
    nextDescription?: string | null;
  }): AchievementBadge {
    const achievedAt =
      plain.achievedAt === null
        ? null
        : plain.achievedAt instanceof Date
          ? plain.achievedAt
          : new Date(plain.achievedAt);

    return new AchievementBadge(
      plain.id,
      plain.name,
      plain.description,
      plain.icon,
      plain.achieved,
      achievedAt,
      plain.progress,
      plain.target,
      plain.nextTarget ?? null,
      plain.nextName ?? null,
      plain.nextDescription ?? null
    );
  }
}


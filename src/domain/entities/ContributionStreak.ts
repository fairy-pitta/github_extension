/**
 * ContributionStreak entity representing consecutive contribution days
 */
export class ContributionStreak {
  constructor(
    public readonly currentStreak: number,
    public readonly longestStreak: number,
    public readonly todayContributed: boolean,
    public readonly lastContributionDate: Date | null
  ) {}

  static fromPlain(plain: {
    currentStreak: number;
    longestStreak: number;
    todayContributed: boolean;
    lastContributionDate: string | Date | null;
  }): ContributionStreak {
    const lastContributionDate =
      plain.lastContributionDate === null
        ? null
        : plain.lastContributionDate instanceof Date
          ? plain.lastContributionDate
          : new Date(plain.lastContributionDate);

    return new ContributionStreak(
      plain.currentStreak,
      plain.longestStreak,
      plain.todayContributed,
      lastContributionDate
    );
  }
}



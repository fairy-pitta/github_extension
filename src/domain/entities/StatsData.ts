/**
 * StatsData entity representing weekly/monthly statistics
 */
export interface PeriodStats {
  commits: number;
  pullRequests: number;
  reviews: number;
  issues: number;
}

export class StatsData {
  constructor(
    public readonly currentWeek: PeriodStats,
    public readonly previousWeek: PeriodStats,
    public readonly currentMonth: PeriodStats,
    public readonly previousMonth: PeriodStats
  ) {}

  static fromPlain(plain: {
    currentWeek: PeriodStats;
    previousWeek: PeriodStats;
    currentMonth: PeriodStats;
    previousMonth: PeriodStats;
  }): StatsData {
    return new StatsData(
      plain.currentWeek,
      plain.previousWeek,
      plain.currentMonth,
      plain.previousMonth
    );
  }

  /**
   * Calculate percentage change between two periods
   */
  getWeekChange(metric: keyof PeriodStats): number {
    const current = this.currentWeek[metric];
    const previous = this.previousWeek[metric];
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  /**
   * Calculate percentage change between two periods
   */
  getMonthChange(metric: keyof PeriodStats): number {
    const current = this.currentMonth[metric];
    const previous = this.previousMonth[metric];
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }
}



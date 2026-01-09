import { ContributionStreak } from '@/domain/entities/ContributionStreak';
import { ContributionCalendar } from '@/domain/entities/ContributionCalendar';
import { CalculateStreak } from '@/domain/usecases/CalculateStreak';
import { ICache } from '@/infrastructure/cache/ICache';
import { CacheKeys } from '../config/CacheKeys';
import { AppConfig } from '../config/AppConfig';

/**
 * Streak service with caching
 */
export class StreakService {
  constructor(private readonly cache: ICache) {}

  /**
   * Calculate streak from contribution calendar
   */
  async calculateStreak(
    calendar: ContributionCalendar,
    forceRefresh: boolean = false
  ): Promise<ContributionStreak> {
    const cacheKey = CacheKeys.STREAK;

    // Try to get from cache first
    if (!forceRefresh) {
      const cached = await this.cache.get<ContributionStreak>(cacheKey);
      if (cached) {
        return ContributionStreak.fromPlain(cached);
      }
    }

    // Calculate streak
    const useCase = new CalculateStreak();
    const streak = useCase.execute(calendar);

    // Cache the result
    await this.cache.set(cacheKey, streak, AppConfig.cache.dashboardTTL);

    return streak;
  }

  /**
   * Clear streak cache
   */
  async clearCache(): Promise<void> {
    await this.cache.remove(CacheKeys.STREAK);
  }
}


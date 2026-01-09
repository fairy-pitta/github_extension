import { AchievementBadge } from '@/domain/entities/AchievementBadge';
import { ContributionCalendar } from '@/domain/entities/ContributionCalendar';
import { PullRequest } from '@/domain/entities/PullRequest';
import { CheckAchievements } from '@/domain/usecases/CheckAchievements';
import { ICache } from '@/domain/interfaces/ICache';
import { CacheKeys } from '../config/CacheKeys';
import { AppConfig } from '../config/AppConfig';

/**
 * Achievement service with caching
 */
export class AchievementService {
  constructor(private readonly cache: ICache) {}

  /**
   * Check achievements based on user activity
   */
  async checkAchievements(
    calendar: ContributionCalendar,
    pullRequests: PullRequest[],
    reviews: number,
    forceRefresh: boolean = false
  ): Promise<AchievementBadge[]> {
    const cacheKey = CacheKeys.ACHIEVEMENTS;

    // Try to get from cache first
    if (!forceRefresh) {
      const cached = await this.cache.get<AchievementBadge[]>(cacheKey);
      if (cached) {
        return cached.map((badge) => AchievementBadge.fromPlain(badge));
      }
    }

    // Check achievements
    const useCase = new CheckAchievements();
    const badges = useCase.execute({
      calendar,
      pullRequests,
      reviews,
    });

    // Cache the result
    await this.cache.set(cacheKey, badges, AppConfig.cache.dashboardTTL);

    return badges;
  }

  /**
   * Clear achievements cache
   */
  async clearCache(): Promise<void> {
    await this.cache.remove(CacheKeys.ACHIEVEMENTS);
  }
}



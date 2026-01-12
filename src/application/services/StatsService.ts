import { StatsData } from '@/domain/entities/StatsData';
import { IStatsRepository } from '@/domain/repositories/IStatsRepository';
import { ICache } from '@/domain/interfaces/ICache';
import { CacheKeys } from '../config/CacheKeys';
import { AppConfig } from '../config/AppConfig';

/**
 * Stats service with caching
 */
export class StatsService {
  constructor(
    private readonly statsRepository: IStatsRepository,
    private readonly cache: ICache
  ) {}

  /**
   * Get stats data with cache support
   */
  async getStatsData(forceRefresh: boolean = false): Promise<StatsData> {
    const cacheKey = CacheKeys.STATS;

    // Try to get from cache first
    if (!forceRefresh) {
      const cached = await this.cache.get<StatsData>(cacheKey);
      if (cached) {
        return StatsData.fromPlain(cached);
      }
    }

    // Fetch fresh data
    const statsData = await this.statsRepository.getStatsData();

    // Cache the result as plain object
    const plainStats = {
      currentWeek: statsData.currentWeek,
      previousWeek: statsData.previousWeek,
      currentMonth: statsData.currentMonth,
      previousMonth: statsData.previousMonth,
    };
    await this.cache.set(cacheKey, plainStats, AppConfig.cache.dashboardTTL);

    return statsData;
  }

  /**
   * Clear stats cache
   */
  async clearCache(): Promise<void> {
    await this.cache.remove(CacheKeys.STATS);
  }
}



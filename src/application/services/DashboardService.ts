import { GetDashboardData } from '@/domain/usecases/GetDashboardData';
import { DashboardData } from '@/domain/usecases/GetDashboardData';
import { IPullRequestRepository } from '@/domain/repositories/IPullRequestRepository';
import { IIssueRepository } from '@/domain/repositories/IIssueRepository';
import { IRepositoryRepository } from '@/domain/repositories/IRepositoryRepository';
import { ICache } from '@/infrastructure/cache/ICache';
import { CacheKeys } from '@/infrastructure/cache/CacheKeys';
import { AppConfig } from '../config/AppConfig';
import { NetworkError } from '@/domain/errors/DomainError';

/**
 * Dashboard service with caching
 */
export class DashboardService {
  constructor(
    private readonly prRepository: IPullRequestRepository,
    private readonly issueRepository: IIssueRepository,
    private readonly repoRepository: IRepositoryRepository,
    private readonly cache: ICache
  ) {}

  /**
   * Get dashboard data with cache support
   */
  async getDashboardData(
    limit: number = AppConfig.defaults.dashboardLimit,
    forceRefresh: boolean = false
  ): Promise<DashboardData> {
    const cacheKey = CacheKeys.DASHBOARD;

    // Try to get from cache first
    if (!forceRefresh) {
      const cached = await this.cache.get<DashboardData>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      // Fetch fresh data
      const useCase = new GetDashboardData(
        this.prRepository,
        this.issueRepository,
        this.repoRepository
      );
      const data = await useCase.execute(limit);

      // Cache the result
      await this.cache.set(cacheKey, data, AppConfig.cache.dashboardTTL);

      return data;
    } catch (error) {
      // On error, try to return cached data as fallback
      if (error instanceof NetworkError) {
        const cached = await this.cache.get<DashboardData>(cacheKey);
        if (cached) {
          return cached;
        }
      }
      throw error;
    }
  }

  /**
   * Clear dashboard cache
   */
  async clearCache(): Promise<void> {
    await this.cache.remove(CacheKeys.DASHBOARD);
  }
}


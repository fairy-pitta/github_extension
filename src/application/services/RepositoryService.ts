import { Repository } from '@/domain/entities/Repository';
import { IRepositoryRepository } from '@/domain/repositories/IRepositoryRepository';
import { ICache } from '@/infrastructure/cache/ICache';
import { CacheKeys } from '../config/CacheKeys';
import { AppConfig } from '../config/AppConfig';

/**
 * Repository service with caching
 */
export class RepositoryService {
  constructor(
    private readonly repositoryRepository: IRepositoryRepository,
    private readonly cache: ICache
  ) {}

  /**
   * Get recently updated repositories with cache support
   */
  async getRecentlyUpdated(
    limit: number = AppConfig.defaults.repositoriesLimit,
    cursor?: string,
    forceRefresh: boolean = false
  ): Promise<{ repositories: Repository[]; nextCursor?: string }> {
    const cacheKey = `${CacheKeys.REPOSITORIES}_${limit}_${cursor ?? 'first'}`;

    // Try to get from cache first
    if (!forceRefresh && !cursor) {
      const cached = await this.cache.get<{
        repositories: Repository[];
        nextCursor?: string;
      }>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Fetch fresh data
    const result = await this.repositoryRepository.getRecentlyUpdated(
      limit,
      cursor
    );

    // Cache the result (only for first page)
    if (!cursor) {
      await this.cache.set(
        cacheKey,
        result,
        AppConfig.cache.repositoriesTTL
      );
    }

    return result;
  }

  /**
   * Get repositories by organizations
   */
  async getByOrganizations(
    orgLogins: string[],
    limit: number = AppConfig.defaults.repositoriesLimit
  ): Promise<Repository[]> {
    return await this.repositoryRepository.getByOrganizations(orgLogins, limit);
  }
}



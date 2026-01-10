import { Repository } from '../entities/Repository';

/**
 * Repository interface for Repository operations
 */
export interface IRepositoryRepository {
  /**
   * Get recently updated repositories
   * @param limit Maximum number of repositories to return
   * @param cursor Pagination cursor for next page
   * @returns Repositories and optional next cursor for pagination
   */
  getRecentlyUpdated(
    limit: number,
    cursor?: string
  ): Promise<{ repositories: Repository[]; nextCursor?: string }>;

  /**
   * Get repositories by organization logins
   * @param orgLogins Array of organization login names
   * @param limit Maximum number of repositories per organization
   */
  getByOrganizations(
    orgLogins: string[],
    limit: number
  ): Promise<Repository[]>;
}




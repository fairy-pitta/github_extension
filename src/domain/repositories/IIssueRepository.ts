import { Issue } from '../entities/Issue';

/**
 * Repository interface for Issue operations
 */
export interface IIssueRepository {
  /**
   * Get issues that the current user is involved with
   * @param limit Maximum number of issues to return
   * @param cursor Optional pagination cursor
   */
  getInvolved(limit: number, cursor?: string): Promise<{ issues: Issue[]; nextCursor?: string }>;
}



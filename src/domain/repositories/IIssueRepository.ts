import { Issue } from '../entities/Issue';

/**
 * Repository interface for Issue operations
 */
export interface IIssueRepository {
  /**
   * Get issues that the current user is involved with
   */
  getInvolved(limit: number): Promise<Issue[]>;
}



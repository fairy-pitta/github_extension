import { PullRequest } from '../entities/PullRequest';

/**
 * Repository interface for PullRequest operations
 */
export interface IPullRequestRepository {
  /**
   * Get pull requests created by the current user
   */
  getCreatedByMe(limit: number): Promise<PullRequest[]>;

  /**
   * Get pull requests that need review from the current user
   */
  getReviewRequested(limit: number): Promise<PullRequest[]>;

  /**
   * Get pull requests reviewed by the current user (for future use)
   */
  getReviewedByMe(limit: number): Promise<PullRequest[]>;
}



import { PullRequest } from '../entities/PullRequest';

/**
 * Repository interface for PullRequest operations
 */
export interface IPullRequestRepository {
  /**
   * Get pull requests created by the current user
   * @param limit Maximum number of PRs to return
   * @param cursor Optional pagination cursor
   */
  getCreatedByMe(limit: number, cursor?: string): Promise<{ prs: PullRequest[]; nextCursor?: string }>;

  /**
   * Get pull requests that need review from the current user
   * @param limit Maximum number of PRs to return
   * @param cursor Optional pagination cursor
   */
  getReviewRequested(limit: number, cursor?: string): Promise<{ prs: PullRequest[]; nextCursor?: string }>;

  /**
   * Get pull requests reviewed by the current user (for future use)
   */
  getReviewedByMe(limit: number): Promise<PullRequest[]>;
}



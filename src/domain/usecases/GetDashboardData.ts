import { PullRequest } from '../entities/PullRequest';
import { Issue } from '../entities/Issue';
import { Repository } from '../entities/Repository';
import { IPullRequestRepository } from '../repositories/IPullRequestRepository';
import { IIssueRepository } from '../repositories/IIssueRepository';
import { IRepositoryRepository } from '../repositories/IRepositoryRepository';

/**
 * Dashboard data result
 */
export interface DashboardData {
  createdPRs: PullRequest[];
  reviewRequestedPRs: PullRequest[];
  involvedIssues: Issue[];
  recentlyUpdatedRepos: Repository[];
}

/**
 * Use case: Get dashboard data
 * Retrieves PRs, Issues, and Repositories for the dashboard
 */
export class GetDashboardData {
  constructor(
    private readonly prRepository: IPullRequestRepository,
    private readonly issueRepository: IIssueRepository,
    private readonly repoRepository: IRepositoryRepository
  ) {}

  async execute(limit: number = 10): Promise<DashboardData> {
    const [createdPRs, reviewRequestedPRs, involvedIssues, reposResult] =
      await Promise.all([
        this.prRepository.getCreatedByMe(limit),
        this.prRepository.getReviewRequested(limit),
        this.issueRepository.getInvolved(limit),
        this.repoRepository.getRecentlyUpdated(limit),
      ]);

    return {
      createdPRs,
      reviewRequestedPRs,
      involvedIssues,
      recentlyUpdatedRepos: reposResult.repositories,
    };
  }
}



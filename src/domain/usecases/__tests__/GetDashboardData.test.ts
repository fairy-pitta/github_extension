import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetDashboardData } from '../GetDashboardData';
import { IPullRequestRepository } from '../../repositories/IPullRequestRepository';
import { IIssueRepository } from '../../repositories/IIssueRepository';
import { IRepositoryRepository } from '../../repositories/IRepositoryRepository';
import { PullRequest } from '../../entities/PullRequest';
import { Issue } from '../../entities/Issue';
import { Repository } from '../../entities/Repository';

describe('GetDashboardData', () => {
  let mockPRRepository: IPullRequestRepository;
  let mockIssueRepository: IIssueRepository;
  let mockRepoRepository: IRepositoryRepository;
  let useCase: GetDashboardData;

  beforeEach(() => {
    mockPRRepository = {
      getCreatedByMe: vi.fn(),
      getReviewRequested: vi.fn(),
      getReviewedByMe: vi.fn(),
    };

    mockIssueRepository = {
      getInvolved: vi.fn(),
    };

    mockRepoRepository = {
      getRecentlyUpdated: vi.fn(),
      getByOrganizations: vi.fn(),
    };

    useCase = new GetDashboardData(
      mockPRRepository,
      mockIssueRepository,
      mockRepoRepository
    );
  });

  it('should retrieve dashboard data from all repositories', async () => {
    const mockPR = PullRequest.fromPlain({
      number: 1,
      title: 'Test PR',
      state: 'OPEN',
      url: 'https://github.com/test/repo/pull/1',
      updatedAt: new Date(),
      repository: {
        nameWithOwner: 'test/repo',
        url: 'https://github.com/test/repo',
        updatedAt: new Date(),
        isPrivate: false,
        owner: { login: 'test' },
      },
      author: { login: 'author' },
    });

    const mockIssue = Issue.fromPlain({
      number: 1,
      title: 'Test Issue',
      state: 'OPEN',
      url: 'https://github.com/test/repo/issues/1',
      updatedAt: new Date(),
      repository: {
        nameWithOwner: 'test/repo',
        url: 'https://github.com/test/repo',
        updatedAt: new Date(),
        isPrivate: false,
        owner: { login: 'test' },
      },
    });

    const mockRepo = Repository.fromPlain({
      nameWithOwner: 'test/repo',
      url: 'https://github.com/test/repo',
      updatedAt: new Date(),
      isPrivate: false,
      owner: { login: 'test' },
    });

    vi.mocked(mockPRRepository.getCreatedByMe).mockResolvedValue([mockPR]);
    vi.mocked(mockPRRepository.getReviewRequested).mockResolvedValue([mockPR]);
    vi.mocked(mockIssueRepository.getInvolved).mockResolvedValue([mockIssue]);
    vi.mocked(mockRepoRepository.getRecentlyUpdated).mockResolvedValue({
      repositories: [mockRepo],
    });

    const result = await useCase.execute(10);

    expect(result.createdPRs).toHaveLength(1);
    expect(result.reviewRequestedPRs).toHaveLength(1);
    expect(result.involvedIssues).toHaveLength(1);
    expect(result.recentlyUpdatedRepos).toHaveLength(1);
    expect(mockPRRepository.getCreatedByMe).toHaveBeenCalledWith(10);
    expect(mockPRRepository.getReviewRequested).toHaveBeenCalledWith(10);
    expect(mockIssueRepository.getInvolved).toHaveBeenCalledWith(10);
    expect(mockRepoRepository.getRecentlyUpdated).toHaveBeenCalledWith(10);
  });

  it('should use default limit of 10', async () => {
    vi.mocked(mockPRRepository.getCreatedByMe).mockResolvedValue([]);
    vi.mocked(mockPRRepository.getReviewRequested).mockResolvedValue([]);
    vi.mocked(mockIssueRepository.getInvolved).mockResolvedValue([]);
    vi.mocked(mockRepoRepository.getRecentlyUpdated).mockResolvedValue({
      repositories: [],
    });

    await useCase.execute();

    expect(mockPRRepository.getCreatedByMe).toHaveBeenCalledWith(10);
  });
});


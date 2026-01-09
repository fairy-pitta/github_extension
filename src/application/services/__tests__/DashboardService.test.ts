import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DashboardService } from '../DashboardService';
import { IPullRequestRepository } from '@/domain/repositories/IPullRequestRepository';
import { IIssueRepository } from '@/domain/repositories/IIssueRepository';
import { IRepositoryRepository } from '@/domain/repositories/IRepositoryRepository';
import { ICache } from '@/infrastructure/cache/ICache';
import { CacheKeys } from '../../config/CacheKeys';
import { PullRequest } from '@/domain/entities/PullRequest';
import { Issue } from '@/domain/entities/Issue';
import { Repository } from '@/domain/entities/Repository';
import { NetworkError } from '@/domain/errors/DomainError';

describe('DashboardService', () => {
  let mockPRRepository: IPullRequestRepository;
  let mockIssueRepository: IIssueRepository;
  let mockRepoRepository: IRepositoryRepository;
  let mockCache: ICache;
  let dashboardService: DashboardService;

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

    mockCache = {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
      clear: vi.fn(),
    };

    dashboardService = new DashboardService(
      mockPRRepository,
      mockIssueRepository,
      mockRepoRepository,
      mockCache
    );
  });

  it('should return cached data when available', async () => {
    const cachedData = {
      createdPRs: [],
      reviewRequestedPRs: [],
      involvedIssues: [],
      recentlyUpdatedRepos: [],
    };

    vi.mocked(mockCache.get).mockResolvedValue(cachedData);

    const result = await dashboardService.getDashboardData();

    expect(result).toEqual(cachedData);
    expect(mockCache.get).toHaveBeenCalledWith(CacheKeys.DASHBOARD);
  });

  it('should fetch fresh data when cache is empty', async () => {
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

    vi.mocked(mockCache.get).mockResolvedValue(null);
    vi.mocked(mockPRRepository.getCreatedByMe).mockResolvedValue({ prs: [mockPR] });
    vi.mocked(mockPRRepository.getReviewRequested).mockResolvedValue({ prs: [] });
    vi.mocked(mockIssueRepository.getInvolved).mockResolvedValue({ issues: [] });
    vi.mocked(mockRepoRepository.getRecentlyUpdated).mockResolvedValue({
      repositories: [],
    });

    const result = await dashboardService.getDashboardData();

    expect(result.createdPRs).toHaveLength(1);
    expect(mockCache.set).toHaveBeenCalled();
  });

  it('should return cached data on network error', async () => {
    const cachedData = {
      createdPRs: [],
      reviewRequestedPRs: [],
      involvedIssues: [],
      recentlyUpdatedRepos: [],
    };

    vi.mocked(mockCache.get).mockResolvedValueOnce(null);
    vi.mocked(mockPRRepository.getCreatedByMe).mockRejectedValue(
      new NetworkError('Network error')
    );
    vi.mocked(mockCache.get).mockResolvedValueOnce(cachedData);

    const result = await dashboardService.getDashboardData();

    expect(result).toEqual(cachedData);
  });

  it('should clear cache', async () => {
    await dashboardService.clearCache();

    expect(mockCache.remove).toHaveBeenCalledWith(CacheKeys.DASHBOARD);
  });
});



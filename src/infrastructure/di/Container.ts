import { GitHubGraphQLClient } from '@/infrastructure/api/GitHubGraphQLClient';
import { ChromeStorage } from '@/infrastructure/storage/ChromeStorage';
import { MemoryCache } from '@/infrastructure/cache/MemoryCache';
import { IStorage } from '@/infrastructure/storage/IStorage';
import { ICache } from '@/infrastructure/cache/ICache';
import { AuthRepository } from '@/infrastructure/repositories/AuthRepository';
import { PullRequestRepository } from '@/infrastructure/repositories/PullRequestRepository';
import { IssueRepository } from '@/infrastructure/repositories/IssueRepository';
import { RepositoryRepository } from '@/infrastructure/repositories/RepositoryRepository';
import { ContributionCalendarRepository } from '@/infrastructure/repositories/ContributionCalendarRepository';
import { StatsRepository } from '@/infrastructure/repositories/StatsRepository';
import { GitHubOAuthService } from '@/infrastructure/auth/GitHubOAuthService';
import { AuthService } from '@/application/services/AuthService';
import { DashboardService } from '@/application/services/DashboardService';
import { RepositoryService } from '@/application/services/RepositoryService';
import { StreakService } from '@/application/services/StreakService';
import { AchievementService } from '@/application/services/AchievementService';
import { StatsService } from '@/application/services/StatsService';
import { SettingsService } from '@/application/services/SettingsService';

/**
 * Dependency Injection Container
 */
export class Container {
  private static instance: Container;
  private token: string | null = null;

  private storage = new ChromeStorage();
  private cache = new MemoryCache(this.storage);
  private oauthService: GitHubOAuthService | null = null;

  private graphqlClient: GitHubGraphQLClient | null = null;
  private authRepository: AuthRepository | null = null;
  private prRepository: PullRequestRepository | null = null;
  private issueRepository: IssueRepository | null = null;
  private repoRepository: RepositoryRepository | null = null;
  private contributionCalendarRepository: ContributionCalendarRepository | null = null;
  private statsRepository: StatsRepository | null = null;

  private authService: AuthService | null = null;
  private dashboardService: DashboardService | null = null;
  private repositoryService: RepositoryService | null = null;
  private streakService: StreakService | null = null;
  private achievementService: AchievementService | null = null;
  private statsService: StatsService | null = null;
  private settingsService: SettingsService | null = null;

  private constructor() {}

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  /**
   * Initialize with token
   */
  async initialize(token: string): Promise<void> {
    this.token = token;
    this.graphqlClient = new GitHubGraphQLClient(token);

    // Initialize OAuth service if not already initialized
    if (!this.oauthService) {
      try {
        this.oauthService = new GitHubOAuthService();
      } catch (error) {
        // OAuth service initialization can fail if client ID is not configured
        // This is acceptable - OAuth will just not be available
        console.warn('OAuth service initialization failed:', error);
      }
    }

    // Initialize repositories
    this.authRepository = new AuthRepository(this.graphqlClient);
    this.prRepository = new PullRequestRepository(this.graphqlClient);
    this.issueRepository = new IssueRepository(this.graphqlClient);
    this.repoRepository = new RepositoryRepository(this.graphqlClient);
    this.contributionCalendarRepository = new ContributionCalendarRepository(this.graphqlClient);
    this.statsRepository = new StatsRepository(
      this.graphqlClient,
      this.contributionCalendarRepository,
      this.prRepository,
      this.issueRepository
    );

    // Initialize services
    this.authService = new AuthService(
      this.authRepository,
      this.storage,
      this.oauthService ?? undefined
    );
    this.dashboardService = new DashboardService(
      this.prRepository,
      this.issueRepository,
      this.repoRepository,
      this.cache
    );
    this.repositoryService = new RepositoryService(
      this.repoRepository,
      this.cache
    );
    this.streakService = new StreakService(this.cache);
    this.achievementService = new AchievementService(this.cache);
    this.statsService = new StatsService(this.statsRepository, this.cache);
  }

  /**
   * Get AuthService
   */
  getAuthService(): AuthService {
    if (!this.authService) {
      throw new Error('Container not initialized. Call initialize() first.');
    }
    return this.authService;
  }

  /**
   * Get DashboardService
   */
  getDashboardService(): DashboardService {
    if (!this.dashboardService) {
      throw new Error('Container not initialized. Call initialize() first.');
    }
    return this.dashboardService;
  }

  /**
   * Get RepositoryService
   */
  getRepositoryService(): RepositoryService {
    if (!this.repositoryService) {
      throw new Error('Container not initialized. Call initialize() first.');
    }
    return this.repositoryService;
  }

  /**
   * Get GraphQL client
   */
  getGraphQLClient(): GitHubGraphQLClient {
    if (!this.graphqlClient) {
      throw new Error('Container not initialized. Call initialize() first.');
    }
    return this.graphqlClient;
  }

  /**
   * Get storage
   */
  getStorage(): IStorage {
    return this.storage;
  }

  /**
   * Get cache
   */
  getCache(): ICache {
    return this.cache;
  }

  /**
   * Get ContributionCalendarRepository
   */
  getContributionCalendarRepository(): ContributionCalendarRepository {
    if (!this.contributionCalendarRepository) {
      throw new Error('Container not initialized. Call initialize() first.');
    }
    return this.contributionCalendarRepository;
  }

  /**
   * Get IssueRepository
   */
  getIssueRepository(): IssueRepository {
    if (!this.issueRepository) {
      throw new Error('Container not initialized. Call initialize() first.');
    }
    return this.issueRepository;
  }

  /**
   * Get PullRequestRepository
   */
  getPullRequestRepository(): PullRequestRepository {
    if (!this.prRepository) {
      throw new Error('Container not initialized. Call initialize() first.');
    }
    return this.prRepository;
  }

  /**
   * Get StreakService
   */
  getStreakService(): StreakService {
    if (!this.streakService) {
      throw new Error('Container not initialized. Call initialize() first.');
    }
    return this.streakService;
  }

  /**
   * Get AchievementService
   */
  getAchievementService(): AchievementService {
    if (!this.achievementService) {
      throw new Error('Container not initialized. Call initialize() first.');
    }
    return this.achievementService;
  }

  /**
   * Get StatsService
   */
  getStatsService(): StatsService {
    if (!this.statsService) {
      throw new Error('Container not initialized. Call initialize() first.');
    }
    return this.statsService;
  }

  /**
   * Get SettingsService
   */
  getSettingsService(): SettingsService {
    if (!this.settingsService) {
      // SettingsService doesn't require token initialization
      this.settingsService = new SettingsService(this.storage);
    }
    return this.settingsService;
  }
}



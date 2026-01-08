import { GitHubGraphQLClient } from '@/infrastructure/api/GitHubGraphQLClient';
import { ChromeStorage } from '@/infrastructure/storage/ChromeStorage';
import { MemoryCache } from '@/infrastructure/cache/MemoryCache';
import { AuthRepository } from '@/infrastructure/repositories/AuthRepository';
import { PullRequestRepository } from '@/infrastructure/repositories/PullRequestRepository';
import { IssueRepository } from '@/infrastructure/repositories/IssueRepository';
import { RepositoryRepository } from '@/infrastructure/repositories/RepositoryRepository';
import { AuthService } from '../services/AuthService';
import { DashboardService } from '../services/DashboardService';
import { RepositoryService } from '../services/RepositoryService';

/**
 * Dependency Injection Container
 */
export class Container {
  private static instance: Container;
  private token: string | null = null;

  private storage = new ChromeStorage();
  private cache = new MemoryCache(this.storage);

  private graphqlClient: GitHubGraphQLClient | null = null;
  private authRepository: AuthRepository | null = null;
  private prRepository: PullRequestRepository | null = null;
  private issueRepository: IssueRepository | null = null;
  private repoRepository: RepositoryRepository | null = null;

  private authService: AuthService | null = null;
  private dashboardService: DashboardService | null = null;
  private repositoryService: RepositoryService | null = null;

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

    // Initialize repositories
    this.authRepository = new AuthRepository(this.graphqlClient);
    this.prRepository = new PullRequestRepository(this.graphqlClient);
    this.issueRepository = new IssueRepository(this.graphqlClient);
    this.repoRepository = new RepositoryRepository(this.graphqlClient);

    // Initialize services
    this.authService = new AuthService(this.authRepository, this.storage);
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
  getStorage(): ChromeStorage {
    return this.storage;
  }

  /**
   * Get cache
   */
  getCache(): MemoryCache {
    return this.cache;
  }
}



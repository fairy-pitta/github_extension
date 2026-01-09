/**
 * Service Provider interface
 * Abstracts Container access from Presentation Layer
 */
export interface ServiceProvider {
  getAuthService(): import('./AuthService').AuthService;
  getDashboardService(): import('./DashboardService').DashboardService;
  getStatsService(): import('./StatsService').StatsService;
  getRepositoryService(): import('./RepositoryService').RepositoryService;
  getStreakService(): import('./StreakService').StreakService;
  getAchievementService(): import('./AchievementService').AchievementService;
  getSettingsService(): import('./SettingsService').SettingsService;
  getPullRequestRepository(): import('@/domain/repositories/IPullRequestRepository').IPullRequestRepository;
  getIssueRepository(): import('@/domain/repositories/IIssueRepository').IIssueRepository;
  getContributionCalendarRepository(): import('@/domain/repositories/IContributionCalendarRepository').IContributionCalendarRepository;
  getStorage(): import('@/domain/interfaces/IStorage').IStorage;
  initialize(token: string): Promise<void>;
}


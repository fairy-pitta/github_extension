import React, { createContext, useContext, ReactNode } from 'react';
import { ServiceProvider } from '@/application/services/ServiceProvider';
import { Container } from '@/infrastructure/di/Container';

/**
 * Service Context
 * Provides services to Presentation Layer without direct Container dependency
 */
const ServiceContext = createContext<ServiceProvider | null>(null);

/**
 * Service Provider Component
 * Wraps Container and provides it through context
 */
export function ServiceContextProvider({ children }: { children: ReactNode }) {
  const serviceProvider: ServiceProvider = {
    getAuthService: () => Container.getInstance().getAuthService(),
    getDashboardService: () => Container.getInstance().getDashboardService(),
    getStatsService: () => Container.getInstance().getStatsService(),
    getRepositoryService: () => Container.getInstance().getRepositoryService(),
    getStreakService: () => Container.getInstance().getStreakService(),
    getAchievementService: () => Container.getInstance().getAchievementService(),
    getSettingsService: () => Container.getInstance().getSettingsService(),
    getPullRequestRepository: () => Container.getInstance().getPullRequestRepository(),
    getIssueRepository: () => Container.getInstance().getIssueRepository(),
    getContributionCalendarRepository: () => Container.getInstance().getContributionCalendarRepository(),
    getStorage: () => Container.getInstance().getStorage(),
    initialize: async (token: string) => {
      await Container.getInstance().initialize(token);
    },
  };

  return <ServiceContext.Provider value={serviceProvider}>{children}</ServiceContext.Provider>;
}

/**
 * Hook to access services
 */
export function useServices(): ServiceProvider {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within ServiceContextProvider');
  }
  return context;
}


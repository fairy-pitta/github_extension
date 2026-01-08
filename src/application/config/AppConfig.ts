/**
 * Application configuration
 */
export const AppConfig = {
  /**
   * Cache TTL in milliseconds
   */
  cache: {
    dashboardTTL: 2 * 60 * 1000, // 2 minutes
    repositoriesTTL: 5 * 60 * 1000, // 5 minutes
    defaultTTL: 3 * 60 * 1000, // 3 minutes
  },

  /**
   * API endpoints
   */
  api: {
    graphqlEndpoint: 'https://api.github.com/graphql',
    restEndpoint: 'https://api.github.com',
  },

  /**
   * Default values
   */
  defaults: {
    dashboardLimit: 10,
    repositoriesLimit: 20,
  },
} as const;



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

  /**
   * OAuth configuration
   * Note: Set your GitHub OAuth App client ID here
   * Get it from: https://github.com/settings/developers
   */
  oauth: {
    clientId: process.env.VITE_GITHUB_OAUTH_CLIENT_ID || '',
    scopes: ['read:user', 'read:org', 'repo'],
    // Redirect URI will be generated dynamically using chrome.identity.getRedirectURL()
    redirectUri: '',
  },
} as const;



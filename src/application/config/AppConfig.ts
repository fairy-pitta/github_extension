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
    // Client ID is loaded from VITE_GITHUB_OAUTH_CLIENT_ID environment variable
    // Set it in .env file for development, or via environment variable for production
    // Note: In Vite, use import.meta.env instead of process.env
    clientId: import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID || '',
    // OAuth scopes
    // Note: 'repo' scope is required for private repository access, but this extension
    // only performs read-only operations (GraphQL queries and GET requests).
    // GitHub OAuth App does not provide a read-only scope for private repositories.
    scopes: ['read:user', 'read:org', 'repo'],
    // Redirect URI will be generated dynamically using chrome.identity.getRedirectURL()
    redirectUri: '',
  },
} as const;



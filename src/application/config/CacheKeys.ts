/**
 * Cache key constants
 * Moved from infrastructure layer to application layer to follow clean architecture principles
 */
export const CacheKeys = {
  DASHBOARD: 'dashboard',
  PR_CREATED: 'pr_created',
  PR_REVIEW_REQUESTED: 'pr_review_requested',
  ISSUES: 'issues',
  REPOSITORIES: 'repositories',
  USER: 'user',
  STREAK: 'streak',
  ACHIEVEMENTS: 'achievements',
  STATS: 'stats',
} as const;


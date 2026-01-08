import { ApiErrorConverter } from './errors/ApiError';
import {
  AuthenticationError,
  PermissionError,
  RateLimitError,
  NetworkError,
} from '@/domain/errors/DomainError';

export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    type?: string;
    path?: string[];
  }>;
}

export interface GraphQLVariables {
  [key: string]: unknown;
}

/**
 * GitHub GraphQL API client
 */
export class GitHubGraphQLClient {
  private readonly baseUrl = 'https://api.github.com/graphql';

  constructor(private readonly token: string) {
    if (!token || token.trim().length === 0) {
      throw new Error('GitHub token is required');
    }
  }

  /**
   * Execute a GraphQL query
   */
  async query<T>(
    query: string,
    variables?: GraphQLVariables
  ): Promise<T> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw ApiErrorConverter.fromResponse(response);
      }

      const json: GraphQLResponse<T> = await response.json();

      if (json.errors && json.errors.length > 0) {
        const errorMessage = json.errors
          .map((e) => e.message)
          .join(', ');
        throw ApiErrorConverter.convert(
          response.status,
          `GraphQL errors: ${errorMessage}`
        );
      }

      if (!json.data) {
        throw ApiErrorConverter.convert(
          response.status,
          'No data returned from GraphQL query'
        );
      }

      return json.data;
    } catch (error) {
      if (
        error instanceof AuthenticationError ||
        error instanceof PermissionError ||
        error instanceof RateLimitError ||
        error instanceof NetworkError
      ) {
        throw error;
      }
      throw ApiErrorConverter.fromError(error);
    }
  }

  /**
   * Get rate limit information from response headers
   */
  static getRateLimitInfo(response: Response): {
    remaining: number;
    resetAt: Date | null;
  } {
    const remaining = parseInt(
      response.headers.get('X-RateLimit-Remaining') || '0',
      10
    );
    const resetTimestamp = parseInt(
      response.headers.get('X-RateLimit-Reset') || '0',
      10
    );

    return {
      remaining,
      resetAt: resetTimestamp > 0 ? new Date(resetTimestamp * 1000) : null,
    };
  }
}

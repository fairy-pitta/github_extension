import { ApiErrorConverter } from './errors/ApiError';
import {
  AuthenticationError,
  PermissionError,
  RateLimitError,
  NetworkError,
} from '@/domain/errors/DomainError';

/**
 * GitHub REST API client
 */
export class GitHubRESTClient {
  private readonly baseUrl = 'https://api.github.com';

  constructor(private readonly token: string) {
    if (!token || token.trim().length === 0) {
      throw new Error('GitHub token is required');
    }
  }

  /**
   * Execute a REST API request
   */
  async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/vnd.github.v3+json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw ApiErrorConverter.fromResponse(response);
      }

      return (await response.json()) as T;
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
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

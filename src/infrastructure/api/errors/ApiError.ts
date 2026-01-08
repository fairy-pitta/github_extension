import {
  AuthenticationError,
  PermissionError,
  RateLimitError,
  NetworkError,
} from '@/domain/errors/DomainError';

/**
 * Converts GitHub API errors to domain errors
 */
export class ApiErrorConverter {
  static convert(status: number, message?: string, resetAt?: Date): Error {
    switch (status) {
      case 401:
        return new AuthenticationError(message || 'Authentication failed');
      case 403:
        return new PermissionError(message || 'Permission denied');
      case 429:
        return new RateLimitError(
          message || 'Rate limit exceeded',
          resetAt
        );
      default:
        return new NetworkError(message || 'Network error occurred');
    }
  }

  static fromResponse(response: Response): Error {
    const status = response.status;
    return this.convert(status, `HTTP ${status}: ${response.statusText}`);
  }

  static fromError(error: unknown): Error {
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        return new NetworkError('Network request failed');
      }
      return new NetworkError(error.message);
    }
    return new NetworkError('Unknown error occurred');
  }
}


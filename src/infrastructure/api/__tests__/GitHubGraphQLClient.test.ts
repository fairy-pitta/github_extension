import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GitHubGraphQLClient } from '../GitHubGraphQLClient';
import {
  AuthenticationError,
  PermissionError,
  RateLimitError,
  NetworkError,
} from '@/domain/errors/DomainError';

// Mock fetch
global.fetch = vi.fn();

describe('GitHubGraphQLClient', () => {
  let client: GitHubGraphQLClient;

  beforeEach(() => {
    client = new GitHubGraphQLClient('test-token');
    vi.clearAllMocks();
  });

  it('should execute a successful GraphQL query', async () => {
    const mockResponse = {
      data: { viewer: { login: 'testuser' } },
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await client.query<{ viewer: { login: string } }>(
      'query { viewer { login } }'
    );

    expect(result).toEqual(mockResponse.data);
    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/graphql',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    );
  });

  it('should throw AuthenticationError for 401', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    } as Response);

    await expect(
      client.query('query { viewer { login } }')
    ).rejects.toThrow(AuthenticationError);
  });

  it('should throw PermissionError for 403', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
    } as Response);

    await expect(
      client.query('query { viewer { login } }')
    ).rejects.toThrow(PermissionError);
  });

  it('should throw RateLimitError for 429', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
    } as Response);

    await expect(
      client.query('query { viewer { login } }')
    ).rejects.toThrow(RateLimitError);
  });

  it('should throw NetworkError for network failures', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    await expect(
      client.query('query { viewer { login } }')
    ).rejects.toThrow(NetworkError);
  });

  it('should throw error for GraphQL errors', async () => {
    const mockResponse = {
      errors: [{ message: 'GraphQL error' }],
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    } as Response);

    await expect(
      client.query('query { viewer { login } }')
    ).rejects.toThrow();
  });
});




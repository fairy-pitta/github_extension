import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GitHubOAuthService } from '../GitHubOAuthService';
import {
  AuthenticationError,
  NetworkError,
} from '@/domain/errors/DomainError';
import { AppConfig } from '@/application/config/AppConfig';

// Mock chrome.tabs for opening verification URL
const mockTabsCreate = vi.fn();
global.chrome = {
  tabs: {
    create: mockTabsCreate,
  },
} as any;

// Mock AppConfig
vi.mock('../../config/AppConfig', () => ({
  AppConfig: {
    oauth: {
      clientId: 'test-client-id',
      scopes: ['read:user', 'read:org', 'repo'],
      redirectUri: '',
    },
  },
}));

// Mock fetch
global.fetch = vi.fn();

describe('GitHubOAuthService', () => {
  let service: GitHubOAuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new GitHubOAuthService();
  });

  afterEach(() => {
    // Prevent spies (e.g., Date.now) from leaking to other tests
    vi.restoreAllMocks();
  });

  describe('Device flow', () => {
    it('should complete device flow successfully', async () => {
      // Device code response
      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          text: async () =>
            JSON.stringify({
              device_code: 'device-code',
              user_code: 'ABCD-EFGH',
              verification_uri: 'https://github.com/login/device',
              verification_uri_complete:
                'https://github.com/login/device?user_code=ABCD-EFGH',
              expires_in: 900,
              interval: 5,
            }),
        } as Response)
        // First poll: pending
        .mockResolvedValueOnce({
          ok: true,
          text: async () =>
            JSON.stringify({
              error: 'authorization_pending',
            }),
        } as Response)
        // Second poll: success
        .mockResolvedValueOnce({
          ok: true,
          text: async () =>
            JSON.stringify({
              access_token: 'gho_test_access_token',
              token_type: 'bearer',
            }),
        } as Response);

      const service = new GitHubOAuthService({
        openVerificationPage: true,
      });

      // Avoid timer side-effects across the suite
      vi.spyOn(service as any, 'sleep').mockResolvedValue(undefined);

      const token = await service.authenticate();

      expect(token).toBe('gho_test_access_token');
      expect(mockTabsCreate).toHaveBeenCalledWith({
        url: 'https://github.com/login/device?user_code=ABCD-EFGH',
      });
    });

    it('should throw AuthenticationError when device flow expires', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        text: async () =>
          JSON.stringify({
            device_code: 'device-code',
            user_code: 'ABCD-EFGH',
            verification_uri: 'https://github.com/login/device',
            expires_in: 1,
            interval: 1,
          }),
      } as Response);

      vi.spyOn(service as any, 'sleep').mockResolvedValue(undefined);

      // Prevent long loop: make time jump past deadline
      const now = Date.now();
      vi.spyOn(Date, 'now')
        .mockReturnValueOnce(now)
        .mockReturnValueOnce(now + 2000);

      await expect(service.authenticate()).rejects.toThrow(AuthenticationError);
    });

    it('should throw NetworkError on HTTP error', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'oops',
      } as Response);

      await expect(service.authenticate()).rejects.toThrow(NetworkError);
    });
  });

  describe('Constructor', () => {
    it('should throw error if client ID is not configured', () => {
      // Temporarily modify AppConfig for this test
      const originalClientId = AppConfig.oauth.clientId;
      (AppConfig.oauth as any).clientId = '';

      expect(() => {
        new GitHubOAuthService();
      }).toThrow('GitHub OAuth client ID is not configured');

      // Restore original value
      (AppConfig.oauth as any).clientId = originalClientId;
    });
  });
});


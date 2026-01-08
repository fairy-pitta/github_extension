import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GitHubOAuthService } from '../GitHubOAuthService';
import {
  AuthenticationError,
  NetworkError,
} from '@/domain/errors/DomainError';
import { AppConfig } from '@/application/config/AppConfig';

// Mock Chrome Identity API
const mockLaunchWebAuthFlow = vi.fn();
const mockGetRedirectURL = vi.fn(() => 'https://extension-id.chromiumapp.org/');

// Mock chrome.identity and chrome.runtime
global.chrome = {
  identity: {
    launchWebAuthFlow: mockLaunchWebAuthFlow,
    getRedirectURL: mockGetRedirectURL,
  },
  runtime: {
    lastError: undefined as chrome.runtime.LastError | undefined,
  },
} as any;

// Mock AppConfig
vi.mock('@/application/config/AppConfig', () => ({
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

// Mock crypto.getRandomValues
const originalGetRandomValues = crypto.getRandomValues.bind(crypto);
const mockGetRandomValues = vi.fn((arr: Uint8Array) => {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = Math.floor(Math.random() * 256);
  }
  return arr;
});

// Mock crypto.subtle.digest
const originalDigest = crypto.subtle.digest.bind(crypto.subtle);
const mockDigest = vi.fn(async (algorithm: string, data: ArrayBuffer) => {
  // Simple mock implementation - just return a hash-like array buffer
  const hash = new Uint8Array(32);
  for (let i = 0; i < hash.length; i++) {
    hash[i] = (data.byteLength + i) % 256;
  }
  return hash.buffer;
});

describe('GitHubOAuthService', () => {
  let service: GitHubOAuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetRedirectURL.mockReturnValue('https://extension-id.chromiumapp.org/');
    // Setup crypto mocks
    vi.spyOn(crypto, 'getRandomValues').mockImplementation(mockGetRandomValues);
    vi.spyOn(crypto.subtle, 'digest').mockImplementation(mockDigest);
    service = new GitHubOAuthService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Restore original crypto methods
    vi.spyOn(crypto, 'getRandomValues').mockImplementation(originalGetRandomValues);
    vi.spyOn(crypto.subtle, 'digest').mockImplementation(originalDigest);
  });

  describe('PKCE generation', () => {
    it('should generate a code verifier', () => {
      const verifier = (service as any).generateCodeVerifier();
      expect(verifier).toBeDefined();
      expect(typeof verifier).toBe('string');
      expect(verifier.length).toBeGreaterThanOrEqual(43);
      expect(verifier.length).toBeLessThanOrEqual(128);
      // Base64URL encoded string should not contain +, /, or =
      expect(verifier).not.toContain('+');
      expect(verifier).not.toContain('/');
      expect(verifier).not.toContain('=');
    });

    it('should generate a code challenge from verifier', async () => {
      const verifier = 'test-verifier-string-for-pkce';
      const challenge = await (service as any).generateCodeChallenge(verifier);
      expect(challenge).toBeDefined();
      expect(typeof challenge).toBe('string');
      // Base64URL encoded string should not contain +, /, or =
      expect(challenge).not.toContain('+');
      expect(challenge).not.toContain('/');
      expect(challenge).not.toContain('=');
    });

    it('should generate different code verifiers', () => {
      const verifier1 = (service as any).generateCodeVerifier();
      const verifier2 = (service as any).generateCodeVerifier();
      expect(verifier1).not.toBe(verifier2);
    });
  });

  describe('State generation', () => {
    it('should generate a state parameter', () => {
      const state = (service as any).generateState();
      expect(state).toBeDefined();
      expect(typeof state).toBe('string');
      expect(state.length).toBeGreaterThan(0);
    });

    it('should generate different states', () => {
      const state1 = (service as any).generateState();
      const state2 = (service as any).generateState();
      expect(state1).not.toBe(state2);
    });
  });

  describe('Authorization URL building', () => {
    it('should build authorization URL with PKCE parameters', async () => {
      const verifier = 'test-verifier';
      const authUrl = await (service as any).buildAuthUrl(verifier);

      expect(authUrl).toContain('https://github.com/login/oauth/authorize');
      expect(authUrl).toContain('client_id=test-client-id');
      expect(authUrl).toContain('code_challenge_method=S256');
      expect(authUrl).toContain('code_challenge=');
      expect(authUrl).toContain('state=');
      expect(authUrl).toContain('redirect_uri=');
      expect(authUrl).toContain('scope=');
    });
  });

  describe('Callback URL parsing', () => {
    it('should extract code and state from callback URL', () => {
      const callbackUrl =
        'https://extension-id.chromiumapp.org/?code=abc123&state=xyz789';
      const params = (service as any).extractParamsFromCallback(callbackUrl);

      expect(params).toEqual({
        code: 'abc123',
        state: 'xyz789',
      });
    });

    it('should throw AuthenticationError on OAuth error', () => {
      const callbackUrl =
        'https://extension-id.chromiumapp.org/?error=access_denied&error_description=User%20denied';

      expect(() => {
        (service as any).extractParamsFromCallback(callbackUrl);
      }).toThrow(AuthenticationError);
    });

    it('should return null for invalid callback URL', () => {
      const callbackUrl = 'https://extension-id.chromiumapp.org/?invalid=param';
      const params = (service as any).extractParamsFromCallback(callbackUrl);
      expect(params).toBeNull();
    });
  });

  describe('Token exchange', () => {
    it('should exchange code for access token', async () => {
      const mockTokenResponse = {
        access_token: 'gho_test_access_token',
        token_type: 'bearer',
        scope: 'read:user,read:org,repo',
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTokenResponse,
      } as Response);

      const token = await (service as any).exchangeCodeForToken(
        'test-code',
        'test-verifier'
      );

      expect(token).toBe('gho_test_access_token');
      expect(fetch).toHaveBeenCalledWith(
        'https://github.com/login/oauth/access_token',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }),
          body: JSON.stringify({
            client_id: 'test-client-id',
            code: 'test-code',
            redirect_uri: 'https://extension-id.chromiumapp.org/',
            code_verifier: 'test-verifier',
          }),
        })
      );
    });

    it('should throw AuthenticationError on token exchange error', async () => {
      const mockErrorResponse = {
        error: 'invalid_grant',
        error_description: 'The authorization code is invalid',
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockErrorResponse,
      } as Response);

      await expect(
        (service as any).exchangeCodeForToken('invalid-code', 'test-verifier')
      ).rejects.toThrow(AuthenticationError);
    });

    it('should throw NetworkError on HTTP error', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(
        (service as any).exchangeCodeForToken('test-code', 'test-verifier')
      ).rejects.toThrow(NetworkError);
    });
  });

  describe('Full authentication flow', () => {
    it('should complete OAuth flow successfully', async () => {
      const mockTokenResponse = {
        access_token: 'gho_test_access_token',
        token_type: 'bearer',
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTokenResponse,
      } as Response);

      // Mock Chrome Identity API to return callback URL
      mockLaunchWebAuthFlow.mockImplementation((options, callback) => {
        // Ensure lastError is undefined for successful flow
        if (global.chrome?.runtime) {
          global.chrome.runtime.lastError = undefined;
        }
        const callbackUrl =
          'https://extension-id.chromiumapp.org/?code=test-code&state=mock-state';
        callback(callbackUrl);
      });

      const token = await service.authenticate();

      expect(token).toBe('gho_test_access_token');
      expect(mockLaunchWebAuthFlow).toHaveBeenCalledWith(
        {
          url: expect.stringContaining('https://github.com/login/oauth/authorize'),
          interactive: true,
        },
        expect.any(Function)
      );
    });

    it('should handle user cancellation', async () => {
      mockLaunchWebAuthFlow.mockImplementation((options, callback) => {
        if (global.chrome?.runtime) {
          global.chrome.runtime.lastError = {
            message: 'OAuth2 flow canceled by user',
          } as chrome.runtime.LastError;
        }
        callback(undefined);
      });

      await expect(service.authenticate()).rejects.toThrow(AuthenticationError);
      // Reset lastError
      if (global.chrome?.runtime) {
        global.chrome.runtime.lastError = undefined;
      }
    });

    it('should handle Chrome Identity API errors', async () => {
      mockLaunchWebAuthFlow.mockImplementation((options, callback) => {
        if (global.chrome?.runtime) {
          global.chrome.runtime.lastError = {
            message: 'Network error occurred',
          } as chrome.runtime.LastError;
        }
        callback(undefined);
      });

      await expect(service.authenticate()).rejects.toThrow(NetworkError);
      // Reset lastError
      if (global.chrome?.runtime) {
        global.chrome.runtime.lastError = undefined;
      }
    });

    it('should handle missing callback URL', async () => {
      mockLaunchWebAuthFlow.mockImplementation((options, callback) => {
        // Ensure lastError is undefined for this test
        if (global.chrome?.runtime) {
          global.chrome.runtime.lastError = undefined;
        }
        callback(null);
      });

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


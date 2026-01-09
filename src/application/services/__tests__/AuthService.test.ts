import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../AuthService';
import { IAuthRepository } from '@/domain/repositories/IAuthRepository';
import { IStorage } from '@/domain/interfaces/IStorage';
import { User } from '@/domain/entities/User';
import { StorageKeys } from '../../config/StorageKeys';
import { AuthenticationError, NetworkError } from '@/domain/errors/DomainError';
import { GitHubOAuthService } from '@/infrastructure/auth/GitHubOAuthService';

describe('AuthService', () => {
  let mockAuthRepository: IAuthRepository;
  let mockStorage: IStorage;
  let mockOAuthService: GitHubOAuthService;
  let authService: AuthService;

  beforeEach(() => {
    mockAuthRepository = {
      validateToken: vi.fn(),
      getCurrentUser: vi.fn(),
    };

    mockStorage = {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
      clear: vi.fn(),
    };

    mockOAuthService = {
      authenticate: vi.fn(),
    } as unknown as GitHubOAuthService;

    authService = new AuthService(mockAuthRepository, mockStorage, mockOAuthService);
  });

  it('should save token after validation', async () => {
    const mockUser = User.fromPlain({
      login: 'testuser',
      name: 'Test User',
      avatarUrl: 'https://github.com/testuser.png',
    });

    vi.mocked(mockAuthRepository.validateToken).mockResolvedValue(mockUser);

    const result = await authService.saveToken('test-token');

    expect(result).toEqual(mockUser);
    expect(mockAuthRepository.validateToken).toHaveBeenCalledWith('test-token');
    expect(mockStorage.set).toHaveBeenCalledWith(StorageKeys.PAT_TOKEN, 'test-token');
  });

  it('should get saved OAuth token (priority over PAT)', async () => {
    vi.mocked(mockStorage.get)
      .mockResolvedValueOnce('oauth-token') // First call for GITHUB_TOKEN
      .mockResolvedValueOnce(null); // Second call for PAT_TOKEN (should not be called)

    const token = await authService.getToken();

    expect(token).toBe('oauth-token');
    expect(mockStorage.get).toHaveBeenCalledWith(StorageKeys.GITHUB_TOKEN);
    expect(mockStorage.get).not.toHaveBeenCalledWith(StorageKeys.PAT_TOKEN);
  });

  it('should fallback to PAT token when OAuth token is not available', async () => {
    vi.mocked(mockStorage.get)
      .mockResolvedValueOnce(null) // First call for GITHUB_TOKEN
      .mockResolvedValueOnce('pat-token'); // Second call for PAT_TOKEN

    const token = await authService.getToken();

    expect(token).toBe('pat-token');
    expect(mockStorage.get).toHaveBeenCalledWith(StorageKeys.GITHUB_TOKEN);
    expect(mockStorage.get).toHaveBeenCalledWith(StorageKeys.PAT_TOKEN);
  });

  it('should return null when no token is saved', async () => {
    vi.mocked(mockStorage.get).mockResolvedValue(null);

    const token = await authService.getToken();

    expect(token).toBeNull();
  });

  it('should remove both OAuth and PAT tokens', async () => {
    await authService.removeToken();

    expect(mockStorage.remove).toHaveBeenCalledWith(StorageKeys.GITHUB_TOKEN);
    expect(mockStorage.remove).toHaveBeenCalledWith(StorageKeys.PAT_TOKEN);
  });

  it('should validate current token', async () => {
    const mockUser = User.fromPlain({
      login: 'testuser',
    });

    vi.mocked(mockStorage.get).mockResolvedValue('test-token');
    vi.mocked(mockAuthRepository.validateToken).mockResolvedValue(mockUser);

    const user = await authService.validateCurrentToken();

    expect(user).toEqual(mockUser);
  });

  it('should return null when no token exists', async () => {
    vi.mocked(mockStorage.get).mockResolvedValue(null);

    const user = await authService.validateCurrentToken();

    expect(user).toBeNull();
  });

  it('should return null when token validation fails', async () => {
    vi.mocked(mockStorage.get).mockResolvedValue('invalid-token');
    vi.mocked(mockAuthRepository.validateToken).mockRejectedValue(
      new AuthenticationError('Invalid token')
    );

    const user = await authService.validateCurrentToken();

    expect(user).toBeNull();
  });

  describe('OAuth authentication', () => {
    it('should authenticate using OAuth and save token', async () => {
      const mockUser = User.fromPlain({
        login: 'testuser',
        name: 'Test User',
        avatarUrl: 'https://github.com/testuser.png',
      });

      const mockAccessToken = 'gho_oauth_access_token';

      vi.mocked(mockOAuthService.authenticate).mockResolvedValue(mockAccessToken);
      vi.mocked(mockAuthRepository.validateToken).mockResolvedValue(mockUser);

      const result = await authService.authenticateWithOAuth();

      expect(result).toEqual(mockUser);
      expect(mockOAuthService.authenticate).toHaveBeenCalled();
      expect(mockAuthRepository.validateToken).toHaveBeenCalledWith(mockAccessToken);
      expect(mockStorage.set).toHaveBeenCalledWith(
        StorageKeys.GITHUB_TOKEN,
        mockAccessToken
      );
    });

    it('should throw error if OAuth service is not available', async () => {
      const serviceWithoutOAuth = new AuthService(
        mockAuthRepository,
        mockStorage
      );

      await expect(serviceWithoutOAuth.authenticateWithOAuth()).rejects.toThrow(
        'OAuth service is not available'
      );
    });

    it('should re-throw AuthenticationError from OAuth service', async () => {
      const authError = new AuthenticationError('OAuth authentication failed');
      vi.mocked(mockOAuthService.authenticate).mockRejectedValue(authError);

      await expect(authService.authenticateWithOAuth()).rejects.toThrow(
        AuthenticationError
      );
    });

    it('should re-throw NetworkError from OAuth service', async () => {
      const networkError = new NetworkError('Network request failed');
      vi.mocked(mockOAuthService.authenticate).mockRejectedValue(networkError);

      await expect(authService.authenticateWithOAuth()).rejects.toThrow(
        NetworkError
      );
    });

    it('should wrap other errors', async () => {
      const genericError = new Error('Generic error');
      vi.mocked(mockOAuthService.authenticate).mockRejectedValue(genericError);

      await expect(authService.authenticateWithOAuth()).rejects.toThrow(
        'OAuth authentication failed'
      );
    });
  });
});



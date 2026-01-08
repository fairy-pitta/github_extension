import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../AuthService';
import { IAuthRepository } from '@/domain/repositories/IAuthRepository';
import { IStorage } from '@/infrastructure/storage/IStorage';
import { User } from '@/domain/entities/User';
import { StorageKeys } from '@/infrastructure/storage/StorageKeys';
import { AuthenticationError } from '@/domain/errors/DomainError';

describe('AuthService', () => {
  let mockAuthRepository: IAuthRepository;
  let mockStorage: IStorage;
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

    authService = new AuthService(mockAuthRepository, mockStorage);
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

  it('should get saved token', async () => {
    vi.mocked(mockStorage.get).mockResolvedValue('saved-token');

    const token = await authService.getToken();

    expect(token).toBe('saved-token');
    expect(mockStorage.get).toHaveBeenCalledWith(StorageKeys.PAT_TOKEN);
  });

  it('should return null when no token is saved', async () => {
    vi.mocked(mockStorage.get).mockResolvedValue(null);

    const token = await authService.getToken();

    expect(token).toBeNull();
  });

  it('should remove token', async () => {
    await authService.removeToken();

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
});



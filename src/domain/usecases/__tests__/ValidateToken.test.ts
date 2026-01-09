import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ValidateToken } from '../ValidateToken';
import { IAuthRepository } from '../../repositories/IAuthRepository';
import { User } from '../../entities/User';
import { AuthenticationError } from '../../errors/DomainError';

describe('ValidateToken', () => {
  let mockAuthRepository: IAuthRepository;
  let useCase: ValidateToken;

  beforeEach(() => {
    mockAuthRepository = {
      validateToken: vi.fn(),
      getCurrentUser: vi.fn(),
    };

    useCase = new ValidateToken(mockAuthRepository);
  });

  it('should validate token successfully', async () => {
    const mockUser = User.fromPlain({
      login: 'testuser',
      name: 'Test User',
      avatarUrl: 'https://github.com/testuser.png',
    });

    vi.mocked(mockAuthRepository.validateToken).mockResolvedValue(mockUser);

    const result = await useCase.execute('valid-token');

    expect(result).toEqual(mockUser);
    expect(mockAuthRepository.validateToken).toHaveBeenCalledWith('valid-token');
  });

  it('should throw AuthenticationError for empty token', async () => {
    await expect(useCase.execute('')).rejects.toThrow(AuthenticationError);
    await expect(useCase.execute('   ')).rejects.toThrow(AuthenticationError);
  });

  it('should throw AuthenticationError when repository throws AuthenticationError', async () => {
    vi.mocked(mockAuthRepository.validateToken).mockRejectedValue(
      new AuthenticationError('Invalid token')
    );

    await expect(useCase.execute('invalid-token')).rejects.toThrow(
      AuthenticationError
    );
  });

  it('should wrap other errors as AuthenticationError', async () => {
    vi.mocked(mockAuthRepository.validateToken).mockRejectedValue(
      new Error('Network error')
    );

    await expect(useCase.execute('token')).rejects.toThrow(AuthenticationError);
  });
});




import { User } from '../entities/User';
import { IAuthRepository } from '../repositories/IAuthRepository';
import { AuthenticationError } from '../errors/DomainError';

/**
 * Use case: Validate Personal Access Token
 */
export class ValidateToken {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(token: string): Promise<User> {
    if (!token || token.trim().length === 0) {
      throw new AuthenticationError('Token is required');
    }

    try {
      return await this.authRepository.validateToken(token);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new AuthenticationError('Failed to validate token');
    }
  }
}



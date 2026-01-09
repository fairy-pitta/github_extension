import { User } from '@/domain/entities/User';
import { ValidateToken } from '@/domain/usecases/ValidateToken';
import { IAuthRepository } from '@/domain/repositories/IAuthRepository';
import { IStorage } from '@/infrastructure/storage/IStorage';
import { StorageKeys } from '../config/StorageKeys';
import { IOAuthService } from './IOAuthService';
import {
  AuthenticationError,
  NetworkError,
} from '@/domain/errors/DomainError';

/**
 * Authentication service
 */
export class AuthService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly storage: IStorage,
    private readonly oauthService?: IOAuthService
  ) {}

  /**
   * Validate and save PAT
   */
  async saveToken(token: string): Promise<User> {
    const validateTokenUseCase = new ValidateToken(this.authRepository);
    const user = await validateTokenUseCase.execute(token);

    await this.storage.set(StorageKeys.PAT_TOKEN, token);
    return user;
  }

  /**
   * Get saved token (OAuth token takes priority over PAT)
   */
  async getToken(): Promise<string | null> {
    // Check for OAuth token first
    const oauthToken = await this.storage.get<string>(StorageKeys.GITHUB_TOKEN);
    if (oauthToken) {
      return oauthToken;
    }
    // Fallback to PAT for backward compatibility
    return await this.storage.get<string>(StorageKeys.PAT_TOKEN);
  }

  /**
   * Remove saved token (both OAuth and PAT)
   */
  async removeToken(): Promise<void> {
    await this.storage.remove(StorageKeys.GITHUB_TOKEN);
    await this.storage.remove(StorageKeys.PAT_TOKEN);
  }

  /**
   * Authenticate using OAuth with PKCE
   * Returns user information on success
   */
  async authenticateWithOAuth(): Promise<User> {
    if (!this.oauthService) {
      throw new Error('OAuth service is not available');
    }

    try {
      // Authenticate using OAuth service
      const accessToken = await this.oauthService.authenticate();

      // Validate and save token
      const validateTokenUseCase = new ValidateToken(this.authRepository);
      const user = await validateTokenUseCase.execute(accessToken);

      // Save OAuth token
      await this.storage.set(StorageKeys.GITHUB_TOKEN, accessToken);

      return user;
    } catch (error) {
      // Re-throw domain errors as-is
      if (error instanceof AuthenticationError || error instanceof NetworkError) {
        throw error;
      }
      // Wrap other errors
      throw new Error(`OAuth authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if token is valid
   */
  async validateCurrentToken(): Promise<User | null> {
    const token = await this.getToken();
    if (!token) {
      return null;
    }

    try {
      const validateTokenUseCase = new ValidateToken(this.authRepository);
      return await validateTokenUseCase.execute(token);
    } catch {
      return null;
    }
  }
}



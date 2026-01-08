import { User } from '@/domain/entities/User';
import { ValidateToken } from '@/domain/usecases/ValidateToken';
import { IAuthRepository } from '@/domain/repositories/IAuthRepository';
import { IStorage } from '@/infrastructure/storage/IStorage';
import { StorageKeys } from '@/infrastructure/storage/StorageKeys';

/**
 * Authentication service
 */
export class AuthService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly storage: IStorage
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
   * Get saved PAT
   */
  async getToken(): Promise<string | null> {
    return await this.storage.get<string>(StorageKeys.PAT_TOKEN);
  }

  /**
   * Remove saved PAT
   */
  async removeToken(): Promise<void> {
    await this.storage.remove(StorageKeys.PAT_TOKEN);
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


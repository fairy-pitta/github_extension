import { User } from '../entities/User';

/**
 * Repository interface for Authentication operations
 */
export interface IAuthRepository {
  /**
   * Validate a Personal Access Token
   * @param token GitHub PAT
   * @returns User information if token is valid
   * @throws AuthenticationError if token is invalid
   */
  validateToken(token: string): Promise<User>;

  /**
   * Get current authenticated user
   * @returns Current user information
   * @throws AuthenticationError if not authenticated
   */
  getCurrentUser(): Promise<User>;
}



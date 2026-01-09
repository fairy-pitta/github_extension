/**
 * OAuth service interface
 * Defined in application layer to follow dependency inversion principle
 */
export interface IOAuthService {
  /**
   * Authenticate using OAuth flow
   * Returns access token on success
   * @throws AuthenticationError if authentication fails
   * @throws NetworkError if network request fails
   */
  authenticate(): Promise<string>;
}


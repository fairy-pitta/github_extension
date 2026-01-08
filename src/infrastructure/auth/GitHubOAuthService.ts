import { AuthenticationError, NetworkError } from '@/domain/errors/DomainError';
import { AppConfig } from '@/application/config/AppConfig';

interface TokenResponse {
  access_token: string;
  token_type: string;
  scope?: string;
  error?: string;
  error_description?: string;
}

interface OAuthState {
  codeVerifier: string;
  state: string;
}

/**
 * GitHub OAuth Service with PKCE support
 * Implements OAuth 2.0 Authorization Code Flow with PKCE for Chrome extensions
 */
export class GitHubOAuthService {
  private readonly clientId: string;
  private readonly scopes: string[];
  private readonly redirectUri: string;
  private readonly authUrl = 'https://github.com/login/oauth/authorize';
  private readonly tokenUrl = 'https://github.com/login/oauth/access_token';

  constructor() {
    this.clientId = AppConfig.oauth.clientId;
    this.scopes = AppConfig.oauth.scopes;
    this.redirectUri = this.getRedirectUri();

    if (!this.clientId) {
      throw new Error('GitHub OAuth client ID is not configured');
    }
  }

  /**
   * Get redirect URI using Chrome Identity API
   */
  private getRedirectUri(): string {
    if (!chrome.identity) {
      throw new Error('Chrome Identity API is not available');
    }
    return chrome.identity.getRedirectURL();
  }

  /**
   * Generate a random code verifier for PKCE
   * Code verifier must be 43-128 characters long
   */
  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return this.base64UrlEncode(array);
  }

  /**
   * Generate code challenge from code verifier using SHA-256
   */
  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return this.base64UrlEncode(new Uint8Array(digest));
  }

  /**
   * Base64 URL-safe encoding (RFC 4648 Section 5)
   */
  private base64UrlEncode(buffer: Uint8Array): string {
    const base64 = btoa(String.fromCharCode(...buffer));
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Generate a random state parameter for CSRF protection
   */
  private generateState(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return this.base64UrlEncode(array);
  }

  /**
   * Build authorization URL with PKCE parameters
   */
  private async buildAuthUrl(codeVerifier: string): Promise<string> {
    const state = this.generateState();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scopes.join(' '),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    return `${this.authUrl}?${params.toString()}`;
  }

  /**
   * Extract authorization code and state from callback URL
   */
  private extractParamsFromCallback(callbackUrl: string): {
    code: string;
    state: string;
  } | null {
    try {
      const url = new URL(callbackUrl);
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const error = url.searchParams.get('error');

      if (error) {
        throw new AuthenticationError(
          `OAuth error: ${error} - ${url.searchParams.get('error_description') || ''}`
        );
      }

      if (!code || !state) {
        return null;
      }

      return { code, state };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new NetworkError('Failed to parse callback URL');
    }
  }

  /**
   * Exchange authorization code for access token using PKCE
   */
  private async exchangeCodeForToken(
    code: string,
    codeVerifier: string
  ): Promise<string> {
    try {
      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: this.clientId,
          code,
          redirect_uri: this.redirectUri,
          code_verifier: codeVerifier,
        }),
      });

      if (!response.ok) {
        throw new NetworkError(
          `Token exchange failed: HTTP ${response.status}`
        );
      }

      const data = (await response.json()) as TokenResponse;

      if (data.error) {
        throw new AuthenticationError(
          data.error_description || data.error || 'Token exchange failed'
        );
      }

      if (!data.access_token) {
        throw new AuthenticationError('No access token in response');
      }

      return data.access_token;
    } catch (error) {
      if (
        error instanceof AuthenticationError ||
        error instanceof NetworkError
      ) {
        throw error;
      }
      throw new NetworkError('Failed to exchange code for token');
    }
  }

  /**
   * Authenticate using OAuth with PKCE
   * Returns access token on success
   */
  async authenticate(): Promise<string> {
    return new Promise((resolve, reject) => {
      // Generate code verifier for PKCE
      const codeVerifier = this.generateCodeVerifier();
      let savedState: string | null = null;

      // Build authorization URL
      this.buildAuthUrl(codeVerifier)
        .then((authUrl) => {
          // Launch OAuth flow using Chrome Identity API
          chrome.identity.launchWebAuthFlow(
            {
              url: authUrl,
              interactive: true,
            },
            async (callbackUrl) => {
              try {
                // Handle errors from Chrome Identity API
                if (chrome.runtime.lastError) {
                  const error = chrome.runtime.lastError.message;
                  if (error?.includes('canceled') || error?.includes('User cancelled')) {
                    reject(new AuthenticationError('OAuth authentication was canceled'));
                  } else {
                    reject(
                      new NetworkError(`OAuth flow error: ${error || 'Unknown error'}`)
                    );
                  }
                  return;
                }

                if (!callbackUrl) {
                  reject(new NetworkError('No callback URL received'));
                  return;
                }

                // Extract code and state from callback URL
                const params = this.extractParamsFromCallback(callbackUrl);
                if (!params) {
                  reject(new AuthenticationError('Invalid callback URL: missing code or state'));
                  return;
                }

                // Exchange code for access token
                const accessToken = await this.exchangeCodeForToken(
                  params.code,
                  codeVerifier
                );

                resolve(accessToken);
              } catch (error) {
                reject(error);
              }
            }
          );
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}


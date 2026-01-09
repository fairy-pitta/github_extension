import { AuthenticationError, NetworkError } from '@/domain/errors/DomainError';
import { AppConfig } from '../config/AppConfig';
import { IOAuthService } from '@/application/services/IOAuthService';

interface TokenResponse {
  access_token?: string;
  token_type?: string;
  scope?: string;
  error?: string;
  error_description?: string;
}

interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  verification_uri_complete?: string;
  expires_in: number;
  interval?: number;
}

export interface DeviceCodeInfo {
  userCode: string;
  verificationUri: string;
  verificationUriComplete?: string;
  expiresInSeconds: number;
  intervalSeconds: number;
}

export interface GitHubOAuthServiceOptions {
  /**
   * Called when the device code is issued so the UI can show the user_code and URL.
   */
  onDeviceCode?: (info: DeviceCodeInfo) => void;
  /**
   * Automatically open GitHub verification URL in a new tab.
   */
  openVerificationPage?: boolean;
}

/**
 * GitHub OAuth Service for Chrome extensions.
 *
 * GitHub OAuth Apps require a client_secret for the authorization-code exchange,
 * so a pure client-side "PKCE-only" flow is not reliable. Instead, this service
 * uses the OAuth 2.0 Device Authorization Grant (Device Flow), which works
 * without a client_secret.
 */
export class GitHubOAuthService implements IOAuthService {
  private readonly clientId: string;
  private readonly scopes: string[];
  private readonly deviceCodeUrl = 'https://github.com/login/device/code';
  private readonly tokenUrl = 'https://github.com/login/oauth/access_token';
  private readonly openVerificationPage: boolean;
  private readonly onDeviceCode?: (info: DeviceCodeInfo) => void;

  constructor(options?: GitHubOAuthServiceOptions) {
    this.clientId = AppConfig.oauth.clientId;
    this.scopes = AppConfig.oauth.scopes;

    if (!this.clientId) {
      throw new Error('GitHub OAuth client ID is not configured');
    }

    this.openVerificationPage = options?.openVerificationPage ?? true;
    this.onDeviceCode = options?.onDeviceCode;
  }

  private async postForm(url: string, params: Record<string, string>): Promise<string> {
    const body = new URLSearchParams(params).toString();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body,
    });

    if (!response.ok) {
      throw new NetworkError(`Request failed: HTTP ${response.status}`);
    }

    return await response.text();
  }

  private async requestDeviceCode(): Promise<DeviceCodeInfo & { deviceCode: string }> {
    const responseText = await this.postForm(this.deviceCodeUrl, {
      client_id: this.clientId,
      scope: this.scopes.join(' '),
    });

    const data = JSON.parse(responseText) as DeviceCodeResponse & TokenResponse;

    if ((data as TokenResponse).error) {
      throw new AuthenticationError(
        (data as TokenResponse).error_description ||
          (data as TokenResponse).error ||
          'Failed to start device flow'
      );
    }

    if (!data.device_code || !data.user_code || !data.verification_uri || !data.expires_in) {
      throw new NetworkError('Invalid device code response from GitHub');
    }

    const intervalSeconds = data.interval ?? 5;

    return {
      deviceCode: data.device_code,
      userCode: data.user_code,
      verificationUri: data.verification_uri,
      verificationUriComplete: data.verification_uri_complete,
      expiresInSeconds: data.expires_in,
      intervalSeconds,
    };
  }

  private async openUrl(url: string): Promise<void> {
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs?.create) {
        chrome.tabs.create({ url });
        return;
      }
    } catch {
      // ignore and fallback
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  private async sleep(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async pollForAccessToken(deviceCode: string, intervalSeconds: number, expiresInSeconds: number): Promise<string> {
    const deadline = Date.now() + expiresInSeconds * 1000;
    let intervalMs = Math.max(1, intervalSeconds) * 1000;

    while (Date.now() < deadline) {
      const responseText = await this.postForm(this.tokenUrl, {
        client_id: this.clientId,
        device_code: deviceCode,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
      });

      const data = JSON.parse(responseText) as TokenResponse;

      if (data.access_token) {
        return data.access_token;
      }

      // OAuth device flow errors
      switch (data.error) {
        case 'authorization_pending':
          // user hasn't completed authorization yet
          break;
        case 'slow_down':
          intervalMs += 5000;
          break;
        case 'expired_token':
          throw new AuthenticationError('OAuth device flow expired. Please try again.');
        case 'access_denied':
          throw new AuthenticationError('OAuth authentication was canceled');
        default:
          if (data.error) {
            throw new AuthenticationError(
              data.error_description || data.error || 'OAuth token polling failed'
            );
          }
      }

      await this.sleep(intervalMs);
    }

    throw new AuthenticationError('OAuth device flow expired. Please try again.');
  }

  /**
   * Authenticate using GitHub OAuth Device Flow (no client_secret).
   * Returns access token on success.
   */
  async authenticate(): Promise<string> {
    const device = await this.requestDeviceCode();

    const info: DeviceCodeInfo = {
      userCode: device.userCode,
      verificationUri: device.verificationUri,
      verificationUriComplete: device.verificationUriComplete,
      expiresInSeconds: device.expiresInSeconds,
      intervalSeconds: device.intervalSeconds,
    };

    this.onDeviceCode?.(info);

    if (this.openVerificationPage) {
      await this.openUrl(device.verificationUriComplete || device.verificationUri);
    }

    return await this.pollForAccessToken(
      device.deviceCode,
      device.intervalSeconds,
      device.expiresInSeconds
    );
  }
}


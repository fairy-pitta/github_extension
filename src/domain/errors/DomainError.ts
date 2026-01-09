/**
 * Base domain error class
 */
export abstract class DomainError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Authentication error (401)
 */
export class AuthenticationError extends DomainError {
  constructor(message = 'Authentication failed') {
    super(message, 'AUTHENTICATION_ERROR');
  }
}

/**
 * Permission error (403)
 */
export class PermissionError extends DomainError {
  constructor(message = 'Permission denied') {
    super(message, 'PERMISSION_ERROR');
  }
}

/**
 * Rate limit error (429)
 */
export class RateLimitError extends DomainError {
  constructor(
    message = 'Rate limit exceeded',
    public readonly resetAt?: Date
  ) {
    super(message, 'RATE_LIMIT_ERROR');
  }
}

/**
 * Network error
 */
export class NetworkError extends DomainError {
  constructor(message = 'Network error occurred') {
    super(message, 'NETWORK_ERROR');
  }
}




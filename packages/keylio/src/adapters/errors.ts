export interface AuthErrorOptions {
  message?: string;
  code?: string; // e.g., "INVALID_CREDENTIALS", "USER_NOT_FOUND"
  metadata?: Record<string, any>;
}

export class AuthError extends Error {
  public code?: string;
  public metadata?: Record<string, any>;

  constructor(options: AuthErrorOptions = {}) {
    super(options.message || "Authentication error");
    this.name = "AuthError";
    this.code = options.code;
    this.metadata = options.metadata;

    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

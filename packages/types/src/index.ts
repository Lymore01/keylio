export type Where = {
  field: string;
  operator?:
    | "eq"
    | "ne"
    | "lt"
    | "lte"
    | "gt"
    | "gte"
    | "in"
    | "not_in"
    | "contains";
  value: unknown;
  connector?: "AND" | "OR";
};

export type QueryOptions = {
  limit?: number;
  offset?: number;
  sortBy?: { field: string; direction: "asc" | "desc" };
};

export type AdapterFactoryOptions = {
  provider?:
    | "sqlite"
    | "cockroachdb"
    | "mysql"
    | "postgresql"
    | "sqlserver"
    | "mongodb";

  usePlural: boolean | undefined;
  transactions?: boolean | undefined;
  debugLogs?: boolean;
};

export interface DBAdapter {
  create<T>(model: string, data: T, select?: string[]): Promise<T>;
  findOne<T>(
    model: string,
    where: Where[],
    select?: string[]
  ): Promise<T | null>;
  findMany<T>(
    model: string,
    where?: Where[],
    options?: QueryOptions
  ): Promise<T[]>;
  update<T>(
    model: string,
    where: Where[],
    update: Partial<T>
  ): Promise<T | null>;
  updateMany<T>(
    model: string,
    where: Where[],
    update: Partial<T>
  ): Promise<number>;
  delete(model: string, where: Where[]): Promise<void>;
  deleteMany(model: string, where: Where[]): Promise<number>;
  count(model: string, where?: Where[]): Promise<number>;
  transaction?<R>(callback: (trx: DBAdapter) => Promise<R>): Promise<R>;
  options?: AdapterFactoryOptions;
}

export type AuthProvider = "google" | "github" | "facebook" | "linkedin";

export type AuthOptions = "credentials" | "oAuth" | "phoneOTP";

export type AuthDataMap = {
  credentials: { email: string; password: string };
  oAuth: { provider: "google" | "github" | "facebook"; token: string };
  phoneOTP: { phoneNumber: string; otp: string };
};

export type DbOptions = {
  type: "postgres" | "mongodb" | "sqlite";
  url: string;
};

export type SignInInput<T extends AuthOptions> = {
  type: T;
  data: AuthDataMap[T];
};

export interface EmailPasswordOptions {
  enabled: boolean;
  requireEmailVerification?: boolean;
  passwordPolicy?: {
    minLength?: number;
    requireNumbers?: boolean;
    requireSymbols?: boolean;
  };
}

export interface OAuthProviderConfig {
  provider: AuthProvider;
  clientId: string;
  clientSecret: string;
}

export interface PhoneOtpOptions {
  enabled: boolean;
  smsProvider?: "twilio" | "nexmo" | string;
}

export type SessionStrategy = "jwt" | "database";

export type Cookie = {
  set: (
    key: string,
    value: string,
    options: {
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: "strict" | "lax" | "none" | false;
      expires?: number;
      path?: string;
      maxAge?: number;
    }
  ) => void;
  get: (key: string) =>
    | {
        name: string;
        value: string;
      }
    | undefined;
  delete: (key: string) => void;
};

export interface CookieOptions {
  name?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  path?: string;
  maxAge?: number;
}

export interface SessionOptions {
  /**
   * Session strategy to use.
   * - "jwt": stateless, signed tokens
   * - "database": persisted sessions
   */
  strategy?: SessionStrategy;

  /**
   * Secret used to sign JWTs.
   * @remarks Required when using "jwt".
   */
  secret: string;
  /**
   * Max age of the session in seconds.
   * Default: 86400 (1 day).
   */

  maxAge?: number;
  refreshToken?: boolean;
  cookie?: CookieOptions;
}

export type RolePermissions = Record<string, string[]>;

export interface Callbacks {
  onSignup?: (user: any) => Promise<void> | void;
  onLogin?: (user: any) => Promise<void> | void;
  jwt?: (token: any, user?: any) => Promise<any> | any;
}

export interface AuthConfig {
  credentials?: EmailPasswordOptions;
  oauth?: OAuthProviderConfig[];
  phoneOtp?: PhoneOtpOptions;
}

export interface OptionalFeatures {
  multiFactorAuth?: boolean;
  apiKeys?: boolean;
  loginAnalytics?: boolean;
  customEmailTemplates?: boolean;
}

export interface KeylioConfig {
  database?: DbOptions;
  adapter?: DBAdapter;
  auth?: AuthConfig;
  session?: SessionOptions;
  roles?: RolePermissions;
  callbacks?: Callbacks;
  features?: OptionalFeatures;
}

/**
 * Minimal configuration required to initialize Keylio.
 *
 * @remarks
 * - `session.secret` is required.
 * - Other fields are optional and will fall back to defaults.
 */

export type KeylioAuthConfig = Partial<KeylioConfig> & {
  session: { secret: string };
  adapter: DBAdapter;
};

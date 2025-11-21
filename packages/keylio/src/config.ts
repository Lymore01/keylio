import { DBAdapter } from "@keylio/core/adapters";

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
  strategy?: SessionStrategy;
  secret: string;
  maxAge?: number; // in seconds
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

export type KeylioAuthConfig = Partial<KeylioConfig> & {
  session: { secret: string };
  adapter: DBAdapter;
};

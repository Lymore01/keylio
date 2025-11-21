import { SESSION_KEY } from "@keylio/shared/constants";
import { CookieOptions, SessionOptions, EmailPasswordOptions, PhoneOtpOptions, OptionalFeatures } from "../config";

export const defaultCookieConfig: CookieOptions = {
  name: SESSION_KEY,
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24,
};

export const defaultSessionConfig: SessionOptions = {
  strategy: "jwt",
  secret: process.env.AUTH_SECRET || "super_super_secret",
  maxAge: 60 * 60 * 24,
  refreshToken: false,
  cookie: defaultCookieConfig,
};

export const defaultCredentialsConfig: EmailPasswordOptions = {
  enabled: true,
  requireEmailVerification: false,
  passwordPolicy: {
    minLength: 8,
    requireNumbers: true,
    requireSymbols: false,
  },
};

export const defaultPhoneOtpConfig: PhoneOtpOptions = {
  enabled: false,
  smsProvider: "twilio",
};

export const defaultFeatures: OptionalFeatures = {
  multiFactorAuth: false,
  apiKeys: false,
  loginAnalytics: false,
  customEmailTemplates: false,
};

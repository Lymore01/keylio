import type { KeylioConfig, SessionOptions } from "@keylio/types";
import {
  defaultCookieConfig,
  defaultCredentialsConfig,
  defaultFeatures,
  defaultPhoneOtpConfig,
  defaultSessionConfig,
} from "./defaults";

/**
 * Creates a complete Keylio configuration by merging user-provided options
 * with secure defaults.
 *
 * @param config - Partial configuration with at least `session.secret`.
 * @returns A fully normalized KeylioConfig object.
 *
 * @example
 * ```ts
 * const config = createKeylioConfig({
 *   session: { secret: "super-secret" },
 *   auth: { oauth: [{ provider: "google", clientId: "xxx", clientSecret: "yyy" }] }
 * });
 * ```
 */

export function createKeylioConfig(
  config: Omit<KeylioConfig, "session"> & {
    session: Pick<SessionOptions, "secret"> & Partial<SessionOptions>;
  }
): KeylioConfig {
  return {
    database: config.database,
    adapter: config.adapter,
    session: {
      ...defaultSessionConfig,
      ...config.session,
      cookie: {
        ...defaultCookieConfig,
        ...config.session.cookie,
      },
    },
    auth: {
      credentials: {
        ...defaultCredentialsConfig,
        ...config.auth?.credentials,
      },
      oauth: config.auth?.oauth || [],
      phoneOtp: {
        ...defaultPhoneOtpConfig,
        ...config.auth?.phoneOtp,
      },
    },
    roles: config.roles || {},
    callbacks: config.callbacks || {},
    features: {
      ...defaultFeatures,
      ...config.features,
    },
  };
}

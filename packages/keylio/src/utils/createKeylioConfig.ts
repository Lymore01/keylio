import { KeylioConfig, SessionOptions } from "../config";
import {
  defaultSessionConfig,
  defaultCredentialsConfig,
  defaultPhoneOtpConfig,
  defaultFeatures,
  defaultCookieConfig,
} from "./defaults";

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

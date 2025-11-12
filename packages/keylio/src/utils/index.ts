import { defaultCookieConfig } from "@keylio/shared/config";
import { CookieOptions } from "../config";

export function getFinalCookieConfig(
  userCookie?: CookieOptions
): CookieOptions {
  return { ...defaultCookieConfig, ...userCookie };
}

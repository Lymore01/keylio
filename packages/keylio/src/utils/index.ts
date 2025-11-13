import { defaultCookieConfig } from "@keylio/shared/config";
import { CookieOptions } from "../config";

export function getFinalCookieConfig(
  userCookie?: Partial<CookieOptions>
): CookieOptions {
  return {
    ...defaultCookieConfig,
    ...Object.fromEntries(
      Object.entries(userCookie ?? {}).filter(([_, v]) => v !== undefined)
    ),
  };
}

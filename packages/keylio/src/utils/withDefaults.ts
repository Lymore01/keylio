import { CookieOptions } from "../config";
import { defaultCookieConfig } from "./defaults";

export function withDefaults(userCookie: Partial<CookieOptions>) {
  return {
    ...defaultCookieConfig,
    ...Object.fromEntries(
      Object.entries(userCookie ?? {}).filter(([_, v]) => v !== undefined)
    ),
  };
}

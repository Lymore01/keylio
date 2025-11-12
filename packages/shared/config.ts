import { CookieOptions } from "../keylio/src/config";
import { SESSION_KEY } from "./constants";

export const defaultCookieConfig: CookieOptions = {
  name: SESSION_KEY as string,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60,
};

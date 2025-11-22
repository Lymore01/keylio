import { AuthDataMap, AuthOptions, KeylioAuthConfig, KeylioConfig, SignInInput } from "../config";
import { signInUsingCredentials } from "../providers/credentials/sign-in";
import { signUpUsingCredentials } from "../providers/credentials/sign-up";
import type { HttpRequest } from "../types/http";
import { AuthError } from "@keylio/core/errors";
import { verifyJwtToken } from "@keylio/core/jwt";
import { SessionType, UserType } from "../types/auth";
import { SESSION_KEY } from "@keylio/shared/constants";
import { deleteJwtSessionCookie } from "@keylio/core/cookies";
import { createKeylioConfig } from "../utils";

/**
 * Main authentication client for Keylio.
 *
 * @remarks
 * - Handles sign-in, sign-out, and session management.
 * - Accepts a {@link KeylioAuthConfig} object.
 */

export class Keylio {
  private config: KeylioConfig;

  constructor(config: KeylioAuthConfig) {
    this.config = createKeylioConfig(config);
    this.signUp = this.signUp.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.getSession = this.getSession.bind(this);
  }

  getConfig() {
    return this.config;
  }

  async signUp<T extends AuthOptions>(input: SignInInput<T>, cookies?: any) {
    try {
      const { type, data } = input;

      switch (type) {
        case "credentials":
          return await signUpUsingCredentials(
            data as AuthDataMap["credentials"],
            this.config.session!,
            this.config.adapter!,
            cookies!
          );

        case "oAuth":
          throw new AuthError({
            code: "PROVIDER_NOT_IMPLEMENTED",
            message: "oAuth signup not yet implemented",
          });

        case "phoneOTP":
          throw new AuthError({
            code: "PROVIDER_NOT_IMPLEMENTED",
            message: "Phone OTP signup not yet implemented",
          });

        default:
          throw new AuthError({
            code: "UNSUPPORTED_AUTH_TYPE",
            message: `Unsupported auth type: ${type}`,
          });
      }
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async signIn<T extends AuthOptions>(input: SignInInput<T>, cookies?: any) {
    try {
      const { type, data } = input;

      switch (type) {
        case "credentials":
          return await signInUsingCredentials(
            data as AuthDataMap["credentials"],
            this.config.session!,
            this.config.adapter!,
            cookies!
          );

        case "oAuth":
          throw new AuthError({
            code: "PROVIDER_NOT_IMPLEMENTED",
            message: "oAuth signup not yet implemented",
          });
        case "phoneOTP":
          throw new AuthError({
            code: "PROVIDER_NOT_IMPLEMENTED",
            message: "Phone OTP signup not yet implemented",
          });

        default:
          throw new AuthError({
            code: "UNSUPPORTED_AUTH_TYPE",
            message: `Unsupported auth type: ${type}`,
          });
      }
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async signOut(cookies?: any): Promise<void> {
    try {
      const { session } = this.config;
      const token = await deleteJwtSessionCookie({
        cookies,
      });

      if (session?.strategy === "database" && token) {
        await this.config.adapter?.delete("session", [
          { field: "sessionToken", operator: "eq", value: token },
        ]);
      }

      console.log("[DEBUG]: User signed out successfully");
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async getSession(req?: HttpRequest): Promise<any> {
    try {
      const { strategy } = this.config.session!;
      if (strategy === "jwt") {
        let token: string | null = null;

        if (typeof window !== "undefined") {
          token =
            document.cookie
              .split("; ")
              .find((row) => row.startsWith(`${SESSION_KEY as string}=`))
              ?.split("=")[1] || null;
        } else if (req?.headers?.authorization) {
          token = req.headers.authorization.split("Bearer ")[1];
        } else if (req?.headers?.cookie) {
          const cookies = req.headers.cookie;
          if (cookies.includes(";")) {
            const match = cookies
              .split("; ")
              .find((row) => row.startsWith(`${SESSION_KEY as string}=`));
            token = match?.split("=")[1] || null;
          } else {
            token = req?.headers.cookie || null;
          }
        }

        if (!token) {
          return null;
        }

        const decoded = verifyJwtToken(token, this.config.session!.secret);

        return decoded;
      } else if (strategy === "database") {
        const cookieHeader = req?.headers?.cookie || "";

        const token = cookieHeader
          .split("; ")
          .find((c) => c.startsWith(`${SESSION_KEY as string}=`))
          ?.split("=")[1];
        const session = await this.config.adapter?.findOne<SessionType>(
          "session",
          [{ field: "sessionToken", operator: "eq", value: token }]
        );

        if (session && session.expires > new Date()) {
          const user = await this.config.adapter?.findOne<UserType>(
            "user",
            [{ field: "id", operator: "eq", value: session.userId }],
            ["id", "email", "role"]
          );
          return session;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error: any) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError({
      code: "UNEXPECTED_ERROR",
      message: error?.message || "Unexpected error occurred",
    });
  }
}

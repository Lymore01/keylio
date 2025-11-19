import { AuthDataMap, AuthOptions, KeylioConfig, SignInInput } from "../config";
import { signInUsingCredentials } from "../providers/credentials/sign-in";
import { signUpUsingCredentials } from "../providers/credentials/sign-up";
import type { HttpRequest } from "../types/http";
import { AuthError } from "@keylio/core/errors";
import { verifyJwtToken } from "@keylio/core/jwt";
import { SessionType, UserType } from "../types/auth";
import { SESSION_KEY } from "@keylio/shared/constants";
import { deleteJwtSessionCookie } from "@keylio/core/cookies";

export class Keylio {
  constructor(public authConfig: KeylioConfig) {
    this.signUp = this.signUp.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.getSession = this.getSession.bind(this);
  }

  async signUp<T extends AuthOptions>(input: SignInInput<T>, cookies?: any) {
    try {
      const { type, data } = input;

      switch (type) {
        case "credentials":
          return await signUpUsingCredentials(
            data as AuthDataMap["credentials"],
            this.authConfig.session,
            this.authConfig.adapter!,
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
            this.authConfig.session,
            this.authConfig.adapter!,
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
      const { session } = this.authConfig;
      const token = await deleteJwtSessionCookie({
        cookies,
      });

      if (session.strategy === "database" && token) {
        await this.authConfig.adapter?.delete("session", [
          { field: "sessionToken", operator: "eq", value: token },
        ]);
      }

      console.log("User signed out successfully");
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async getSession(req?: HttpRequest): Promise<any> {
    try {
      const { strategy } = this.authConfig.session;

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
          const match = req.headers.cookie
            .split("; ")
            .find((row) => row.startsWith(`${SESSION_KEY as string}=`));
          token = match?.split("=")[1] || null;
        }

        if (!token) return null;

        const decoded = verifyJwtToken(token, this.authConfig.session.secret);
        return decoded;
      }

      if (strategy === "database") {
        const cookieHeader = req?.headers?.cookie || "";

        const token = cookieHeader
          .split("; ")
          .find((c) => c.startsWith(`${SESSION_KEY as string}=`))
          ?.split("=")[1];
        const session = await this.authConfig.adapter?.findOne<SessionType>(
          "session",
          [{ field: "sessionToken", operator: "eq", value: token }]
        );

        if (session && session.expires > new Date()) {
          const user = await this.authConfig.adapter?.findOne<UserType>(
            "user",
            [{ field: "id", operator: "eq", value: session.userId }],
            ["id", "email", "role"]
          );
          return session;
        } else {
          return null;
        }
      }

      return null;
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

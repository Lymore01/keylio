"use client";

import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Supported authentication providers.
 *
 * @remarks
 * Used to indicate which provider a user authenticated with.
 */
export type ProviderType =
  | "credentials"
  | "google"
  | "github"
  | "discord"
  | "phoneOTP";

/**
 * Represents a user in the Keylio system.
 */
export type User = {
  /** Unique identifier for the user */
  id: string;
  /** Email address of the user */
  email: string;
  /** Role assigned to the user (e.g. "user", "admin") */
  role: string;
  /** Optional display name */
  name?: string;
  /** Optional profile image URL */
  image?: string;
  /** Optional provider used for authentication */
  provider?: ProviderType;
  /** Date the user was created */
  createdAt: Date;
};

/**
 * Strategy used for session management.
 * - "jwt": stateless JSON Web Tokens
 * - "database": persisted sessions in a database
 */
export type AuthStrategy = "jwt" | "database";

/**
 * Represents an active authentication session.
 */
export interface Session {
  /** Unique token identifying the session */
  sessionToken: string;
  /** The user associated with the session */
  user: User;
  /** Expiration date of the session */
  expires: Date;
  /** Strategy used for session management */
  strategy: AuthStrategy;
  /** Optional timestamp when the session was created */
  createdAt?: Date;
  /** Optional timestamp when the session was last updated */
  updatedAt?: Date;
}

/**
 * Current authentication status.
 */
export type AuthStatus = "authenticated" | "unauthenticated" | "loading";

/**
 * State object representing the current session and its status.
 */
export interface SessionState {
  /** Session data, or null if unauthenticated */
  data: Session | null;
  /** Current authentication status */
  status: AuthStatus;
}

/**
 * Value stored in the SessionContext.
 *
 * @remarks
 * Provides session state and helper methods for refreshing or signing out.
 */
export interface SessionContextValue extends SessionState {
  /** Update the current session state */
  setSession: (session: SessionState) => void;
  /** Refresh the session from the server */
  refresh: () => Promise<void>;
  /** Sign out the current user */
  signOut: () => Promise<void>;
}

/**
 * React context that holds the current session state and helpers.
 *
 * @remarks
 * Use {@link KeylioSessionProvider} to provide this context to your app.
 */
export const SessionContext = createContext<SessionContextValue | undefined>(
  undefined
);

/**
 * Props for the {@link KeylioSessionProvider}.
 */
type KeylioSessionProviderProps = {
  /** Child components that will have access to the session context */
  children: ReactNode;
  /** Preloaded session for SSR or hydration */
  initialSession?: SessionState;
  /** Optional: automatically refresh JWT before expiry (ms) */
  autoRefreshInterval?: number; // e.g. 5 * 60 * 1000 (5 min)
};

/**
 * React provider component for Keylio authentication sessions.
 *
 * @remarks
 * - Wrap your app with this provider to access session state via {@link SessionContext}.
 * - Automatically refreshes JWT sessions before expiry.
 * - Provides `refresh` and `signOut` helpers.
 *
 * @example
 * ```tsx
 * import { KeylioSessionProvider } from "keylio/react";
 *
 * function App() {
 *   return (
 *     <KeylioSessionProvider>
 *       <MyRoutes />
 *     </KeylioSessionProvider>
 *   );
 * }
 * ```
 */
export const KeylioSessionProvider = ({
  children,
  initialSession = { data: null, status: "unauthenticated" },
  autoRefreshInterval = 5 * 60 * 1000, // default 5 min
}: KeylioSessionProviderProps) => {
  const [session, setSession] = useState<SessionState>(initialSession);

  useEffect(() => {
    if (!session?.data || session.status !== "authenticated") return;

    const expiresIn =
      new Date(session.data.expires).getTime() - Date.now() - 60_000;
    const refreshTime = Math.max(expiresIn, autoRefreshInterval);

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/auth/session");
        const updated = await res.json();
        if (updated?.session) {
          setSession({ data: updated.session, status: "authenticated" });
        }
      } catch (error) {
        console.error("[Keylio] Auto-refresh failed:", error);
      }
    }, refreshTime);

    return () => clearInterval(interval);
  }, [session, autoRefreshInterval]);

  const refresh = async () => {
    try {
      const res = await fetch("/api/auth/session");
      const updated = await res.json();
      if (updated?.session) {
        setSession({ data: updated.session, status: "authenticated" });
      } else {
        setSession({ data: null, status: "unauthenticated" });
      }
    } catch (error) {
      console.error("[Keylio] Failed to refresh session:", error);
      setSession({ data: null, status: "unauthenticated" });
    }
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      setSession({ data: null, status: "unauthenticated" });
    } catch (error) {
      console.error("[Keylio] Sign-out failed:", error);
    }
  };

  const contextValue = useMemo<SessionContextValue>(
    () => ({
      ...session,
      setSession,
      refresh,
      signOut,
    }),
    [session]
  );

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};

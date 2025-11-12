import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ProviderType =
  | "credentials"
  | "google"
  | "github"
  | "discord"
  | "phoneOTP";

export type User = {
  id: string;
  email: string;
  role: string;
  name?: string;
  image?: string;
  provider?: ProviderType;
  createdAt: Date;
};

export type AuthStrategy = "jwt" | "database";

export interface Session {
  sessionToken: string;
  user: User;
  expires: Date;
  strategy: AuthStrategy;
  createdAt?: Date;
  updatedAt?: Date;
}

export type AuthStatus = "authenticated" | "unauthenticated" | "loading";

export interface SessionState {
  data: Session | null;
  status: AuthStatus;
}

export interface SessionContextValue extends SessionState {
  setSession: (session: SessionState) => void;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const SessionContext = createContext<SessionContextValue | undefined>(
  undefined
);

type KeylioSessionProviderProps = {
  children: ReactNode;
  /** Preloaded session for SSR or hydration */
  initialSession?: SessionState;
  /** Optional: automatically refresh JWT before expiry */
  autoRefreshInterval?: number; // e.g. 5 * 60 * 1000 (5 min)
};

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

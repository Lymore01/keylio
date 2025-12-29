import { useContext } from "react";
import { SessionContext } from "../providers/KeylioSessionProvider.js";

/**
 * React hook to access the current authentication session.
 *
 * @remarks
 * - Must be used within a {@link KeylioSessionProvider}.
 * - Provides access to session state (`data`, `status`) and helper methods
 *   (`refresh`, `signOut`, `setSession`).
 * - Throws an error if called outside of the provider.
 *
 * @example
 * ```tsx
 * import { useSession } from "keylio/react";
 *
 * function Dashboard() {
 *   const { data, status, refresh, signOut } = useSession();
 *
 *   if (status === "loading") return <p>Loading...</p>;
 *   if (status === "unauthenticated") return <p>Please sign in</p>;
 *
 *   return (
 *     <div>
 *       <h1>Welcome {data?.user.name}</h1>
 *       <button onClick={refresh}>Refresh session</button>
 *       <button onClick={signOut}>Sign out</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a KeylioSessionProvider");
  }
  return context;
}

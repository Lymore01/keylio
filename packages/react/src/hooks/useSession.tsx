import { useContext } from "react";
import { SessionContext } from "../providers/KeylioSessionProvider";

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useUserSession must be used within a UserSessionProvider");
  }
  return context;
}

import { AuthOptions, SignInInput } from "@keylio/keylio/config";

export async function signIn<T extends AuthOptions>(input: SignInInput<T>) {
  const res = await fetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to sign in");
  return data;
}

export async function signUp<T extends AuthOptions>(input: SignInInput<T>) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to sign up");
  return data;
}

export async function signOut() {
  const res = await fetch("/api/auth/signout", { method: "POST" });
  return res.json();
}

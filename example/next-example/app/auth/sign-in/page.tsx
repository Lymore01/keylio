"use client";

import { signIn } from "keylio/react";
import type { SignInInput } from "keylio/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Signing in...");

    try {
      const input: SignInInput<"credentials"> = {
        type: "credentials",
        data: { email, password },
      };

      const result = await signIn(input);
      setMessage(`Welcome back, ${result.user.email}`);

      router.push("/protected");
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8">
        <h2 className="text-3xl font-semibold text-center text-white mb-2">
          Welcome back
        </h2>
        <p className="text-center text-sm text-zinc-400 mb-8">
          Sign in to your Keylio account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                w-full rounded-lg bg-zinc-900/70 border border-zinc-700
                px-4 py-2.5 text-white placeholder-zinc-500
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              "
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-300 mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="
                w-full rounded-lg bg-zinc-900/70 border border-zinc-700
                px-4 py-2.5 text-white placeholder-zinc-500
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              "
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white
              transition-all hover:bg-indigo-500 active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {message && (
          <p id="error" className="mt-4 text-center text-sm text-zinc-400">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-zinc-500">
          Don&apos;t an account?{" "}
          <a href="/auth/sign-up" className="text-indigo-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

"use client";

import { getToken, signOut } from "keylio/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Protected() {
  const [status, setStatus] = useState<"loading" | "authenticated" | "error">(
    "loading"
  );
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await getToken();

        if (!token) {
          setStatus("error");
          router.push("/signin");
          return;
        }

        setStatus("authenticated");
      } catch {
        setStatus("error");
        router.push("/signin");
      }
    }

    checkAuth();
  }, [router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-zinc-400">
        Checking session…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            ✓
          </div>

          <h1 className="text-2xl font-semibold text-white">
            You&apos;re authenticated
          </h1>

          <p className="text-sm text-zinc-400">
            This page is protected by{" "}
            <span className="text-indigo-400">Keylio</span>.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <button
            onClick={async () => {
              await signOut();
              router.push("/auth/sign-in");
            }}
            className="
              w-full rounded-lg bg-red-600 py-2.5 text-white font-medium
              transition hover:bg-red-500 active:scale-[0.98]
            "
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Keylio</h1>

      <p className="mt-4 max-w-xl text-muted-foreground">
        A modern, type-safe authentication utility for Node.js and TypeScript.
      </p>

      <div className="mt-8 flex items-center gap-4">
        <Link
          href="/docs"
          className="rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
        >
          Read the docs
        </Link>

        <Link
          href="https://github.com/lymore01/keylio"
          target="_blank"
          className="text-sm text-muted-foreground hover:text-foreground transition"
        >
          GitHub →
        </Link>
      </div>

      <p className="mt-12 text-xs text-muted-foreground">
        Built for developers who value simplicity and correctness.
      </p>
    </main>
  );
}

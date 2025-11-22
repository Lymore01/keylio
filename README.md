# Keylio Auth

A modular, framework‑agnostic authentication system built for modern web apps.  
Inspired by NextAuth and BetterAuth, but designed to be **simpler, cleaner, and more extensible**.

---

## Quick Start (Next.js)

## Configuration Example

Keylio is fully configurable. Here’s a minimal setup using Prisma + PostgreSQL:

```ts
// ./keylio.ts
import { prismaAdapter } from "@keylio/core/adapters";
import { Keylio } from "@keylio/auth";
import { KeylioConfig } from "@keylio/config";
import { prisma } from "@prisma/client";

const authOptions: KeylioConfig = {
  adapter: prismaAdapter(prisma, { usePlural: false }),
  auth: {
    credentials: { enabled: true },
    oauth: [{ provider: "google", clientId: "abc", clientSecret: "xyz" }],
  },
  session: {
    strategy: "jwt",
    secret: process.env.AUTH_SECRET!,
    maxAge: 60 * 60 * 24, // 1 day
  },
};

const keylio = new Keylio(authOptions);

export { authOptions, keylio };
```

Add a single route file:

```ts
// /api/auth/[...keylio].ts
import { KeylioNextHandler } from "@keylio/next";
import { keylio } from "./keylio";

export const { GET, POST } = KeylioNextHandler(keylio);
```

---
Built by yours truly 😁

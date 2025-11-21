import { prisma } from "@/lib/prisma";
import { prismaAdapter } from "../../../packages/core/src/adapters/prisma-adapter/prisma-adapter"; // @keylio/core/adapters
import type { KeylioAuthConfig } from "../../../packages/keylio/src/config"; // @keylio/auth/config
import { Keylio } from "../../../packages/keylio/src/auth/Keylio"; // @keylio/auth

const authOptions: KeylioAuthConfig = {
  adapter: prismaAdapter(prisma),
  session: {
    secret: process.env.AUTH_SECRET!,
  },
};

const keylio = new Keylio(authOptions);

export { authOptions, keylio };

import { prisma } from "@/lib/prisma";
import { Keylio } from "keylio";
import { prismaAdapter } from "keylio/adapters/prisma";
import type { KeylioAuthConfig } from "keylio/types";

const authOptions: KeylioAuthConfig = {
  adapter: prismaAdapter(prisma),
  session: {
    secret: process.env.AUTH_SECRET || "default_secret",
  },
};

const keylio = new Keylio(authOptions);

export { authOptions, keylio };

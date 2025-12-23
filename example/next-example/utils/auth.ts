import { prisma } from "@/lib/prisma";
import type { KeylioAuthConfig } from "@keylio/types";
import { Keylio } from "keylio";
import { prismaAdapter } from "keylio/adapters/prisma";

const authOptions: KeylioAuthConfig = {
  adapter: prismaAdapter(prisma),
  session: {
    secret: process.env.AUTH_SECRET || "default_secret",
  },
};

const keylio = new Keylio(authOptions);

export { authOptions, keylio };

import { prisma } from "@/lib/prisma";
import { prismaAdapter } from "../../../packages/core/src/adapters/prisma-adapter/prisma-adapter";
import { KeylioConfig } from "../../../packages/keylio/src/config";
import { Keylio } from "../../../packages/keylio/src/auth/Keylio";

const authOptions: KeylioConfig = {
  adapter: prismaAdapter(prisma),
  session: {
    strategy: "jwt",
    secret: process.env.JWT_SECRET!,
    maxAge: 60 * 60 * 24,
    refreshToken: true,
  },
};

const keylio = new Keylio(authOptions);

export { authOptions, keylio };

import { prismaAdapter } from "@keylio/core/adapters";
import { Keylio } from "@keylio/keylio/auth";
import { KeylioConfig } from "@keylio/keylio/config";

const prisma = {};

const authOptions: KeylioConfig = {
  adapter: prismaAdapter(prisma),
  session: {
    strategy: "jwt",
    secret: process.env.AUTH_SECRET,
    maxAge: 60 * 60 * 24,
    refreshToken: true,
  },
};

const keylio = new Keylio(authOptions);

export { authOptions, keylio };

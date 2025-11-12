import { prismaAdapter } from "@keylio/core/adapters";
import { Keylio } from "@keylio/keylio/auth";
import { KeylioConfig } from "@keylio/keylio/config";

const prisma = {};

const authOptions: KeylioConfig = {
  adapter: prismaAdapter(prisma, {
    provider: "postgresql",
    usePlural: false,
  }),
  auth: {
    credentials: {
      enabled: true,
      requireEmailVerification: true,
    },
    oauth: [{ provider: "google", clientId: "abc", clientSecret: "xyz" }],
  },
  session: {
    strategy: "jwt",
    secret: process.env.JWT_SECRET || "super_secret",
    maxAge: 60 * 60 * 24, //86400
    refreshToken: true,
  },
  roles: {
    admin: ["createUser", "deleteUser"],
    user: ["readContent"],
  },
  callbacks: {
    onSignup: async (user) => {
      console.log("User signed up:", user.email);
    },
  },
  features: {
    multiFactorAuth: true,
    apiKeys: true,
  },
};

const keylio = new Keylio(authOptions);

export { authOptions, keylio };

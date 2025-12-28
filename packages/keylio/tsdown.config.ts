import { defineConfig } from "tsdown";

export default defineConfig({
  dts: true,
  entry: [
    "./src/auth/Keylio.ts",
    "./src/client/react/src/index.ts",
    "./src/client/next/src/index.ts",
    "./src/client/cookies/src/index.ts",
    "./src/adapters/prisma-adapter/index.ts",
    "./src/adapters/mongodb-adapter/index.ts",
    "./src/types/keylio-types.ts",
    "./src/providers/credentials/sign-in.ts",
    "./src/providers/credentials/sign-up.ts",
  ],
  format: ["esm", "cjs"],
  sourcemap: true,
  treeshake: true,
  clean: true,
  unbundle: true,
  external: [
    "react",
    "react-dom",
    "next",
    "@prisma/client",
    "jsonwebtoken",
    "bcrypt",
    "uuid",
    "mongodb",
    "@prisma/adapter-mongodb",
  ],
});

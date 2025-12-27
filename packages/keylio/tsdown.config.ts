import { defineConfig } from "tsdown";

export default defineConfig({
  dts: true,
  entry: [
    "./src/auth/Keylio.ts",
    "./src/client/react/src/index.ts",
    "./src/client/next/src/index.ts",
    "./src/adapters/prisma-adapter/index.ts",
    "./src/adapters/mongodb-adapter/index.ts",
    "./src/types/keylio-types.ts",
  ],
  format: ["esm"],
  sourcemap: true,
  treeshake: true,
  clean: true,
  unbundle: true,
});

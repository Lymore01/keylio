// /api/auth/[...keylio].ts
import { KeylioNextHandler } from "@keylio/next";
import { keylio } from "./keylio";

export const { GET, POST } = KeylioNextHandler(keylio);

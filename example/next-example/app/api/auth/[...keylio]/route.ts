import { keylio } from "@/utils/auth";
import { KeylioNextHandler } from "keylio/next";

export const { GET, POST } = KeylioNextHandler(keylio);

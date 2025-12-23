import { keylio } from "@/utils/auth";
import { KeylioNextHandler } from "keylio";

export const { GET, POST } = KeylioNextHandler(keylio);

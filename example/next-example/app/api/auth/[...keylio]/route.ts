import { keylio } from "@/utils/auth";
import { KeylioNextHandler } from "../../../../../../packages/next/src/index";

export const { GET, POST } = KeylioNextHandler(keylio);

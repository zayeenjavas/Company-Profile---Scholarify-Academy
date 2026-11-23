import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/src/server/auth/betterAuth";

export const { GET, POST } = toNextJsHandler(auth);

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins";
import bcrypt from "bcryptjs";
import { prisma } from "@/src/server/db";

const getBetterAuthSecret = () => {
  const secret = process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("BETTER_AUTH_SECRET or JWT_SECRET is required in production");
    }
    return "scholarify-dev-secret-change-in-production-32chars";
  }
  return secret;
};

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: getBetterAuthSecret(),
  baseURL:
    process.env.BETTER_AUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  trustedOrigins: [
    "https://scholarify.id",
    "https://www.scholarify.id",
    "https://scholarify-zayeenjavas313s-projects.vercel.app",
    "http://localhost:3000",
  ],
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password) => bcrypt.hash(password, 10),
      verify: async ({ hash, password }) => bcrypt.compare(password, hash),
    },
  },
  plugins: [username()],
  rateLimit: {
    enabled: true,
    window: 60,
    max: 20,
  },
  session: {
    expiresIn: 60 * 60 * 8, // 8 hours
    updateAge: 60 * 60, // refresh every 1 hour
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});

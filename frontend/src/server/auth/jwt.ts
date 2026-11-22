import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "@/src/types/domain";

export interface AuthTokenPayload {
  sub: string;
  username: string;
  role: UserRole;
}

const getJwtSecret = () => {
  const secret =
    process.env.JWT_SECRET || "scholarify-dev-secret-change-in-production-32chars";
  return new TextEncoder().encode(secret);
};

export async function signAuthToken(payload: AuthTokenPayload): Promise<string> {
  return new SignJWT({
    username: payload.username,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (!payload.sub || typeof payload.username !== "string" || typeof payload.role !== "string") {
      return null;
    }
    return {
      sub: payload.sub,
      username: payload.username,
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}

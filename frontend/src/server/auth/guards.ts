import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/src/server/db";
import { auth } from "@/src/server/auth/betterAuth";
import { verifyAuthToken } from "@/src/server/auth/jwt";
import type { UserRole } from "@/src/types/domain";

export const AUTH_COOKIE_NAME = "scholarify_token";

export async function getAuthUser(req?: Request) {
  // 1. Primary: Better Auth DB-backed session (cookie + CSRF + revocation)
  try {
    const reqHeaders = req ? req.headers : await headers();
    const baSession = await auth.api.getSession({ headers: reqHeaders });
    if (baSession?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: baSession.user.id },
        include: { subscription: true },
      });
      if (user && user.isActive) return user;
      return null;
    }
  } catch {
    // Fall through to Bearer / legacy token check if Better Auth header absent
  }

  // 2. Fallback: Bearer Authorization header or legacy cookie
  let token: string | undefined;

  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7).trim();
    }
  }

  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  }

  if (!token) return null;

  const payload = await verifyAuthToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    include: { subscription: true },
  });

  if (!user || !user.isActive) return null;
  return user;
}

export async function requireAuth(req?: Request) {
  const user = await getAuthUser(req);
  if (!user) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: "Autentikasi diperlukan", code: "UNAUTHORIZED" },
        { status: 401 }
      ),
    };
  }
  return { user, errorResponse: null };
}

export async function requireRole(req: Request | undefined, role: UserRole) {
  const { user, errorResponse } = await requireAuth(req);
  if (errorResponse || !user) {
    return { user: null, errorResponse: errorResponse! };
  }
  if (user.role !== role) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: "Akses ditolak untuk role Anda", code: "FORBIDDEN" },
        { status: 403 }
      ),
    };
  }
  return { user, errorResponse: null };
}

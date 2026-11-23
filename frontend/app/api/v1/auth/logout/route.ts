import { NextResponse } from "next/server";
import { auth } from "@/src/server/auth/betterAuth";
import { AUTH_COOKIE_NAME } from "@/src/server/auth/guards";

export async function POST(req: Request) {
  const res = NextResponse.json({ ok: true });

  try {
    const baRes = await auth.api.signOut({
      headers: req.headers,
      asResponse: true,
    });
    const setCookies = baRes.headers.getSetCookie?.() || [];
    for (const c of setCookies) {
      res.headers.append("set-cookie", c);
    }
  } catch {
    // Ignore if no active Better Auth session
  }

  res.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}

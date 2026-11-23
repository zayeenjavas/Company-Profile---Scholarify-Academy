import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/src/server/db";
import { auth } from "@/src/server/auth/betterAuth";
import { signAuthToken } from "@/src/server/auth/jwt";
import { AUTH_COOKIE_NAME } from "@/src/server/auth/guards";
import { serializeUserDto } from "@/src/server/services/dtoSerializer";

const loginSchema = z.object({
  username: z.string().trim().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Input tidak valid", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;
    const user = await prisma.user.findUnique({
      where: { username },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Username atau password salah", code: "INVALID_CREDENTIALS" },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Username atau password salah", code: "INVALID_CREDENTIALS" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Akun Anda tidak aktif. Hubungi admin.", code: "ACCOUNT_INACTIVE" },
        { status: 403 }
      );
    }

    // Sync Better Auth credential account for existing/seeded users if not yet present
    const existingCredential = await prisma.account.findFirst({
      where: { userId: user.id, providerId: "credential" },
    });
    if (!existingCredential) {
      await prisma.account.create({
        data: {
          accountId: user.id,
          providerId: "credential",
          userId: user.id,
          password: user.passwordHash,
        },
      });
    }

    // Create Better Auth DB-backed session & signed HttpOnly cookie
    const baRes = await auth.api.signInUsername({
      body: { username, password },
      headers: req.headers,
      asResponse: true,
    });

    const token = await signAuthToken({
      sub: user.id,
      username: user.username,
      role: user.role,
    });

    const userDto = serializeUserDto(user);
    const res = NextResponse.json({
      ok: true,
      token,
      user: userDto,
    });

    // Forward Better Auth Set-Cookie headers
    const setCookies = baRes.headers.getSetCookie?.() || [];
    for (const c of setCookies) {
      res.headers.append("set-cookie", c);
    }

    res.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return res;
  } catch (error) {
    console.error("[POST /api/v1/auth/login] Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat login", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

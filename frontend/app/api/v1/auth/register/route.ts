import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/src/server/db";
import { signAuthToken } from "@/src/server/auth/jwt";
import { AUTH_COOKIE_NAME } from "@/src/server/auth/guards";
import { serializeUserDto } from "@/src/server/services/dtoSerializer";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username minimal 3 karakter")
    .max(32)
    .regex(/^[a-z0-9_.-]+$/, "Username hanya boleh huruf, angka, titik, garis bawah, atau strip"),
  email: z.string().trim().email("Format email tidak valid").optional().or(z.literal("")),
  password: z.string().min(6, "Password minimal 6 karakter").max(100),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Input tidak valid", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const { name, username, password } = parsed.data;
    const email = parsed.data.email ? parsed.data.email.toLowerCase() : null;

    const existing = await prisma.user.findFirst({
      where: email ? { OR: [{ username }, { email }] } : { username },
      select: { username: true, email: true },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: existing.username === username ? "Username sudah digunakan" : "Email sudah terdaftar",
          code: "CONFLICT",
        },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const created = await prisma.user.create({
      data: {
        name,
        username,
        email,
        passwordHash,
        role: "STUDENT",
        isActive: true,
        subscription: {
          create: {
            plan: "FREE",
            status: "NONE",
          },
        },
      },
      include: { subscription: true },
    });

    const token = await signAuthToken({
      sub: created.id,
      username: created.username,
      role: created.role,
    });

    const res = NextResponse.json(
      { ok: true, token, user: serializeUserDto(created) },
      { status: 201 }
    );

    res.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return res;
  } catch (error) {
    console.error("[POST /api/v1/auth/register] Error:", error);
    return NextResponse.json(
      { error: "Gagal mendaftarkan akun", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/src/server/db";
import { requireRole } from "@/src/server/auth/guards";
import { serializeUserDto } from "@/src/server/services/dtoSerializer";

export async function GET(req: Request) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || undefined;

    const users = await prisma.user.findMany({
      where: search
        ? {
            OR: [
              { username: { contains: search } },
              { name: { contains: search } },
              { email: { contains: search } },
            ],
          }
        : undefined,
      include: { subscription: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      users: users.map(serializeUserDto),
    });
  } catch (error) {
    console.error("[GET /api/v1/admin/users] Error:", error);
    return NextResponse.json({ error: "Gagal mengambil daftar pengguna" }, { status: 500 });
  }
}

const createUserSchema = z.object({
  username: z.string().trim().min(3),
  name: z.string().trim().min(1),
  email: z.string().email().nullable().optional(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "STUDENT"]).default("STUDENT"),
  plan: z.enum(["FREE", "PREMIUM"]).default("FREE"),
  durationDays: z.number().int().positive().optional().default(30),
});

export async function POST(req: Request) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Data pengguna tidak valid" },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const passwordHash = await bcrypt.hash(d.password, 10);
    const expiresAt =
      d.plan === "PREMIUM"
        ? new Date(Date.now() + d.durationDays * 86_400_000)
        : null;

    const created = await prisma.user.create({
      data: {
        username: d.username,
        name: d.name,
        email: d.email || null,
        passwordHash,
        role: d.role,
        isActive: true,
        subscription: {
          create: {
            plan: d.plan,
            status: d.plan === "PREMIUM" ? "ACTIVE" : "NONE",
            expiresAt,
          },
        },
      },
      include: { subscription: true },
    });

    return NextResponse.json({ user: serializeUserDto(created) }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/v1/admin/users] Error:", error);
    return NextResponse.json({ error: "Gagal membuat pengguna (username/email mungkin sudah dipakai)" }, { status: 400 });
  }
}

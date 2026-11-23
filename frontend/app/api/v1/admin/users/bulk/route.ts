import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/src/server/db";
import { requireRole } from "@/src/server/auth/guards";

const bulkItemSchema = z.object({
  username: z.string().trim().toLowerCase().min(3).max(32),
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().optional().or(z.literal("")),
  password: z.string().min(4).max(100).optional().default("siswa123"),
  plan: z.enum(["FREE", "PREMIUM"]).optional().default("FREE"),
  durationDays: z.number().int().min(1).max(3650).optional().default(30),
});

const bulkSchema = z.object({
  users: z.array(bulkItemSchema).min(1).max(500),
});

export async function POST(req: Request) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const parsed = bulkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Format CSV/users tidak valid" },
        { status: 400 }
      );
    }

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const item of parsed.data.users) {
      try {
        const exists = await prisma.user.findUnique({ where: { username: item.username } });
        if (exists) {
          skipped++;
          continue;
        }
        const passwordHash = await bcrypt.hash(item.password || "siswa123", 10);
        const expiresAt =
          item.plan === "PREMIUM"
            ? new Date(Date.now() + item.durationDays * 86400000)
            : null;

        await prisma.user.create({
          data: {
            username: item.username,
            name: item.name,
            email: item.email ? item.email.toLowerCase() : null,
            passwordHash,
            role: "STUDENT",
            isActive: true,
            subscription: {
              create: {
                plan: item.plan,
                status: item.plan === "PREMIUM" ? "ACTIVE" : "NONE",
                expiresAt,
              },
            },
          },
        });
        created++;
      } catch {
        errors.push(`Gagal memproses ${item.username}`);
      }
    }

    return NextResponse.json({ ok: true, created, skipped, errors });
  } catch (error) {
    console.error("[POST /api/v1/admin/users/bulk] Error:", error);
    return NextResponse.json({ error: "Gagal memproses import massal" }, { status: 500 });
  }
}

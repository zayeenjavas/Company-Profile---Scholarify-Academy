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

const bulkActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("ACTIVATE_PREMIUM"),
    ids: z.array(z.string().min(1)).min(1).max(200),
    durationDays: z.number().int().min(1).max(3650).optional().default(90),
  }),
  z.object({
    action: z.literal("REVOKE_PREMIUM"),
    ids: z.array(z.string().min(1)).min(1).max(200),
  }),
  z.object({
    action: z.literal("SET_ACTIVE"),
    ids: z.array(z.string().min(1)).min(1).max(200),
    isActive: z.boolean(),
  }),
  z.object({
    action: z.literal("DELETE"),
    ids: z.array(z.string().min(1)).min(1).max(200),
  }),
]);

export async function PATCH(req: Request) {
  const { user: adminUser, errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse || !adminUser) return errorResponse!;

  try {
    const body = await req.json();
    const parsed = bulkActionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Payload aksi massal tidak valid" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const safeIds = data.ids.filter((id) => id !== adminUser.id);

    if (data.action === "DELETE") {
      if (safeIds.length === 0) {
        return NextResponse.json({ error: "Tidak dapat menghapus akun sendiri" }, { status: 400 });
      }
      const res = await prisma.user.deleteMany({
        where: { id: { in: safeIds }, role: "STUDENT" },
      });
      return NextResponse.json({ ok: true, affected: res.count });
    }

    if (data.action === "SET_ACTIVE") {
      const targetIds = data.isActive ? data.ids : safeIds;
      const res = await prisma.user.updateMany({
        where: { id: { in: targetIds } },
        data: { isActive: data.isActive },
      });
      return NextResponse.json({ ok: true, affected: res.count });
    }

    if (data.action === "ACTIVATE_PREMIUM") {
      const expiresAt = new Date(Date.now() + data.durationDays * 86400000);
      await prisma.$transaction(
        data.ids.map((uid) =>
          prisma.subscription.upsert({
            where: { userId: uid },
            update: { plan: "PREMIUM", status: "ACTIVE", expiresAt },
            create: { userId: uid, plan: "PREMIUM", status: "ACTIVE", expiresAt },
          })
        )
      );
      return NextResponse.json({ ok: true, affected: data.ids.length });
    }

    // REVOKE_PREMIUM
    const res = await prisma.subscription.updateMany({
      where: { userId: { in: data.ids } },
      data: { plan: "FREE", status: "NONE", expiresAt: null },
    });
    return NextResponse.json({ ok: true, affected: res.count });
  } catch (error) {
    console.error("[PATCH /api/v1/admin/users/bulk] Error:", error);
    return NextResponse.json({ error: "Gagal menjalankan aksi massal pengguna" }, { status: 500 });
  }
}

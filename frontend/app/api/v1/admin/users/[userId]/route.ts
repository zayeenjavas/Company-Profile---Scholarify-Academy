import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/src/server/db";
import { requireRole } from "@/src/server/auth/guards";
import { serializeUserDto } from "@/src/server/services/dtoSerializer";

const updateUserSchema = z.object({
  name: z.string().trim().min(1).optional(),
  isActive: z.boolean().optional(),
  role: z.enum(["ADMIN", "STUDENT"]).optional(),
  password: z.string().min(6).optional(),
  subscriptionPlan: z.enum(["FREE", "PREMIUM"]).optional(),
  subscriptionStatus: z.enum(["NONE", "ACTIVE", "EXPIRED"]).optional(),
  durationDays: z.number().int().positive().optional(),
});

export async function PATCH(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const { userId } = await context.params;
    const body = await req.json();
    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Data update tidak valid" },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const passwordHash = d.password ? await bcrypt.hash(d.password, 10) : undefined;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(d.name !== undefined && { name: d.name }),
        ...(d.isActive !== undefined && { isActive: d.isActive }),
        ...(d.role !== undefined && { role: d.role }),
        ...(passwordHash !== undefined && { passwordHash }),
        ...(d.subscriptionPlan || d.subscriptionStatus
          ? {
              subscription: {
                upsert: {
                  create: {
                    plan: d.subscriptionPlan ?? "FREE",
                    status: d.subscriptionStatus ?? "NONE",
                    expiresAt:
                      d.subscriptionPlan === "PREMIUM" && d.subscriptionStatus === "ACTIVE"
                        ? new Date(Date.now() + (d.durationDays ?? 30) * 86_400_000)
                        : null,
                  },
                  update: {
                    ...(d.subscriptionPlan && { plan: d.subscriptionPlan }),
                    ...(d.subscriptionStatus && { status: d.subscriptionStatus }),
                    ...(d.subscriptionStatus === "ACTIVE"
                      ? {
                          expiresAt: new Date(
                            Date.now() + (d.durationDays ?? 30) * 86_400_000
                          ),
                        }
                      : d.subscriptionStatus === "NONE" || d.subscriptionStatus === "EXPIRED"
                      ? { expiresAt: null }
                      : {}),
                  },
                },
              },
            }
          : {}),
      },
      include: { subscription: true },
    });

    return NextResponse.json({ user: serializeUserDto(updated) });
  } catch (error) {
    console.error("[PATCH /api/v1/admin/users/:id] Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui pengguna" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  const { user, errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse || !user) return errorResponse!;

  try {
    const { userId } = await context.params;
    if (user.id === userId) {
      return NextResponse.json({ error: "Tidak dapat menghapus akun sendiri" }, { status: 400 });
    }
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/v1/admin/users/:id] Error:", error);
    return NextResponse.json({ error: "Gagal menghapus pengguna" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/server/db";
import { requireRole } from "@/src/server/auth/guards";
import { canTransitionPackage } from "@/src/server/services/stateMachine";
import { serializePackageDto } from "@/src/server/services/dtoSerializer";

const updatePackageSchema = z.object({
  title: z.string().trim().min(2).optional(),
  description: z.string().optional(),
  tier: z.enum(["FREE", "PREMIUM"]).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  duration_minutes: z.number().int().positive().optional(),
  open_at: z.string().optional(),
  close_at: z.string().optional(),
  shuffle_questions: z.boolean().optional(),
  shuffle_choices: z.boolean().optional(),
  allow_review: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  context: { params: Promise<{ packageId: string }> }
) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const { packageId } = await context.params;
    const existing = await prisma.tryoutPackage.findUnique({
      where: { id: packageId },
      include: { _count: { select: { questions: true } } },
    });

    if (!existing) {
      return NextResponse.json({ error: "Paket tidak ditemukan" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = updatePackageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const d = parsed.data;
    if (d.status && !canTransitionPackage(existing.status, d.status)) {
      return NextResponse.json(
        { error: `Transisi status ${existing.status} -> ${d.status} tidak diizinkan` },
        { status: 400 }
      );
    }

    if (d.status === "PUBLISHED" && existing._count.questions === 0) {
      return NextResponse.json(
        { error: "Paket minimal harus memiliki 1 soal sebelum dipublikasikan" },
        { status: 400 }
      );
    }

    const updated = await prisma.tryoutPackage.update({
      where: { id: packageId },
      data: {
        ...(d.title !== undefined && { title: d.title }),
        ...(d.description !== undefined && { description: d.description }),
        ...(d.tier !== undefined && { tier: d.tier }),
        ...(d.status !== undefined && { status: d.status }),
        ...(d.duration_minutes !== undefined && { durationMinutes: d.duration_minutes }),
        ...(d.open_at !== undefined && { openAt: new Date(d.open_at) }),
        ...(d.close_at !== undefined && { closeAt: new Date(d.close_at) }),
        ...(d.shuffle_questions !== undefined && { shuffleQuestions: d.shuffle_questions }),
        ...(d.shuffle_choices !== undefined && { shuffleChoices: d.shuffle_choices }),
        ...(d.allow_review !== undefined && { allowReview: d.allow_review }),
      },
      include: { _count: { select: { questions: true } } },
    });

    return NextResponse.json({ package: serializePackageDto(updated, true) });
  } catch (error) {
    console.error("[PATCH /api/v1/admin/packages/:id] Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui paket" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ packageId: string }> }
) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const { packageId } = await context.params;
    await prisma.tryoutPackage.delete({ where: { id: packageId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/v1/admin/packages/:id] Error:", error);
    return NextResponse.json({ error: "Gagal menghapus paket" }, { status: 500 });
  }
}

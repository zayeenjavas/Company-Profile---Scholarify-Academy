import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/server/db";
import { requireRole } from "@/src/server/auth/guards";

const updateQuestionSchema = z.object({
  stemContent: z.string().trim().min(1).optional(),
  imageUrl: z.string().nullable().optional(),
  weight: z.number().int().positive().optional(),
  explanation: z.string().nullable().optional(),
  correctLabel: z.enum(["A", "B", "C", "D", "E"]).optional(),
  choices: z
    .object({
      A: z.string().min(1),
      B: z.string().min(1),
      C: z.string().min(1),
      D: z.string().min(1),
      E: z.string().min(1),
    })
    .optional(),
});

export async function PATCH(
  req: Request,
  context: { params: Promise<{ questionId: string }> }
) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const { questionId } = await context.params;
    const body = await req.json();
    const parsed = updateQuestionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Data soal tidak valid" }, { status: 400 });
    }

    const d = parsed.data;
    const updated = await prisma.$transaction(async (tx) => {
      const q = await tx.question.update({
        where: { id: questionId },
        data: {
          ...(d.stemContent !== undefined && { stemContent: d.stemContent }),
          ...(d.imageUrl !== undefined && { imageUrl: d.imageUrl }),
          ...(d.weight !== undefined && { weight: d.weight }),
          ...(d.explanation !== undefined && { explanation: d.explanation }),
        },
      });

      if (d.choices || d.correctLabel) {
        const existingChoices = await tx.questionChoice.findMany({
          where: { questionId },
        });
        for (const ch of existingChoices) {
          const label = ch.label as "A" | "B" | "C" | "D" | "E";
          await tx.questionChoice.update({
            where: { id: ch.id },
            data: {
              ...(d.choices ? { content: d.choices[label] } : {}),
              ...(d.correctLabel ? { isCorrect: d.correctLabel === label } : {}),
            },
          });
        }
      }

      return tx.question.findUnique({
        where: { id: q.id },
        include: {
          tryoutPackage: { select: { id: true, slug: true, title: true } },
          subtest: { select: { id: true, code: true, title: true } },
          choices: { orderBy: { label: "asc" } },
        },
      });
    });

    return NextResponse.json({ question: updated });
  } catch (error) {
    console.error("[PATCH /api/v1/admin/questions/:id] Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui soal" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ questionId: string }> }
) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const { questionId } = await context.params;
    await prisma.question.delete({ where: { id: questionId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/v1/admin/questions/:id] Error:", error);
    return NextResponse.json({ error: "Gagal menghapus soal" }, { status: 500 });
  }
}

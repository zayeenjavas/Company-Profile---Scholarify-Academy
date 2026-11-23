import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/server/db";
import { requireRole } from "@/src/server/auth/guards";

const bulkQuestionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("DELETE"),
    ids: z.array(z.string().min(1)).min(1).max(200),
  }),
  z.object({
    action: z.literal("MOVE"),
    ids: z.array(z.string().min(1)).min(1).max(200),
    targetPackageId: z.string().min(1).optional(),
    targetSubtestId: z.string().min(1).optional(),
  }),
  z.object({
    action: z.literal("DUPLICATE"),
    ids: z.array(z.string().min(1)).min(1).max(200),
    targetPackageId: z.string().min(1).optional(),
    targetSubtestId: z.string().min(1).optional(),
  }),
  z.object({
    action: z.literal("SET_WEIGHT"),
    ids: z.array(z.string().min(1)).min(1).max(200),
    weight: z.number().int().min(1).max(10),
  }),
]);

export async function POST(req: Request) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const parsed = bulkQuestionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Payload aksi massal tidak valid" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (data.action === "DELETE") {
      const res = await prisma.question.deleteMany({
        where: { id: { in: data.ids } },
      });
      return NextResponse.json({ ok: true, affected: res.count });
    }

    if (data.action === "SET_WEIGHT") {
      const res = await prisma.question.updateMany({
        where: { id: { in: data.ids } },
        data: { weight: data.weight },
      });
      return NextResponse.json({ ok: true, affected: res.count });
    }

    if (data.action === "MOVE") {
      if (!data.targetPackageId && !data.targetSubtestId) {
        return NextResponse.json(
          { error: "Pilih paket atau subtest tujuan" },
          { status: 400 }
        );
      }
      const res = await prisma.question.updateMany({
        where: { id: { in: data.ids } },
        data: {
          ...(data.targetPackageId ? { packageId: data.targetPackageId } : {}),
          ...(data.targetSubtestId ? { subtestId: data.targetSubtestId } : {}),
        },
      });
      return NextResponse.json({ ok: true, affected: res.count });
    }

    // DUPLICATE
    const sources = await prisma.question.findMany({
      where: { id: { in: data.ids } },
      include: { choices: true },
    });

    const createdCount = await prisma.$transaction(async (tx) => {
      let count = 0;
      for (const src of sources) {
        await tx.question.create({
          data: {
            packageId: data.targetPackageId || src.packageId,
            subtestId: data.targetSubtestId || src.subtestId,
            orderNo: src.orderNo,
            stemContent: src.stemContent,
            imageUrl: src.imageUrl,
            questionType: src.questionType,
            weight: src.weight,
            explanation: src.explanation,
            choices: {
              create: src.choices.map((c) => ({
                label: c.label,
                content: c.content,
                isCorrect: c.isCorrect,
              })),
            },
          },
        });
        count++;
      }
      return count;
    });

    return NextResponse.json({ ok: true, affected: createdCount });
  } catch (error) {
    console.error("[POST /api/v1/admin/questions/bulk] Error:", error);
    return NextResponse.json({ error: "Gagal menjalankan aksi massal soal" }, { status: 500 });
  }
}

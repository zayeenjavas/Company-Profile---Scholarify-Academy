import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/server/db";
import { requireAuth } from "@/src/server/auth/guards";
import { serializeAnswerDto } from "@/src/server/services/dtoSerializer";
import { gradeSessionAtomically } from "@/src/server/services/scoring.service";

const upsertSchema = z.object({
  selected_label: z.string().trim().toUpperCase().nullable(),
  is_flagged: z.boolean().default(false),
});

const GRACE_MS = 15_000;

export async function PUT(
  req: Request,
  context: { params: Promise<{ sessionId: string; questionId: string }> }
) {
  const { user, errorResponse } = await requireAuth(req);
  if (errorResponse || !user) return errorResponse!;

  try {
    const { sessionId, questionId } = await context.params;
    const body = await req.json();
    const parsed = upsertSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Format jawaban tidak valid" }, { status: 400 });
    }

    const session = await prisma.examSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== user.id) {
      return NextResponse.json({ error: "Sesi ujian tidak ditemukan" }, { status: 404 });
    }

    if (session.status !== "BERLANGSUNG") {
      return NextResponse.json({ error: "Sesi ujian sudah ditutup" }, { status: 409 });
    }

    if (session.expiresAt && Date.now() > session.expiresAt.getTime() + GRACE_MS) {
      await gradeSessionAtomically(session.id, "WAKTU_HABIS");
      return NextResponse.json(
        { error: "Waktu ujian telah habis", code: "EXAM_EXPIRED" },
        { status: 410 }
      );
    }

    const answer = await prisma.studentAnswer.upsert({
      where: {
        sessionId_questionId: {
          sessionId,
          questionId,
        },
      },
      update: {
        selectedLabel: parsed.data.selected_label,
        isFlagged: parsed.data.is_flagged,
      },
      create: {
        sessionId,
        questionId,
        selectedLabel: parsed.data.selected_label,
        isFlagged: parsed.data.is_flagged,
      },
    });

    return NextResponse.json({
      ok: true,
      answer: serializeAnswerDto(answer),
      server_now: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[PUT /api/v1/sessions/:id/answers/:q_id] Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan jawaban" }, { status: 500 });
  }
}

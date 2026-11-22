import { NextResponse } from "next/server";
import { prisma } from "@/src/server/db";
import { requireAuth } from "@/src/server/auth/guards";
import { serializeExamQuestionDto } from "@/src/server/services/dtoSerializer";

export async function GET(
  req: Request,
  context: { params: Promise<{ sessionId: string }> }
) {
  const { user, errorResponse } = await requireAuth(req);
  if (errorResponse || !user) return errorResponse!;

  try {
    const { sessionId } = await context.params;
    const session = await prisma.examSession.findUnique({
      where: { id: sessionId },
      include: {
        tryoutPackage: true,
        subtest: true,
        answers: true,
        result: true,
      },
    });

    if (!session || (session.userId !== user.id && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 404 });
    }

    if (session.status !== "DINILAI") {
      return NextResponse.json(
        { error: "Pembahasan hanya tersedia setelah ujian selesai dinilai" },
        { status: 403 }
      );
    }

    if (!session.tryoutPackage.allowReview && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Paket tryout ini tidak mengizinkan review pembahasan" },
        { status: 403 }
      );
    }

    const questions = await prisma.question.findMany({
      where: { packageId: session.packageId, subtestId: session.subtestId },
      include: { choices: true },
      orderBy: { orderNo: "asc" },
    });

    const answerMap = new Map(session.answers.map((a) => [a.questionId, a.selectedLabel]));

    const items = questions.map((q) => {
      const selected = answerMap.get(q.id) ?? null;
      const correct = q.choices.find((c) => c.isCorrect)?.label ?? null;
      return {
        ...serializeExamQuestionDto(q),
        selected_label: selected,
        correct_label: correct,
        is_correct: Boolean(selected && correct && selected === correct),
        explanation: q.explanation,
      };
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("[GET /api/v1/sessions/:id/review] Error:", error);
    return NextResponse.json({ error: "Gagal memuat pembahasan" }, { status: 500 });
  }
}

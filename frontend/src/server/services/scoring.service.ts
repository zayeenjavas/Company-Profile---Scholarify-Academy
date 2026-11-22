import { prisma } from "@/src/server/db";
import type { ExamSessionStatus } from "@prisma/client";

export function computeScoreMetrics(
  questions: Array<{
    id: string;
    weight: number;
    correctLabel: string | null;
  }>,
  answersByQuestionId: Map<string, string | null>
) {
  let correctCount = 0;
  let wrongCount = 0;
  let emptyCount = 0;
  let earnedWeight = 0;
  let totalWeight = 0;

  for (const q of questions) {
    const weight = q.weight > 0 ? q.weight : 1;
    totalWeight += weight;

    const selected = answersByQuestionId.get(q.id)?.trim().toUpperCase() ?? "";
    if (!selected) {
      emptyCount++;
    } else if (q.correctLabel && selected === q.correctLabel.trim().toUpperCase()) {
      correctCount++;
      earnedWeight += weight;
    } else {
      wrongCount++;
    }
  }

  const totalScore =
    totalWeight > 0 ? Number(((earnedWeight / totalWeight) * 100).toFixed(2)) : 0;

  return {
    totalScore,
    correctCount,
    wrongCount,
    emptyCount,
  };
}

export async function gradeSessionAtomically(
  sessionId: string,
  endStatus: "SELESAI" | "WAKTU_HABIS" = "SELESAI"
) {
  return prisma.$transaction(async (tx) => {
    const session = await tx.examSession.findUnique({
      where: { id: sessionId },
      include: {
        subtest: true,
        tryoutPackage: true,
        answers: true,
        result: true,
      },
    });

    if (!session) {
      throw new Error("SESSION_NOT_FOUND");
    }

    // Idempotent: jika sudah DINILAI, langsung kembalikan hasil yang ada
    if (session.status === "DINILAI" && session.result) {
      return { session, result: session.result };
    }

    const questions = await tx.question.findMany({
      where: {
        packageId: session.packageId,
        subtestId: session.subtestId,
      },
      include: { choices: true },
    });

    const answerMap = new Map<string, string | null>();
    for (const ans of session.answers) {
      answerMap.set(ans.questionId, ans.selectedLabel);
    }

    const metrics = computeScoreMetrics(
      questions.map((q) => ({
        id: q.id,
        weight: q.weight,
        correctLabel: q.choices.find((c) => c.isCorrect)?.label ?? null,
      })),
      answerMap
    );

    const submittedAt = session.submittedAt ?? new Date();
    const intermediateStatus: ExamSessionStatus =
      session.status === "BERLANGSUNG" ? endStatus : session.status;

    const updatedSession = await tx.examSession.update({
      where: { id: sessionId },
      data: {
        status: "DINILAI",
        submittedAt,
      },
      include: {
        subtest: true,
        tryoutPackage: true,
      },
    });

    const result = await tx.examResult.upsert({
      where: { sessionId },
      update: {
        ...metrics,
        gradedAt: new Date(),
      },
      create: {
        sessionId,
        ...metrics,
      },
    });

    void intermediateStatus;
    return { session: updatedSession, result };
  });
}

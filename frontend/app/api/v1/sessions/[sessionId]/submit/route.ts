import { NextResponse } from "next/server";
import { prisma } from "@/src/server/db";
import { requireAuth } from "@/src/server/auth/guards";
import { gradeSessionAtomically } from "@/src/server/services/scoring.service";
import {
  serializeResultDto,
  serializeSessionDto,
} from "@/src/server/services/dtoSerializer";

export async function POST(
  req: Request,
  context: { params: Promise<{ sessionId: string }> }
) {
  const { user, errorResponse } = await requireAuth(req);
  if (errorResponse || !user) return errorResponse!;

  try {
    const { sessionId } = await context.params;
    const existing = await prisma.examSession.findUnique({
      where: { id: sessionId },
    });

    if (!existing || (existing.userId !== user.id && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Sesi ujian tidak ditemukan" }, { status: 404 });
    }

    const endStatus =
      existing.expiresAt && Date.now() > existing.expiresAt.getTime() + 15_000
        ? "WAKTU_HABIS"
        : "SELESAI";

    const { session, result } = await gradeSessionAtomically(sessionId, endStatus);

    return NextResponse.json({
      session: serializeSessionDto(session),
      result: serializeResultDto({ ...result, session }),
    });
  } catch (error) {
    console.error("[POST /api/v1/sessions/:id/submit] Error:", error);
    return NextResponse.json({ error: "Gagal mengirim jawaban" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/server/db";
import { requireRole } from "@/src/server/auth/guards";
import { gradeSessionAtomically } from "@/src/server/services/scoring.service";

const actionSchema = z.object({
  action: z.enum(["FORCE_FINISH", "RESET"]),
});

export async function POST(
  req: Request,
  context: { params: Promise<{ sessionId: string }> }
) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const { sessionId } = await context.params;
    const body = await req.json();
    const parsed = actionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Aksi tidak valid" }, { status: 400 });
    }

    if (parsed.data.action === "FORCE_FINISH") {
      const graded = await gradeSessionAtomically(sessionId, "WAKTU_HABIS");
      return NextResponse.json({ ok: true, status: graded.session.status });
    }

    // RESET: hapus sesi & jawaban sehingga peserta dapat mengulang dari awal
    await prisma.examSession.delete({ where: { id: sessionId } });
    return NextResponse.json({ ok: true, status: "RESET" });
  } catch (error) {
    console.error("[POST /api/v1/admin/sessions/:id/action] Error:", error);
    return NextResponse.json({ error: "Gagal menjalankan aksi sesi" }, { status: 500 });
  }
}

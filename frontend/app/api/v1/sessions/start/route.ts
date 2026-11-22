import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/server/db";
import { requireAuth } from "@/src/server/auth/guards";
import { isSubscriptionActive } from "@/src/server/services/stateMachine";
import {
  serializeAnswerDto,
  serializeExamQuestionDto,
  serializeSessionDto,
} from "@/src/server/services/dtoSerializer";

const startSchema = z.object({
  package_id: z.string().min(1),
  subtest_id: z.string().min(1),
});

export async function POST(req: Request) {
  const { user, errorResponse } = await requireAuth(req);
  if (errorResponse || !user) return errorResponse!;

  try {
    const body = await req.json();
    const parsed = startSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "package_id dan subtest_id wajib" }, { status: 400 });
    }

    const { package_id, subtest_id } = parsed.data;
    const [pkg, subtest] = await Promise.all([
      prisma.tryoutPackage.findUnique({ where: { id: package_id } }),
      prisma.subtest.findUnique({ where: { id: subtest_id } }),
    ]);

    if (!pkg || !subtest) {
      return NextResponse.json({ error: "Paket atau subtest tidak ditemukan" }, { status: 404 });
    }

    if (pkg.status !== "PUBLISHED" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Paket tryout belum dibuka" }, { status: 403 });
    }

    // Subscription gating: server-side check!
    if (pkg.tier === "PREMIUM" && user.role !== "ADMIN" && !isSubscriptionActive(user.subscription)) {
      return NextResponse.json(
        { error: "Paket ini khusus pengguna berlangganan aktif", code: "SUBSCRIPTION_REQUIRED" },
        { status: 403 }
      );
    }

    let session = await prisma.examSession.findUnique({
      where: {
        userId_packageId_subtestId: {
          userId: user.id,
          packageId: pkg.id,
          subtestId: subtest.id,
        },
      },
      include: { subtest: true, answers: true },
    });

    if (session && (session.status === "DINILAI" || session.status === "SELESAI" || session.status === "WAKTU_HABIS")) {
      return NextResponse.json(
        { error: "Subtest ini sudah selesai dikerjakan", code: "SESSION_ALREADY_COMPLETED" },
        { status: 409 }
      );
    }

    if (!session || session.status === "TERDAFTAR") {
      const now = new Date();
      const durationMs = Math.round(subtest.durationMinutes * 60 * 1000);
      const computedExpires = new Date(Math.min(now.getTime() + durationMs, pkg.closeAt.getTime()));

      session = await prisma.examSession.upsert({
        where: {
          userId_packageId_subtestId: {
            userId: user.id,
            packageId: pkg.id,
            subtestId: subtest.id,
          },
        },
        update: {
          status: "BERLANGSUNG",
          startedAt: now,
          expiresAt: computedExpires,
        },
        create: {
          userId: user.id,
          packageId: pkg.id,
          subtestId: subtest.id,
          status: "BERLANGSUNG",
          startedAt: now,
          expiresAt: computedExpires,
        },
        include: { subtest: true, answers: true },
      });
    }

    const questions = await prisma.question.findMany({
      where: { packageId: pkg.id, subtestId: subtest.id },
      include: { choices: true },
      orderBy: { orderNo: "asc" },
    });

    return NextResponse.json({
      session: serializeSessionDto(session),
      questions: questions.map(serializeExamQuestionDto),
      answers: session.answers.map(serializeAnswerDto),
    });
  } catch (error) {
    console.error("[POST /api/v1/sessions/start] Error:", error);
    return NextResponse.json({ error: "Gagal memulai sesi ujian" }, { status: 500 });
  }
}

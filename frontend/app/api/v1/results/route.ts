import { NextResponse } from "next/server";
import { prisma } from "@/src/server/db";
import { requireAuth } from "@/src/server/auth/guards";
import { serializeResultDto } from "@/src/server/services/dtoSerializer";

export async function GET(req: Request) {
  const { user, errorResponse } = await requireAuth(req);
  if (errorResponse || !user) return errorResponse!;

  try {
    const results = await prisma.examResult.findMany({
      where: { session: { userId: user.id } },
      include: {
        session: {
          include: {
            tryoutPackage: true,
            subtest: true,
          },
        },
      },
      orderBy: { gradedAt: "desc" },
    });

    return NextResponse.json({
      results: results.map(serializeResultDto),
    });
  } catch (error) {
    console.error("[GET /api/v1/results] Error:", error);
    return NextResponse.json({ error: "Gagal mengambil riwayat hasil" }, { status: 500 });
  }
}

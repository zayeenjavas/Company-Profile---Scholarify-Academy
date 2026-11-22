import { NextResponse } from "next/server";
import { prisma } from "@/src/server/db";
import { requireRole } from "@/src/server/auth/guards";

export async function GET(req: Request) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status") || undefined;

    const sessions = await prisma.examSession.findMany({
      where: statusFilter ? { status: statusFilter as any } : undefined,
      include: {
        user: { select: { id: true, username: true, name: true } },
        tryoutPackage: { select: { id: true, slug: true, title: true } },
        subtest: { select: { id: true, code: true, title: true } },
        result: true,
        _count: { select: { answers: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("[GET /api/v1/admin/sessions] Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data sesi ujian" }, { status: 500 });
  }
}

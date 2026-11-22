import { NextResponse } from "next/server";
import { prisma } from "@/src/server/db";
import { serializeSubtestDto } from "@/src/server/services/dtoSerializer";

export async function GET() {
  try {
    const subtests = await prisma.subtest.findMany({
      orderBy: { code: "asc" },
    });
    return NextResponse.json({
      subtests: subtests.map(serializeSubtestDto),
    });
  } catch (error) {
    console.error("[GET /api/v1/subtests] Error:", error);
    return NextResponse.json({ error: "Gagal mengambil daftar subtest" }, { status: 500 });
  }
}

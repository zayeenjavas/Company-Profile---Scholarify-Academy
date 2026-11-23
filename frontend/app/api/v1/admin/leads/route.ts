import { NextResponse } from "next/server";
import { prisma } from "@/src/server/db";
import { requireRole } from "@/src/server/auth/guards";

export async function GET(req: Request) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  const leads = await prisma.contactLead.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ leads });
}

export async function PATCH(req: Request) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const { id, status } = await req.json();
    if (!id || !["NEW", "CONTACTED", "ARCHIVED"].includes(status)) {
      return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
    }
    const lead = await prisma.contactLead.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ ok: true, lead });
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui status pesan" }, { status: 500 });
  }
}

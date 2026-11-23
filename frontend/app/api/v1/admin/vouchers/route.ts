import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/server/db";
import { requireRole } from "@/src/server/auth/guards";

const createSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .min(3)
    .max(40)
    .regex(/^[A-Z0-9_-]+$/, "Kode hanya boleh huruf kapital, angka, _ atau -"),
  label: z.string().trim().min(2).max(80).default("Mitra Sekolah"),
  durationDays: z.number().int().min(1).max(3650).default(30),
  maxUses: z.number().int().min(1).max(100000).default(100),
});

export async function GET(req: Request) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  const vouchers = await prisma.voucherCode.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ vouchers });
}

export async function POST(req: Request) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Data voucher tidak valid" },
        { status: 400 }
      );
    }

    const exists = await prisma.voucherCode.findUnique({ where: { code: parsed.data.code } });
    if (exists) {
      return NextResponse.json({ error: "Kode voucher sudah ada" }, { status: 409 });
    }

    const voucher = await prisma.voucherCode.create({ data: parsed.data });
    return NextResponse.json({ ok: true, voucher }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/v1/admin/vouchers] Error:", error);
    return NextResponse.json({ error: "Gagal membuat voucher" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const { id, isActive } = await req.json();
    if (!id || typeof isActive !== "boolean") {
      return NextResponse.json({ error: "id dan isActive wajib diisi" }, { status: 400 });
    }
    const voucher = await prisma.voucherCode.update({
      where: { id },
      data: { isActive },
    });
    return NextResponse.json({ ok: true, voucher });
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui voucher" }, { status: 500 });
  }
}

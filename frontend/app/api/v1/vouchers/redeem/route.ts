import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/server/db";
import { requireAuth } from "@/src/server/auth/guards";

const redeemSchema = z.object({
  code: z.string().trim().min(3, "Kode voucher wajib diisi").max(40),
});

export async function POST(req: Request) {
  const { user, errorResponse } = await requireAuth(req);
  if (errorResponse || !user) return errorResponse!;

  try {
    const body = await req.json();
    const parsed = redeemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Kode voucher tidak valid" },
        { status: 400 }
      );
    }

    const code = parsed.data.code.toUpperCase();

    const result = await prisma.$transaction(async (tx) => {
      const voucher = await tx.voucherCode.findUnique({ where: { code } });
      if (!voucher || !voucher.isActive) {
        return { error: "Kode voucher tidak ditemukan atau tidak aktif", status: 404 as const };
      }
      if (voucher.expiresAt && voucher.expiresAt.getTime() < Date.now()) {
        return { error: "Kode voucher sudah kedaluwarsa", status: 410 as const };
      }
      if (voucher.usedCount >= voucher.maxUses) {
        return { error: "Kuota pemakaian voucher sudah habis", status: 409 as const };
      }

      const currentSub = await tx.subscription.findUnique({ where: { userId: user.id } });
      const baseTime =
        currentSub?.status === "ACTIVE" &&
        currentSub.expiresAt &&
        currentSub.expiresAt.getTime() > Date.now()
          ? currentSub.expiresAt.getTime()
          : Date.now();
      const newExpiresAt = new Date(baseTime + voucher.durationDays * 86400000);

      await tx.voucherCode.update({
        where: { id: voucher.id },
        data: { usedCount: { increment: 1 } },
      });

      const subscription = await tx.subscription.upsert({
        where: { userId: user.id },
        update: {
          plan: "PREMIUM",
          status: "ACTIVE",
          expiresAt: newExpiresAt,
        },
        create: {
          userId: user.id,
          plan: "PREMIUM",
          status: "ACTIVE",
          expiresAt: newExpiresAt,
        },
      });

      return { voucher, subscription };
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({
      ok: true,
      message: `Voucher ${result.voucher.code} (${result.voucher.label}) berhasil diaktifkan!`,
      expiresAt: result.subscription.expiresAt,
    });
  } catch (error) {
    console.error("[POST /api/v1/vouchers/redeem] Error:", error);
    return NextResponse.json({ error: "Gagal menukarkan kode voucher" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/server/db";
import { getAuthUser, requireRole } from "@/src/server/auth/guards";
import { isSubscriptionActive } from "@/src/server/services/stateMachine";
import { serializePackageDto } from "@/src/server/services/dtoSerializer";

export async function GET(req: Request) {
  try {
    const user = await getAuthUser(req);
    const hasSub = isSubscriptionActive(user?.subscription);
    const isAdmin = user?.role === "ADMIN";

    const packages = await prisma.tryoutPackage.findMany({
      where: isAdmin ? undefined : { status: "PUBLISHED" },
      include: { _count: { select: { questions: true } } },
      orderBy: [{ openAt: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      packages: packages.map((p) => serializePackageDto(p, isAdmin || hasSub)),
    });
  } catch (error) {
    console.error("[GET /api/v1/packages] Error:", error);
    return NextResponse.json({ error: "Gagal mengambil daftar paket" }, { status: 500 });
  }
}

const createPackageSchema = z.object({
  slug: z.string().trim().min(2),
  title: z.string().trim().min(2),
  description: z.string().optional().default(""),
  tier: z.enum(["FREE", "PREMIUM"]).default("PREMIUM"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  duration_minutes: z.number().int().positive().default(90),
  open_at: z.string(),
  close_at: z.string(),
  shuffle_questions: z.boolean().optional().default(false),
  shuffle_choices: z.boolean().optional().default(false),
  allow_review: z.boolean().optional().default(true),
});

export async function POST(req: Request) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const parsed = createPackageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Data paket tidak valid" },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const created = await prisma.tryoutPackage.create({
      data: {
        slug: d.slug,
        title: d.title,
        description: d.description,
        tier: d.tier,
        status: d.status,
        durationMinutes: d.duration_minutes,
        openAt: new Date(d.open_at),
        closeAt: new Date(d.close_at),
        shuffleQuestions: d.shuffle_questions,
        shuffleChoices: d.shuffle_choices,
        allowReview: d.allow_review,
      },
      include: { _count: { select: { questions: true } } },
    });

    return NextResponse.json(
      { package: serializePackageDto(created, true) },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/v1/packages] Error:", error);
    return NextResponse.json({ error: "Gagal membuat paket tryout" }, { status: 500 });
  }
}

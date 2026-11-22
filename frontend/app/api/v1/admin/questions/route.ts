import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/server/db";
import { requireRole } from "@/src/server/auth/guards";

export async function GET(req: Request) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const packageId = searchParams.get("package_id") || undefined;
    const subtestCode = searchParams.get("subtest_code") || undefined;
    const search = searchParams.get("search")?.trim() || undefined;
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || "25")));

    const where = {
      ...(packageId ? { packageId } : {}),
      ...(subtestCode ? { subtest: { code: subtestCode.toUpperCase() } } : {}),
      ...(search ? { stemContent: { contains: search } } : {}),
    };

    const [total, items] = await Promise.all([
      prisma.question.count({ where }),
      prisma.question.findMany({
        where,
        include: {
          tryoutPackage: { select: { id: true, slug: true, title: true } },
          subtest: { select: { id: true, code: true, title: true } },
          choices: { orderBy: { label: "asc" } },
        },
        orderBy: [{ orderNo: "asc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error("[GET /api/v1/admin/questions] Error:", error);
    return NextResponse.json({ error: "Gagal memuat bank soal" }, { status: 500 });
  }
}

const createQuestionSchema = z.object({
  packageId: z.string().min(1),
  subtestId: z.string().min(1),
  stemContent: z.string().trim().min(1, "Teks soal wajib diisi"),
  imageUrl: z.string().nullable().optional(),
  weight: z.number().int().positive().default(1),
  explanation: z.string().nullable().optional(),
  correctLabel: z.enum(["A", "B", "C", "D", "E"]),
  choices: z.object({
    A: z.string().min(1),
    B: z.string().min(1),
    C: z.string().min(1),
    D: z.string().min(1),
    E: z.string().min(1),
  }),
});

export async function POST(req: Request) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const parsed = createQuestionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Data soal tidak valid" },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const count = await prisma.question.count({
      where: { packageId: d.packageId, subtestId: d.subtestId },
    });

    const created = await prisma.question.create({
      data: {
        packageId: d.packageId,
        subtestId: d.subtestId,
        orderNo: count + 1,
        stemContent: d.stemContent,
        imageUrl: d.imageUrl || null,
        weight: d.weight,
        explanation: d.explanation || null,
        choices: {
          create: (["A", "B", "C", "D", "E"] as const).map((label) => ({
            label,
            content: d.choices[label],
            isCorrect: d.correctLabel === label,
          })),
        },
      },
      include: {
        tryoutPackage: { select: { id: true, slug: true, title: true } },
        subtest: { select: { id: true, code: true, title: true } },
        choices: { orderBy: { label: "asc" } },
      },
    });

    return NextResponse.json({ question: created }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/v1/admin/questions] Error:", error);
    return NextResponse.json({ error: "Gagal menambah soal" }, { status: 500 });
  }
}

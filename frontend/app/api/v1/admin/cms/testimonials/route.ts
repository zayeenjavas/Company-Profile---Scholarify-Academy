import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/src/server/auth/guards";
import { sanityFetch, sanityMutate } from "@/src/server/services/sanity.service";

export async function GET(req: Request) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const testimonials = await sanityFetch(
      '*[_type == "testimonial"] { _id, nama, asalKampus, isi, rating, "fotoUrl": foto.asset->url }'
    );
    return NextResponse.json({ testimonials });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal memuat testimoni" }, { status: 500 });
  }
}

const testimonialSchema = z.object({
  nama: z.string().trim().min(1),
  asalKampus: z.string().trim().min(1),
  isi: z.string().trim().min(1),
  rating: z.number().int().min(1).max(5).default(5),
  fotoAssetId: z.string().optional(),
});

export async function POST(req: Request) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const parsed = testimonialSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Data testimoni tidak valid" }, { status: 400 });
    }
    const d = parsed.data;
    const doc: Record<string, unknown> = {
      _type: "testimonial",
      nama: d.nama,
      asalKampus: d.asalKampus,
      isi: d.isi,
      rating: d.rating,
    };
    if (d.fotoAssetId) {
      doc.foto = { _type: "image", asset: { _type: "reference", _ref: d.fotoAssetId } };
    }
    const res = await sanityMutate([{ create: doc }]);
    return NextResponse.json({ ok: true, result: res }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menambah testimoni" }, { status: 500 });
  }
}

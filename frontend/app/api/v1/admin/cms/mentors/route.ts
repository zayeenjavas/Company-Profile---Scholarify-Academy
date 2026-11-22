import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/src/server/auth/guards";
import { sanityFetch, sanityMutate } from "@/src/server/services/sanity.service";

export async function GET(req: Request) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const mentors = await sanityFetch(
      '*[_type == "mentor"] | order(urutan asc) { _id, nama, jabatan, kampus, kategori, urutan, "fotoUrl": foto.asset->url, "logoKampusUrl": logoKampus.asset->url }'
    );
    return NextResponse.json({ mentors });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal memuat mentor" }, { status: 500 });
  }
}

const mentorSchema = z.object({
  nama: z.string().trim().min(1),
  jabatan: z.string().trim().min(1),
  kampus: z.string().trim().min(1),
  kategori: z.enum(["tim-inti", "tim-mentor"]).default("tim-mentor"),
  urutan: z.number().int().default(1),
  fotoAssetId: z.string().optional(),
  logoKampusAssetId: z.string().optional(),
});

export async function POST(req: Request) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const parsed = mentorSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Data mentor tidak valid" }, { status: 400 });
    }
    const d = parsed.data;
    const doc: Record<string, unknown> = {
      _type: "mentor",
      nama: d.nama,
      jabatan: d.jabatan,
      kampus: d.kampus,
      kategori: d.kategori,
      urutan: d.urutan,
    };
    if (d.fotoAssetId) {
      doc.foto = { _type: "image", asset: { _type: "reference", _ref: d.fotoAssetId } };
    }
    if (d.logoKampusAssetId) {
      doc.logoKampus = { _type: "image", asset: { _type: "reference", _ref: d.logoKampusAssetId } };
    }

    const res = await sanityMutate([{ create: doc }]);
    return NextResponse.json({ ok: true, result: res }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menambah mentor" }, { status: 500 });
  }
}

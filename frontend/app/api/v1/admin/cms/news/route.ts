import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/src/server/auth/guards";
import {
  sanityFetch,
  sanityMutate,
  textToPortableBlocks,
} from "@/src/server/services/sanity.service";

export async function GET(req: Request) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const news = await sanityFetch(
      '*[_type == "news"] | order(tanggal desc) { _id, judul, ringkasan, isiLengkap, tanggal, urutan, "gambarUrl": gambar.asset->url }'
    );
    return NextResponse.json({ news });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal memuat berita" }, { status: 500 });
  }
}

const newsSchema = z.object({
  judul: z.string().trim().min(1),
  ringkasan: z.string().trim().min(1),
  isiLengkap: z.union([z.string(), z.array(z.record(z.string(), z.unknown()))]).optional().default(""),
  tanggal: z.string().min(1),
  urutan: z.number().int().default(1),
  gambarAssetId: z.string().optional(),
});

export async function POST(req: Request) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const parsed = newsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Data berita tidak valid" }, { status: 400 });
    }
    const d = parsed.data;
    const doc: Record<string, unknown> = {
      _type: "news",
      judul: d.judul,
      ringkasan: d.ringkasan,
      isiLengkap: textToPortableBlocks(d.isiLengkap),
      tanggal: d.tanggal,
      urutan: d.urutan,
    };
    if (d.gambarAssetId) {
      doc.gambar = { _type: "image", asset: { _type: "reference", _ref: d.gambarAssetId } };
    }
    const res = await sanityMutate([{ create: doc }]);
    return NextResponse.json({ ok: true, result: res }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menambah berita" }, { status: 500 });
  }
}

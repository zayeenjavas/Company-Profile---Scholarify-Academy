import { NextResponse } from "next/server";
import { requireRole } from "@/src/server/auth/guards";
import {
  sanityMutate,
  textToPortableBlocks,
} from "@/src/server/services/sanity.service";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const { id } = await context.params;
    const body = await req.json();
    const setFields: Record<string, unknown> = {};
    if (body.judul !== undefined) setFields.judul = body.judul;
    if (body.ringkasan !== undefined) setFields.ringkasan = body.ringkasan;
    if (body.isiLengkap !== undefined) setFields.isiLengkap = textToPortableBlocks(body.isiLengkap);
    if (body.tanggal !== undefined) setFields.tanggal = body.tanggal;
    if (body.urutan !== undefined) setFields.urutan = Number(body.urutan);
    if (body.gambarAssetId) {
      setFields.gambar = { _type: "image", asset: { _type: "reference", _ref: body.gambarAssetId } };
    }
    const res = await sanityMutate([{ patch: { id, set: setFields } }]);
    return NextResponse.json({ ok: true, result: res });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal memperbarui berita" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const { id } = await context.params;
    const res = await sanityMutate([{ delete: { id } }]);
    return NextResponse.json({ ok: true, result: res });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menghapus berita" }, { status: 500 });
  }
}

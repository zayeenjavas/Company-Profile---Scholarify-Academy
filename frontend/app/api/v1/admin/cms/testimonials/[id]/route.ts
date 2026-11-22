import { NextResponse } from "next/server";
import { requireRole } from "@/src/server/auth/guards";
import { sanityMutate } from "@/src/server/services/sanity.service";

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
    if (body.nama !== undefined) setFields.nama = body.nama;
    if (body.asalKampus !== undefined) setFields.asalKampus = body.asalKampus;
    if (body.isi !== undefined) setFields.isi = body.isi;
    if (body.rating !== undefined) setFields.rating = Number(body.rating);
    if (body.fotoAssetId) {
      setFields.foto = { _type: "image", asset: { _type: "reference", _ref: body.fotoAssetId } };
    }
    const res = await sanityMutate([{ patch: { id, set: setFields } }]);
    return NextResponse.json({ ok: true, result: res });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal memperbarui testimoni" }, { status: 500 });
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
    return NextResponse.json({ error: err.message || "Gagal menghapus testimoni" }, { status: 500 });
  }
}

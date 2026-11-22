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
    if (body.jabatan !== undefined) setFields.jabatan = body.jabatan;
    if (body.kampus !== undefined) setFields.kampus = body.kampus;
    if (body.kategori !== undefined) setFields.kategori = body.kategori;
    if (body.urutan !== undefined) setFields.urutan = Number(body.urutan);
    if (body.fotoAssetId) {
      setFields.foto = { _type: "image", asset: { _type: "reference", _ref: body.fotoAssetId } };
    }
    if (body.logoKampusAssetId) {
      setFields.logoKampus = { _type: "image", asset: { _type: "reference", _ref: body.logoKampusAssetId } };
    }

    const res = await sanityMutate([{ patch: { id, set: setFields } }]);
    return NextResponse.json({ ok: true, result: res });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal memperbarui mentor" }, { status: 500 });
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
    return NextResponse.json({ error: err.message || "Gagal menghapus mentor" }, { status: 500 });
  }
}

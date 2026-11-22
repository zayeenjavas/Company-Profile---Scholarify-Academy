import { NextResponse } from "next/server";
import { requireRole } from "@/src/server/auth/guards";
import { uploadSanityImage } from "@/src/server/services/sanity.service";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: Request) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "File gambar wajib dikirim" }, { status: 400 });
    }
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Format gambar harus JPG, PNG, WebP, GIF, atau AVIF" },
        { status: 400 }
      );
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Ukuran gambar maksimal 5 MB" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const uploaded = await uploadSanityImage(buffer, file.type);
    return NextResponse.json({
      ok: true,
      assetId: uploaded?.document?._id,
      url: uploaded?.document?.url,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal mengunggah gambar" }, { status: 500 });
  }
}

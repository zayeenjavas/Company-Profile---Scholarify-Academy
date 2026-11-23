import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/src/server/db";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80),
  email: z.string().trim().email("Format email tidak valid").max(120),
  subject: z.string().trim().min(2, "Subjek wajib diisi").max(120),
  message: z.string().trim().min(5, "Pesan minimal 5 karakter").max(2000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Form belum lengkap" },
        { status: 400 }
      );
    }

    const lead = await prisma.contactLead.create({
      data: parsed.data,
    });

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/v1/contact] Error:", error);
    return NextResponse.json({ error: "Gagal mengirim pesan" }, { status: 500 });
  }
}

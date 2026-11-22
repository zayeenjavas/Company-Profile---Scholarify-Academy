import { NextResponse } from "next/server";
import { requireAuth } from "@/src/server/auth/guards";
import { serializeUserDto } from "@/src/server/services/dtoSerializer";

export async function GET(req: Request) {
  const { user, errorResponse } = await requireAuth(req);
  if (errorResponse || !user) return errorResponse!;

  return NextResponse.json({
    ok: true,
    user: serializeUserDto(user),
  });
}

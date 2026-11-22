import { NextResponse } from "next/server";
import { getAuthUser } from "@/src/server/auth/guards";

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ ok: false });
  }

  return NextResponse.json({
    ok: true,
    user: {
      username: user.username,
      name: user.name,
      role: user.role,
    },
  });
}

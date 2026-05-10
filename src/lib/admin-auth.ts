import { NextRequest, NextResponse } from "next/server";

export function adminAuth(request: NextRequest): NextResponse | null {
  const token = request.headers.get("x-admin-token")
    || request.cookies.get("admin_token")?.value;

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

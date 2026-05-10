import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminAuth } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const authError = adminAuth(request);
  if (authError) return authError;

  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const studio = await prisma.studio.findUnique({
    where: { slug },
    include: {
      classes: { orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] },
    },
  });

  if (!studio) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(studio);
}

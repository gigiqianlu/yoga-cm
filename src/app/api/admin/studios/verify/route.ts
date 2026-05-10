import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminAuth } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const authError = adminAuth(request);
  if (authError) return authError;

  const { studioId } = await request.json();
  if (!studioId) return NextResponse.json({ error: "studioId required" }, { status: 400 });

  const studio = await prisma.studio.update({
    where: { id: studioId },
    data: { lastVerifiedAt: new Date().toISOString() },
  });

  return NextResponse.json(studio);
}

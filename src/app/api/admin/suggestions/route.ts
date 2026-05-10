import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminAuth } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const authError = adminAuth(request);
  if (authError) return authError;

  const status = request.nextUrl.searchParams.get("status") || "pending";
  const suggestions = await prisma.suggestion.findMany({
    where: { status },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(suggestions);
}

export async function PUT(request: NextRequest) {
  const authError = adminAuth(request);
  if (authError) return authError;

  const body = await request.json();
  const { id, status: newStatus, adminNotes } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const suggestion = await prisma.suggestion.update({
    where: { id },
    data: { status: newStatus, adminNotes },
  });
  return NextResponse.json(suggestion);
}

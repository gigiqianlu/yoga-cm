import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminAuth } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const authError = adminAuth(request);
  if (authError) return authError;

  const studios = await prisma.studio.findMany({
    include: { _count: { select: { classes: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(studios);
}

export async function POST(request: NextRequest) {
  const authError = adminAuth(request);
  if (authError) return authError;

  const body = await request.json();
  const studio = await prisma.studio.create({ data: body });
  return NextResponse.json(studio, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const authError = adminAuth(request);
  if (authError) return authError;

  const body = await request.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const studio = await prisma.studio.update({ where: { id }, data });
  return NextResponse.json(studio);
}

export async function DELETE(request: NextRequest) {
  const authError = adminAuth(request);
  if (authError) return authError;

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.studio.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

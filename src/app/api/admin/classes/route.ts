import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminAuth } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const authError = adminAuth(request);
  if (authError) return authError;

  const studioId = request.nextUrl.searchParams.get("studioId");
  const status = request.nextUrl.searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (studioId) where.studioId = studioId;
  if (status) where.status = status;

  const classes = await prisma.yogaClass.findMany({
    where,
    include: { studio: { select: { name: true, slug: true } } },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });
  return NextResponse.json(classes);
}

export async function POST(request: NextRequest) {
  const authError = adminAuth(request);
  if (authError) return authError;

  const body = await request.json();
  const cls = await prisma.yogaClass.create({ data: { ...body, source: "manual", status: "live" } });
  return NextResponse.json(cls, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const authError = adminAuth(request);
  if (authError) return authError;

  const body = await request.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const cls = await prisma.yogaClass.update({ where: { id }, data });
  return NextResponse.json(cls);
}

export async function DELETE(request: NextRequest) {
  const authError = adminAuth(request);
  if (authError) return authError;

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.yogaClass.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

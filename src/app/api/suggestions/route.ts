import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  // Honeypot spam check
  const body = await request.json();
  if (body._hp) return NextResponse.json({ ok: true }); // bot filled honeypot

  const { type, targetStudioId, targetClassId, data, submitterContact } = body;

  if (!type || !data) {
    return NextResponse.json({ error: "type and data are required" }, { status: 400 });
  }

  const suggestion = await prisma.suggestion.create({
    data: {
      type,
      targetStudioId: targetStudioId || null,
      targetClassId: targetClassId || null,
      data: typeof data === "string" ? data : JSON.stringify(data),
      submitterContact: submitterContact || null,
    },
  });

  return NextResponse.json({ ok: true, id: suggestion.id }, { status: 201 });
}

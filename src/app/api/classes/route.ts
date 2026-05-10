import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const style = searchParams.get("style");
  const studioId = searchParams.get("studioId");
  const dayOfWeek = searchParams.get("dayOfWeek");
  const timeSlot = searchParams.get("timeSlot");

  const where: Record<string, unknown> = { isActive: true, status: "live" };

  if (style) where.style = style;
  if (studioId) where.studioId = studioId;
  if (dayOfWeek !== null && dayOfWeek !== undefined && dayOfWeek !== "") {
    where.dayOfWeek = parseInt(dayOfWeek);
  }

  // Time slot filtering
  if (timeSlot === "morning") {
    where.startTime = { gte: "05:00", lt: "12:00" };
  } else if (timeSlot === "afternoon") {
    where.startTime = { gte: "12:00", lt: "17:00" };
  } else if (timeSlot === "evening") {
    where.startTime = { gte: "17:00", lt: "22:00" };
  }

  const classes = await prisma.yogaClass.findMany({
    where,
    include: {
      studio: {
        select: { id: true, name: true, slug: true, location: true, logoUrl: true },
      },
    },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return NextResponse.json(classes);
}

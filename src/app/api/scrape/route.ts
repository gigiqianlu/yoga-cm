import { NextResponse } from "next/server";
import { runAllScrapers } from "@/lib/scrapers/registry";

export async function POST() {
  try {
    const results = await runAllScrapers();
    return NextResponse.json(results);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scrape failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

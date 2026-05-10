import * as cheerio from "cheerio";
import { BaseScraper, ScrapedClass } from "./base";

export class WebsiteScraper extends BaseScraper {
  studioSlug: string;
  private url: string;

  constructor(studioSlug: string, url: string) {
    super();
    this.studioSlug = studioSlug;
    this.url = url;
  }

  async scrape(): Promise<ScrapedClass[]> {
    try {
      const response = await fetch(this.url);
      const html = await response.text();
      const $ = cheerio.load(html);
      const classes: ScrapedClass[] = [];

      // Generic schedule extraction — looks for common patterns
      // Each studio may need custom selectors; this is a best-effort default
      $("table tr, .schedule-item, .class-item, [class*='schedule'], [class*='class']").each(
        (_i, el) => {
          const text = $(el).text().trim();
          if (!text || text.length < 5) return;

          const parsed = this.parseClassText(text);
          if (parsed) {
            classes.push({ ...parsed, sourceUrl: this.url, rawText: text });
          }
        }
      );

      return classes;
    } catch (error) {
      console.error(`Error scraping ${this.url}:`, error);
      return [];
    }
  }

  private parseClassText(text: string): Partial<ScrapedClass> & { title: string; style: string; dayOfWeek: number; startTime: string } | null {
    // Try to extract time pattern like "09:00" or "9:00 AM"
    const timeMatch = text.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
    if (!timeMatch) return null;

    let hour = parseInt(timeMatch[1]);
    const minute = timeMatch[2];
    if (timeMatch[3]?.toLowerCase() === "pm" && hour < 12) hour += 12;
    if (timeMatch[3]?.toLowerCase() === "am" && hour === 12) hour = 0;
    const startTime = `${hour.toString().padStart(2, "0")}:${minute}`;

    // Try to identify the yoga style from text
    const styles = ["vinyasa", "hatha", "yin", "ashtanga", "restorative", "power", "kundalini", "flow", "stretch", "meditation", "breathwork", "hot yoga", "prenatal"];
    const foundStyle = styles.find((s) => text.toLowerCase().includes(s));
    const style = foundStyle ? foundStyle.charAt(0).toUpperCase() + foundStyle.slice(1) : "Mixed";

    // Try to identify day of week
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const foundDay = days.findIndex((d) => text.toLowerCase().includes(d));
    const dayOfWeek = foundDay >= 0 ? foundDay : new Date().getDay();

    // Use the first meaningful portion as the title
    const title = text.split(/[\n\r]/).filter((l) => l.trim())[0]?.trim().slice(0, 80) || `${style} Yoga`;

    return { title, style, dayOfWeek, startTime };
  }
}

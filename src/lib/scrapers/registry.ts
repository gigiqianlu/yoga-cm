import { BaseScraper, ScrapedClass } from "./base";

// Scraper registry — add new scrapers here
const scrapers: BaseScraper[] = [];

export function registerScraper(scraper: BaseScraper) {
  scrapers.push(scraper);
}

export function getScrapers(): BaseScraper[] {
  return scrapers;
}

export async function runAllScrapers(): Promise<{
  results: { studio: string; classesFound: number; error?: string }[];
}> {
  const results = [];

  for (const scraper of scrapers) {
    try {
      const classes: ScrapedClass[] = await scraper.scrape();
      const count = await scraper.saveClasses(classes);
      results.push({ studio: scraper.studioSlug, classesFound: count });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      results.push({ studio: scraper.studioSlug, classesFound: 0, error: message });
    }
  }

  return { results };
}

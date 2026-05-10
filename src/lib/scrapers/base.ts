import { prisma } from "../db";

export interface ScrapedClass {
  title: string;
  style: string;
  instructor?: string;
  dayOfWeek: number;
  startTime: string;
  endTime?: string;
  durationMin?: number;
  priceTHB?: number;
  dropInPriceTHB?: number;
  locationDetail?: string;
  sourceUrl?: string;
  rawText?: string;
}

export abstract class BaseScraper {
  abstract studioSlug: string;
  abstract scrape(): Promise<ScrapedClass[]>;

  async saveClasses(classes: ScrapedClass[]) {
    const studio = await prisma.studio.findUnique({
      where: { slug: this.studioSlug },
    });
    if (!studio) {
      console.error(`Studio not found: ${this.studioSlug}`);
      return 0;
    }

    // Deactivate old classes from this studio
    await prisma.yogaClass.updateMany({
      where: { studioId: studio.id },
      data: { isActive: false },
    });

    let count = 0;
    for (const cls of classes) {
      await prisma.yogaClass.upsert({
        where: {
          id: `${studio.id}-${cls.dayOfWeek}-${cls.startTime}-${cls.style}`,
        },
        create: {
          id: `${studio.id}-${cls.dayOfWeek}-${cls.startTime}-${cls.style}`,
          studioId: studio.id,
          title: cls.title,
          style: cls.style,
          instructor: cls.instructor,
          dayOfWeek: cls.dayOfWeek,
          startTime: cls.startTime,
          endTime: cls.endTime,
          durationMin: cls.durationMin,
          priceTHB: cls.priceTHB,
          dropInPriceTHB: cls.dropInPriceTHB,
          locationDetail: cls.locationDetail,
          sourceUrl: cls.sourceUrl,
          rawText: cls.rawText,
          isActive: true,
          lastScrapedAt: new Date(),
        },
        update: {
          title: cls.title,
          style: cls.style,
          instructor: cls.instructor,
          endTime: cls.endTime,
          durationMin: cls.durationMin,
          priceTHB: cls.priceTHB,
          dropInPriceTHB: cls.dropInPriceTHB,
          locationDetail: cls.locationDetail,
          sourceUrl: cls.sourceUrl,
          rawText: cls.rawText,
          isActive: true,
          lastScrapedAt: new Date(),
        },
      });
      count++;
    }
    return count;
  }
}

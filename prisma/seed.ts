import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import "dotenv/config";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) throw new Error("TURSO_DATABASE_URL is not set");

const adapter = new PrismaLibSql({ url, authToken });
const prisma = new PrismaClient({ adapter });

const studios = [
  {
    name: "Wild Rose Yoga",
    slug: "wild-rose",
    description: "Intimate boutique studio in the Old City with small class sizes and personalized instruction. Sound healing integration in many sessions. Pre-booking required via WhatsApp.",
    location: "Old City, Chiang Mai",
    latitude: 18.7883,
    longitude: 98.9853,
    instagramUrl: "https://instagram.com/wildroseyogachiangmai",
    facebookUrl: "https://facebook.com/wildroseyogachiangmai",
    websiteUrl: "https://www.wildroseyoga.org",
    phone: "+66 899509377",
    logoUrl: null,
  },
  {
    name: "Yoga Ananda",
    slug: "yoga-ananda",
    description: "Popular Nimman studio with experienced Thai instructors. Classes for all levels from beginner to advanced. Reservation required 1–2 days in advance.",
    location: "Nimmanhaemin, Chiang Mai",
    latitude: 18.7981,
    longitude: 98.9673,
    instagramUrl: "https://instagram.com/yogaanandachiangmai",
    facebookUrl: "https://facebook.com/yogaanandachiangmai",
    websiteUrl: "https://www.yogaananda.net",
    logoUrl: null,
  },
  {
    name: "Chiang Mai Holistic",
    slug: "cm-holistic",
    description: "Wellness center offering yoga, Qi Gong, sound baths, meditation, and trauma-informed practices. First class 150 THB promo.",
    location: "Nimmanhaemin, Chiang Mai",
    latitude: 18.7990,
    longitude: 98.9680,
    instagramUrl: "https://instagram.com/chiangmaiholistic",
    facebookUrl: "https://facebook.com/chiangmaiholistic",
    websiteUrl: "https://www.chiangmaiholistic.com",
    logoUrl: null,
  },
  {
    name: "Freedom Yoga",
    slug: "freedom-yoga",
    description: "Beautiful open-air studio in a historic wooden house near Old Town. Welcoming community for all levels. Walk-ins accepted, but advance booking recommended.",
    location: "Central Chiang Mai",
    latitude: 18.8024,
    longitude: 98.9782,
    instagramUrl: "https://instagram.com/freedomyogacm",
    facebookUrl: "https://facebook.com/freedomyogacm",
    websiteUrl: "https://freedomyogachiangmai.org",
    phone: "+66 803855851",
    logoUrl: null,
  },
  {
    name: "Chiangmai Yoga Studio",
    slug: "cm-yoga-studio",
    description: "Friendly Old City studio with daily classes in English. Hatha, Yin Therapy, Vinyasa, and more. All levels welcome, no experience needed.",
    location: "Old City, Chiang Mai",
    latitude: 18.7870,
    longitude: 98.9860,
    instagramUrl: null,
    facebookUrl: null,
    websiteUrl: "https://www.chiangmaiyogastudio.com",
    logoUrl: null,
  },
];

// Real class data sourced from studio websites and schedules (May 2026)
const sampleClasses = [
  // ── Wild Rose Yoga ──
  // Mon
  { studioSlug: "wild-rose", title: "Yin Yoga Flow", style: "Yin", instructor: "Kru Annie", dayOfWeek: 1, startTime: "10:00", endTime: "11:30", durationMin: 90, dropInPriceTHB: 350 },
  { studioSlug: "wild-rose", title: "Hatha Vinyasa", style: "Hatha", instructor: "Kru Anisara", dayOfWeek: 1, startTime: "14:00", endTime: "15:30", durationMin: 90, dropInPriceTHB: 350 },
  { studioSlug: "wild-rose", title: "Hatha Vinyasa (Beginner-friendly)", style: "Hatha", instructor: "Kru Anisara", dayOfWeek: 1, startTime: "17:00", endTime: "18:30", durationMin: 90, dropInPriceTHB: 350 },
  // Tue
  { studioSlug: "wild-rose", title: "All-Levels Vinyasa", style: "Vinyasa", instructor: "Kru May", dayOfWeek: 2, startTime: "10:00", endTime: "11:30", durationMin: 90, dropInPriceTHB: 350 },
  { studioSlug: "wild-rose", title: "Gentle Hatha & Sound Bath", style: "Hatha", instructor: "Kru Ta", dayOfWeek: 2, startTime: "14:00", endTime: "15:30", durationMin: 90, dropInPriceTHB: 400 },
  { studioSlug: "wild-rose", title: "Yin Yoga & Sound Healing", style: "Yin", instructor: "Kru Annie", dayOfWeek: 2, startTime: "17:00", endTime: "18:30", durationMin: 90, dropInPriceTHB: 400 },
  // Wed
  { studioSlug: "wild-rose", title: "Slow Flow & Sound Bowl", style: "Flow", instructor: "Kru Chayada", dayOfWeek: 3, startTime: "10:00", endTime: "11:30", durationMin: 90, dropInPriceTHB: 400 },
  { studioSlug: "wild-rose", title: "Yin Yoga & Tibetan Sound Bowls", style: "Yin", instructor: "Kru Chayada", dayOfWeek: 3, startTime: "14:00", endTime: "15:30", durationMin: 90, dropInPriceTHB: 400 },
  { studioSlug: "wild-rose", title: "Gentle Hatha & Sound Bath", style: "Hatha", instructor: "Kru Ta", dayOfWeek: 3, startTime: "17:00", endTime: "18:30", durationMin: 90, dropInPriceTHB: 400 },
  // Thu
  { studioSlug: "wild-rose", title: "All-Levels Vinyasa", style: "Vinyasa", instructor: "Kru May", dayOfWeek: 4, startTime: "10:00", endTime: "11:30", durationMin: 90, dropInPriceTHB: 350 },
  { studioSlug: "wild-rose", title: "Stretch & Flow", style: "Flow", instructor: "Kru May", dayOfWeek: 4, startTime: "14:00", endTime: "15:30", durationMin: 90, dropInPriceTHB: 350 },
  { studioSlug: "wild-rose", title: "Hatha Vinyasa (Beginner-friendly)", style: "Hatha", instructor: "Kru Anisara", dayOfWeek: 4, startTime: "17:00", endTime: "18:30", durationMin: 90, dropInPriceTHB: 350 },
  // Fri
  { studioSlug: "wild-rose", title: "Vinyasa Flow Multi Level", style: "Vinyasa", instructor: "Kru Annie", dayOfWeek: 5, startTime: "10:00", endTime: "11:30", durationMin: 90, dropInPriceTHB: 350 },
  { studioSlug: "wild-rose", title: "Hatha Vinyasa", style: "Hatha", instructor: "Kru Anisara", dayOfWeek: 5, startTime: "14:00", endTime: "15:30", durationMin: 90, dropInPriceTHB: 350 },
  { studioSlug: "wild-rose", title: "Stretch & Flow", style: "Flow", instructor: "Kru May", dayOfWeek: 5, startTime: "17:00", endTime: "18:30", durationMin: 90, dropInPriceTHB: 350 },
  // Sat
  { studioSlug: "wild-rose", title: "All-Levels Vinyasa", style: "Vinyasa", instructor: "Kru May", dayOfWeek: 6, startTime: "10:00", endTime: "11:30", durationMin: 90, dropInPriceTHB: 350 },
  { studioSlug: "wild-rose", title: "All-Levels Vinyasa", style: "Vinyasa", instructor: "Kru May", dayOfWeek: 6, startTime: "12:30", endTime: "14:00", durationMin: 90, dropInPriceTHB: 350 },
  // Sun
  { studioSlug: "wild-rose", title: "Dynamic Vinyasa Flow (Intermediate)", style: "Vinyasa", instructor: "Kru Annie", dayOfWeek: 0, startTime: "10:00", endTime: "11:30", durationMin: 90, dropInPriceTHB: 350 },
  { studioSlug: "wild-rose", title: "All-Levels Vinyasa", style: "Vinyasa", instructor: "Kru May", dayOfWeek: 0, startTime: "12:30", endTime: "14:00", durationMin: 90, dropInPriceTHB: 350 },
  { studioSlug: "wild-rose", title: "Gentle Hatha & Sound Bath", style: "Hatha", instructor: "Kru Ta", dayOfWeek: 0, startTime: "14:00", endTime: "15:30", durationMin: 90, dropInPriceTHB: 400 },
  { studioSlug: "wild-rose", title: "Stretch & Flow", style: "Flow", instructor: "Kru May", dayOfWeek: 0, startTime: "16:30", endTime: "18:00", durationMin: 90, dropInPriceTHB: 350 },
  { studioSlug: "wild-rose", title: "Hatha Vinyasa (Beginner-friendly)", style: "Hatha", instructor: "Kru Anisara", dayOfWeek: 0, startTime: "17:00", endTime: "18:30", durationMin: 90, dropInPriceTHB: 350 },

  // ── Yoga Ananda (Nimman) ──
  // Mon
  { studioSlug: "yoga-ananda", title: "Gentle Flow (B)", style: "Flow", instructor: "Kru Nok", dayOfWeek: 1, startTime: "09:00", endTime: "10:00", durationMin: 60, dropInPriceTHB: 350 },
  { studioSlug: "yoga-ananda", title: "Stretching (B)", style: "Stretch", instructor: "Kru Biw", dayOfWeek: 1, startTime: "10:30", endTime: "11:30", durationMin: 60, dropInPriceTHB: 350 },
  { studioSlug: "yoga-ananda", title: "Flexibility/Balance Flow (I, A)", style: "Flow", instructor: "Kru Nok", dayOfWeek: 1, startTime: "17:15", endTime: "18:15", durationMin: 60, dropInPriceTHB: 350 },
  { studioSlug: "yoga-ananda", title: "Deep Stretching (B)", style: "Stretch", instructor: "Kru Menny", dayOfWeek: 1, startTime: "18:30", endTime: "19:30", durationMin: 60, dropInPriceTHB: 350 },
  // Tue
  { studioSlug: "yoga-ananda", title: "Core Foundation (B)", style: "Hatha", instructor: "Kru Menny", dayOfWeek: 2, startTime: "09:00", endTime: "10:00", durationMin: 60, dropInPriceTHB: 350 },
  { studioSlug: "yoga-ananda", title: "Power Vinyasa (I, A)", style: "Power", instructor: "Kru Menny", dayOfWeek: 2, startTime: "17:15", endTime: "18:15", durationMin: 60, dropInPriceTHB: 350 },
  { studioSlug: "yoga-ananda", title: "Moon Flow (B)", style: "Flow", instructor: "Kru Menny", dayOfWeek: 2, startTime: "18:30", endTime: "19:30", durationMin: 60, dropInPriceTHB: 350 },
  // Wed
  { studioSlug: "yoga-ananda", title: "Vinyasa Flow (B, I)", style: "Vinyasa", instructor: "Kru Menny", dayOfWeek: 3, startTime: "09:00", endTime: "10:00", durationMin: 60, dropInPriceTHB: 350 },
  { studioSlug: "yoga-ananda", title: "Ashtanga Modified (I, A)", style: "Ashtanga", instructor: "Kru Nok", dayOfWeek: 3, startTime: "17:15", endTime: "18:15", durationMin: 60, dropInPriceTHB: 350 },
  { studioSlug: "yoga-ananda", title: "Deep Stretching (B)", style: "Stretch", instructor: "Kru Nok", dayOfWeek: 3, startTime: "18:30", endTime: "19:30", durationMin: 60, dropInPriceTHB: 350 },
  // Thu
  { studioSlug: "yoga-ananda", title: "Vinyasa Upper Body (B, I)", style: "Vinyasa", instructor: "Kru Menny", dayOfWeek: 4, startTime: "17:15", endTime: "18:15", durationMin: 60, dropInPriceTHB: 350 },
  { studioSlug: "yoga-ananda", title: "Healthy Move (B)", style: "Hatha", instructor: "Kru Menny", dayOfWeek: 4, startTime: "18:30", endTime: "19:30", durationMin: 60, dropInPriceTHB: 350 },
  // Fri
  { studioSlug: "yoga-ananda", title: "Sun Series (B)", style: "Hatha", instructor: "Kru Nok", dayOfWeek: 5, startTime: "09:00", endTime: "10:00", durationMin: 60, dropInPriceTHB: 350 },
  { studioSlug: "yoga-ananda", title: "Core Vinyasa (I, A)", style: "Vinyasa", instructor: "Kru Menny", dayOfWeek: 5, startTime: "17:15", endTime: "18:15", durationMin: 60, dropInPriceTHB: 350 },
  // Sat
  { studioSlug: "yoga-ananda", title: "Vinyasa Flow (B, I)", style: "Vinyasa", instructor: "Kru Biw", dayOfWeek: 6, startTime: "09:00", endTime: "10:00", durationMin: 60, dropInPriceTHB: 350 },
  // Sun
  { studioSlug: "yoga-ananda", title: "Yin Yoga (B)", style: "Yin", instructor: "Kru Menny", dayOfWeek: 0, startTime: "09:00", endTime: "10:00", durationMin: 60, dropInPriceTHB: 350 },

  // ── Chiang Mai Holistic ──
  // Mon
  { studioSlug: "cm-holistic", title: "Qi Gong", style: "Mixed", instructor: null, dayOfWeek: 1, startTime: "09:30", endTime: "10:45", durationMin: 75, dropInPriceTHB: 400 },
  { studioSlug: "cm-holistic", title: "Yin Yoga and Sound", style: "Yin", instructor: null, dayOfWeek: 1, startTime: "18:00", endTime: "19:15", durationMin: 75, dropInPriceTHB: 450 },
  // Tue
  { studioSlug: "cm-holistic", title: "Yoga Nidra & Mixed Sound Bath", style: "Restorative", instructor: null, dayOfWeek: 2, startTime: "13:00", endTime: "14:00", durationMin: 60, dropInPriceTHB: 300 },
  { studioSlug: "cm-holistic", title: "Mixed Sound Bath", style: "Meditation", instructor: null, dayOfWeek: 2, startTime: "19:00", endTime: "20:00", durationMin: 60, dropInPriceTHB: 150 },
  // Wed
  { studioSlug: "cm-holistic", title: "Vinyasa Yoga", style: "Vinyasa", instructor: null, dayOfWeek: 3, startTime: "09:30", endTime: "11:00", durationMin: 90, dropInPriceTHB: 300 },
  // Thu
  { studioSlug: "cm-holistic", title: "Restorative Flow Yoga", style: "Restorative", instructor: null, dayOfWeek: 4, startTime: "09:30", endTime: "10:45", durationMin: 75, dropInPriceTHB: 400 },
  { studioSlug: "cm-holistic", title: "Tibetan Bowls Sound Bath", style: "Meditation", instructor: null, dayOfWeek: 4, startTime: "19:30", endTime: "20:30", durationMin: 60, dropInPriceTHB: 150 },
  // Fri
  { studioSlug: "cm-holistic", title: "Vinyasa Yoga", style: "Vinyasa", instructor: null, dayOfWeek: 5, startTime: "09:30", endTime: "11:00", durationMin: 90, dropInPriceTHB: 300 },
  { studioSlug: "cm-holistic", title: "Pranayama", style: "Breathwork", instructor: null, dayOfWeek: 5, startTime: "17:00", endTime: "19:00", durationMin: 120, dropInPriceTHB: 400 },
  // Sat
  { studioSlug: "cm-holistic", title: "Hatha Yoga & Sound Bath", style: "Hatha", instructor: null, dayOfWeek: 6, startTime: "09:30", endTime: "11:00", durationMin: 90, dropInPriceTHB: 350 },
  { studioSlug: "cm-holistic", title: "Dance Mandala", style: "Mixed", instructor: null, dayOfWeek: 6, startTime: "18:00", endTime: "19:45", durationMin: 105, dropInPriceTHB: 300 },
  // Sun
  { studioSlug: "cm-holistic", title: "Crystal Bowls Sound Bath", style: "Meditation", instructor: null, dayOfWeek: 0, startTime: "19:30", endTime: "20:30", durationMin: 60, dropInPriceTHB: 150 },

  // ── Freedom Yoga ──
  // Daily classes (Mon–Sat), times vary. Best-effort from research.
  { studioSlug: "freedom-yoga", title: "Morning Vinyasa", style: "Vinyasa", instructor: null, dayOfWeek: 1, startTime: "08:00", endTime: "09:15", durationMin: 75, dropInPriceTHB: 350 },
  { studioSlug: "freedom-yoga", title: "Evening Flow", style: "Vinyasa", instructor: null, dayOfWeek: 1, startTime: "18:00", endTime: "19:15", durationMin: 75, dropInPriceTHB: 350 },
  { studioSlug: "freedom-yoga", title: "Morning Hatha", style: "Hatha", instructor: null, dayOfWeek: 2, startTime: "08:00", endTime: "09:15", durationMin: 75, dropInPriceTHB: 350 },
  { studioSlug: "freedom-yoga", title: "Power Flow", style: "Power", instructor: null, dayOfWeek: 2, startTime: "18:00", endTime: "19:15", durationMin: 75, dropInPriceTHB: 350 },
  { studioSlug: "freedom-yoga", title: "Morning Vinyasa", style: "Vinyasa", instructor: null, dayOfWeek: 3, startTime: "08:00", endTime: "09:15", durationMin: 75, dropInPriceTHB: 350 },
  { studioSlug: "freedom-yoga", title: "Yin Yoga", style: "Yin", instructor: null, dayOfWeek: 3, startTime: "18:00", endTime: "19:15", durationMin: 75, dropInPriceTHB: 350 },
  { studioSlug: "freedom-yoga", title: "Morning Hatha", style: "Hatha", instructor: null, dayOfWeek: 4, startTime: "08:00", endTime: "09:15", durationMin: 75, dropInPriceTHB: 350 },
  { studioSlug: "freedom-yoga", title: "Evening Flow", style: "Vinyasa", instructor: null, dayOfWeek: 4, startTime: "18:00", endTime: "19:15", durationMin: 75, dropInPriceTHB: 350 },
  { studioSlug: "freedom-yoga", title: "Morning Vinyasa", style: "Vinyasa", instructor: null, dayOfWeek: 5, startTime: "08:00", endTime: "09:15", durationMin: 75, dropInPriceTHB: 350 },
  { studioSlug: "freedom-yoga", title: "Restorative Yoga", style: "Restorative", instructor: null, dayOfWeek: 5, startTime: "18:00", endTime: "19:15", durationMin: 75, dropInPriceTHB: 350 },
  { studioSlug: "freedom-yoga", title: "Weekend Flow", style: "Vinyasa", instructor: null, dayOfWeek: 6, startTime: "09:00", endTime: "10:15", durationMin: 75, dropInPriceTHB: 350 },
  // Sun
  { studioSlug: "freedom-yoga", title: "Weekend Flow", style: "Vinyasa", instructor: null, dayOfWeek: 0, startTime: "09:00", endTime: "10:15", durationMin: 75, dropInPriceTHB: 350 },

  // ── Chiangmai Yoga Studio ──
  { studioSlug: "cm-yoga-studio", title: "Hatha Yoga", style: "Hatha", instructor: null, dayOfWeek: 1, startTime: "09:00", endTime: "10:15", durationMin: 75, dropInPriceTHB: 350 },
  { studioSlug: "cm-yoga-studio", title: "Yin Therapy", style: "Yin", instructor: null, dayOfWeek: 1, startTime: "17:00", endTime: "18:15", durationMin: 75, dropInPriceTHB: 350 },
  { studioSlug: "cm-yoga-studio", title: "Vinyasa Flow", style: "Vinyasa", instructor: null, dayOfWeek: 2, startTime: "09:00", endTime: "10:15", durationMin: 75, dropInPriceTHB: 350 },
  { studioSlug: "cm-yoga-studio", title: "Stretching & Flexibility", style: "Stretch", instructor: null, dayOfWeek: 2, startTime: "17:00", endTime: "18:15", durationMin: 75, dropInPriceTHB: 350 },
  { studioSlug: "cm-yoga-studio", title: "Hatha Flow", style: "Hatha", instructor: null, dayOfWeek: 3, startTime: "09:00", endTime: "10:15", durationMin: 75, dropInPriceTHB: 350 },
  { studioSlug: "cm-yoga-studio", title: "Yoga for Flexibility", style: "Stretch", instructor: null, dayOfWeek: 3, startTime: "17:00", endTime: "18:15", durationMin: 75, dropInPriceTHB: 350 },
  { studioSlug: "cm-yoga-studio", title: "Vinyasa Flow", style: "Vinyasa", instructor: null, dayOfWeek: 4, startTime: "09:00", endTime: "10:15", durationMin: 75, dropInPriceTHB: 350 },
  { studioSlug: "cm-yoga-studio", title: "Yin Therapy", style: "Yin", instructor: null, dayOfWeek: 4, startTime: "17:00", endTime: "18:15", durationMin: 75, dropInPriceTHB: 350 },
  { studioSlug: "cm-yoga-studio", title: "Hatha Yoga", style: "Hatha", instructor: null, dayOfWeek: 5, startTime: "09:00", endTime: "10:15", durationMin: 75, dropInPriceTHB: 350 },
  { studioSlug: "cm-yoga-studio", title: "Stretching & Flexibility", style: "Stretch", instructor: null, dayOfWeek: 5, startTime: "17:00", endTime: "18:15", durationMin: 75, dropInPriceTHB: 350 },
  { studioSlug: "cm-yoga-studio", title: "Hatha Flow", style: "Hatha", instructor: null, dayOfWeek: 6, startTime: "09:00", endTime: "10:15", durationMin: 75, dropInPriceTHB: 350 },
  // Sun
  { studioSlug: "cm-yoga-studio", title: "Hatha Yoga", style: "Hatha", instructor: null, dayOfWeek: 0, startTime: "09:00", endTime: "10:15", durationMin: 75, dropInPriceTHB: 350 },
];

async function main() {
  console.log("🧘 Seeding Chiang Mai yoga studios...\n");

  for (const studio of studios) {
    const created = await prisma.studio.upsert({
      where: { slug: studio.slug },
      update: studio,
      create: studio,
    });
    console.log(`  ✅ ${created.name} (${created.slug})`);
  }

  console.log("\n📅 Seeding yoga classes...\n");

  for (const cls of sampleClasses) {
    const studio = await prisma.studio.findUnique({ where: { slug: cls.studioSlug } });
    if (!studio) continue;

    const id = `${studio.id}-${cls.dayOfWeek}-${cls.startTime}-${cls.style}`;
    await prisma.yogaClass.upsert({
      where: { id },
      update: {
        title: cls.title,
        style: cls.style,
        instructor: cls.instructor,
        endTime: cls.endTime,
        durationMin: cls.durationMin,
        dropInPriceTHB: cls.dropInPriceTHB,
        isActive: true,
      },
      create: {
        id,
        studioId: studio.id,
        title: cls.title,
        style: cls.style,
        instructor: cls.instructor,
        dayOfWeek: cls.dayOfWeek,
        startTime: cls.startTime,
        endTime: cls.endTime,
        durationMin: cls.durationMin,
        dropInPriceTHB: cls.dropInPriceTHB,
        isActive: true,
      },
    });
  }

  console.log(`  ✅ ${sampleClasses.length} classes seeded`);
  console.log("\n🎉 Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

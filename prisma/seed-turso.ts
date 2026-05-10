import { createClient } from "@libsql/client";
import "dotenv/config";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const studios = [
  { id: "s1", name: "Wild Rose Yoga", slug: "wild-rose", description: "Intimate boutique studio in the Old City with small class sizes and personalized instruction. Sound healing integration in many sessions. Pre-booking required via WhatsApp.", location: "Old City, Chiang Mai", latitude: 18.7883, longitude: 98.9853, instagramUrl: "https://instagram.com/wildroseyogachiangmai", facebookUrl: "https://facebook.com/wildroseyogachiangmai", websiteUrl: "https://www.wildroseyoga.org", phone: "+66 899509377" },
  { id: "s2", name: "Yoga Ananda", slug: "yoga-ananda", description: "Popular Nimman studio with experienced Thai instructors. Classes for all levels from beginner to advanced. Reservation required 1–2 days in advance.", location: "Nimmanhaemin, Chiang Mai", latitude: 18.7981, longitude: 98.9673, instagramUrl: "https://instagram.com/yogaanandachiangmai", facebookUrl: "https://facebook.com/yogaanandachiangmai", websiteUrl: "https://www.yogaananda.net" },
  { id: "s3", name: "Chiang Mai Holistic", slug: "cm-holistic", description: "Wellness center offering yoga, Qi Gong, sound baths, meditation, and trauma-informed practices. First class 150 THB promo.", location: "Nimmanhaemin, Chiang Mai", latitude: 18.7990, longitude: 98.9680, instagramUrl: "https://instagram.com/chiangmaiholistic", facebookUrl: "https://facebook.com/chiangmaiholistic", websiteUrl: "https://www.chiangmaiholistic.com" },
  { id: "s4", name: "Freedom Yoga", slug: "freedom-yoga", description: "Beautiful open-air studio in a historic wooden house near Old Town. Welcoming community for all levels. Walk-ins accepted, but advance booking recommended.", location: "Central Chiang Mai", latitude: 18.8024, longitude: 98.9782, instagramUrl: "https://instagram.com/freedomyogacm", facebookUrl: "https://facebook.com/freedomyogacm", websiteUrl: "https://freedomyogachiangmai.org", phone: "+66 803855851" },
  { id: "s5", name: "Chiangmai Yoga Studio", slug: "cm-yoga-studio", description: "Friendly Old City studio with daily classes in English. Hatha, Yin Therapy, Vinyasa, and more. All levels welcome, no experience needed.", location: "Old City, Chiang Mai", latitude: 18.7870, longitude: 98.9860, websiteUrl: "https://www.chiangmaiyogastudio.com" },
];

const classes = [
  // Wild Rose
  { id:"s1-1-10:00-Yin",sid:"s1",t:"Yin Yoga Flow",s:"Yin",i:"Kru Annie",d:1,st:"10:00",et:"11:30",dur:90,p:350},
  { id:"s1-1-14:00-Hatha",sid:"s1",t:"Hatha Vinyasa",s:"Hatha",i:"Kru Anisara",d:1,st:"14:00",et:"15:30",dur:90,p:350},
  { id:"s1-1-17:00-Hatha",sid:"s1",t:"Hatha Vinyasa (Beginner-friendly)",s:"Hatha",i:"Kru Anisara",d:1,st:"17:00",et:"18:30",dur:90,p:350},
  { id:"s1-2-10:00-Vinyasa",sid:"s1",t:"All-Levels Vinyasa",s:"Vinyasa",i:"Kru May",d:2,st:"10:00",et:"11:30",dur:90,p:350},
  { id:"s1-2-14:00-Hatha",sid:"s1",t:"Gentle Hatha & Sound Bath",s:"Hatha",i:"Kru Ta",d:2,st:"14:00",et:"15:30",dur:90,p:400},
  { id:"s1-2-17:00-Yin",sid:"s1",t:"Yin Yoga & Sound Healing",s:"Yin",i:"Kru Annie",d:2,st:"17:00",et:"18:30",dur:90,p:400},
  { id:"s1-3-10:00-Flow",sid:"s1",t:"Slow Flow & Sound Bowl",s:"Flow",i:"Kru Chayada",d:3,st:"10:00",et:"11:30",dur:90,p:400},
  { id:"s1-3-14:00-Yin",sid:"s1",t:"Yin Yoga & Tibetan Sound Bowls",s:"Yin",i:"Kru Chayada",d:3,st:"14:00",et:"15:30",dur:90,p:400},
  { id:"s1-3-17:00-Hatha",sid:"s1",t:"Gentle Hatha & Sound Bath",s:"Hatha",i:"Kru Ta",d:3,st:"17:00",et:"18:30",dur:90,p:400},
  { id:"s1-4-10:00-Vinyasa",sid:"s1",t:"All-Levels Vinyasa",s:"Vinyasa",i:"Kru May",d:4,st:"10:00",et:"11:30",dur:90,p:350},
  { id:"s1-4-14:00-Flow",sid:"s1",t:"Stretch & Flow",s:"Flow",i:"Kru May",d:4,st:"14:00",et:"15:30",dur:90,p:350},
  { id:"s1-4-17:00-Hatha",sid:"s1",t:"Hatha Vinyasa (Beginner-friendly)",s:"Hatha",i:"Kru Anisara",d:4,st:"17:00",et:"18:30",dur:90,p:350},
  { id:"s1-5-10:00-Vinyasa",sid:"s1",t:"Vinyasa Flow Multi Level",s:"Vinyasa",i:"Kru Annie",d:5,st:"10:00",et:"11:30",dur:90,p:350},
  { id:"s1-5-14:00-Hatha",sid:"s1",t:"Hatha Vinyasa",s:"Hatha",i:"Kru Anisara",d:5,st:"14:00",et:"15:30",dur:90,p:350},
  { id:"s1-5-17:00-Flow",sid:"s1",t:"Stretch & Flow",s:"Flow",i:"Kru May",d:5,st:"17:00",et:"18:30",dur:90,p:350},
  { id:"s1-6-10:00-Vinyasa",sid:"s1",t:"All-Levels Vinyasa",s:"Vinyasa",i:"Kru May",d:6,st:"10:00",et:"11:30",dur:90,p:350},
  { id:"s1-6-12:30-Vinyasa",sid:"s1",t:"All-Levels Vinyasa",s:"Vinyasa",i:"Kru May",d:6,st:"12:30",et:"14:00",dur:90,p:350},
  { id:"s1-0-10:00-Vinyasa",sid:"s1",t:"Dynamic Vinyasa Flow (Intermediate)",s:"Vinyasa",i:"Kru Annie",d:0,st:"10:00",et:"11:30",dur:90,p:350},
  // Yoga Ananda
  { id:"s2-1-09:00-Flow",sid:"s2",t:"Gentle Flow (B)",s:"Flow",i:"Kru Nok",d:1,st:"09:00",et:"10:00",dur:60,p:350},
  { id:"s2-1-10:30-Stretch",sid:"s2",t:"Stretching (B)",s:"Stretch",i:"Kru Biw",d:1,st:"10:30",et:"11:30",dur:60,p:350},
  { id:"s2-1-17:15-Flow",sid:"s2",t:"Flexibility/Balance Flow (I, A)",s:"Flow",i:"Kru Nok",d:1,st:"17:15",et:"18:15",dur:60,p:350},
  { id:"s2-1-18:30-Stretch",sid:"s2",t:"Deep Stretching (B)",s:"Stretch",i:"Kru Menny",d:1,st:"18:30",et:"19:30",dur:60,p:350},
  { id:"s2-2-09:00-Hatha",sid:"s2",t:"Core Foundation (B)",s:"Hatha",i:"Kru Menny",d:2,st:"09:00",et:"10:00",dur:60,p:350},
  { id:"s2-2-17:15-Power",sid:"s2",t:"Power Vinyasa (I, A)",s:"Power",i:"Kru Menny",d:2,st:"17:15",et:"18:15",dur:60,p:350},
  { id:"s2-2-18:30-Flow",sid:"s2",t:"Moon Flow (B)",s:"Flow",i:"Kru Menny",d:2,st:"18:30",et:"19:30",dur:60,p:350},
  { id:"s2-3-09:00-Vinyasa",sid:"s2",t:"Vinyasa Flow (B, I)",s:"Vinyasa",i:"Kru Menny",d:3,st:"09:00",et:"10:00",dur:60,p:350},
  { id:"s2-3-17:15-Ashtanga",sid:"s2",t:"Ashtanga Modified (I, A)",s:"Ashtanga",i:"Kru Nok",d:3,st:"17:15",et:"18:15",dur:60,p:350},
  { id:"s2-3-18:30-Stretch",sid:"s2",t:"Deep Stretching (B)",s:"Stretch",i:"Kru Nok",d:3,st:"18:30",et:"19:30",dur:60,p:350},
  { id:"s2-4-17:15-Vinyasa",sid:"s2",t:"Vinyasa Upper Body (B, I)",s:"Vinyasa",i:"Kru Menny",d:4,st:"17:15",et:"18:15",dur:60,p:350},
  { id:"s2-4-18:30-Hatha",sid:"s2",t:"Healthy Move (B)",s:"Hatha",i:"Kru Menny",d:4,st:"18:30",et:"19:30",dur:60,p:350},
  { id:"s2-5-09:00-Hatha",sid:"s2",t:"Sun Series (B)",s:"Hatha",i:"Kru Nok",d:5,st:"09:00",et:"10:00",dur:60,p:350},
  { id:"s2-5-17:15-Vinyasa",sid:"s2",t:"Core Vinyasa (I, A)",s:"Vinyasa",i:"Kru Menny",d:5,st:"17:15",et:"18:15",dur:60,p:350},
  { id:"s2-6-09:00-Vinyasa",sid:"s2",t:"Vinyasa Flow (B, I)",s:"Vinyasa",i:"Kru Biw",d:6,st:"09:00",et:"10:00",dur:60,p:350},
  { id:"s2-0-09:00-Yin",sid:"s2",t:"Yin Yoga (B)",s:"Yin",i:"Kru Menny",d:0,st:"09:00",et:"10:00",dur:60,p:350},
  // CM Holistic
  { id:"s3-1-09:30-Mixed",sid:"s3",t:"Qi Gong",s:"Mixed",i:null,d:1,st:"09:30",et:"10:45",dur:75,p:400},
  { id:"s3-1-18:00-Yin",sid:"s3",t:"Yin Yoga and Sound",s:"Yin",i:null,d:1,st:"18:00",et:"19:15",dur:75,p:450},
  { id:"s3-2-13:00-Restorative",sid:"s3",t:"Yoga Nidra & Mixed Sound Bath",s:"Restorative",i:null,d:2,st:"13:00",et:"14:00",dur:60,p:300},
  { id:"s3-2-19:00-Meditation",sid:"s3",t:"Mixed Sound Bath",s:"Meditation",i:null,d:2,st:"19:00",et:"20:00",dur:60,p:150},
  { id:"s3-3-09:30-Vinyasa",sid:"s3",t:"Vinyasa Yoga",s:"Vinyasa",i:null,d:3,st:"09:30",et:"11:00",dur:90,p:300},
  { id:"s3-4-09:30-Restorative",sid:"s3",t:"Restorative Flow Yoga",s:"Restorative",i:null,d:4,st:"09:30",et:"10:45",dur:75,p:400},
  { id:"s3-4-19:30-Meditation",sid:"s3",t:"Tibetan Bowls Sound Bath",s:"Meditation",i:null,d:4,st:"19:30",et:"20:30",dur:60,p:150},
  { id:"s3-5-09:30-Vinyasa",sid:"s3",t:"Vinyasa Yoga",s:"Vinyasa",i:null,d:5,st:"09:30",et:"11:00",dur:90,p:300},
  { id:"s3-5-17:00-Breathwork",sid:"s3",t:"Pranayama",s:"Breathwork",i:null,d:5,st:"17:00",et:"19:00",dur:120,p:400},
  { id:"s3-6-09:30-Hatha",sid:"s3",t:"Hatha Yoga & Sound Bath",s:"Hatha",i:null,d:6,st:"09:30",et:"11:00",dur:90,p:350},
  { id:"s3-6-18:00-Mixed",sid:"s3",t:"Dance Mandala",s:"Mixed",i:null,d:6,st:"18:00",et:"19:45",dur:105,p:300},
  { id:"s3-0-19:30-Meditation",sid:"s3",t:"Crystal Bowls Sound Bath",s:"Meditation",i:null,d:0,st:"19:30",et:"20:30",dur:60,p:150},
  // Freedom Yoga
  { id:"s4-1-08:00-Vinyasa",sid:"s4",t:"Morning Vinyasa",s:"Vinyasa",i:null,d:1,st:"08:00",et:"09:15",dur:75,p:350},
  { id:"s4-1-18:00-Vinyasa",sid:"s4",t:"Evening Flow",s:"Vinyasa",i:null,d:1,st:"18:00",et:"19:15",dur:75,p:350},
  { id:"s4-2-08:00-Hatha",sid:"s4",t:"Morning Hatha",s:"Hatha",i:null,d:2,st:"08:00",et:"09:15",dur:75,p:350},
  { id:"s4-2-18:00-Power",sid:"s4",t:"Power Flow",s:"Power",i:null,d:2,st:"18:00",et:"19:15",dur:75,p:350},
  { id:"s4-3-08:00-Vinyasa",sid:"s4",t:"Morning Vinyasa",s:"Vinyasa",i:null,d:3,st:"08:00",et:"09:15",dur:75,p:350},
  { id:"s4-3-18:00-Yin",sid:"s4",t:"Yin Yoga",s:"Yin",i:null,d:3,st:"18:00",et:"19:15",dur:75,p:350},
  { id:"s4-4-08:00-Hatha",sid:"s4",t:"Morning Hatha",s:"Hatha",i:null,d:4,st:"08:00",et:"09:15",dur:75,p:350},
  { id:"s4-4-18:00-Vinyasa",sid:"s4",t:"Evening Flow",s:"Vinyasa",i:null,d:4,st:"18:00",et:"19:15",dur:75,p:350},
  { id:"s4-5-08:00-Vinyasa",sid:"s4",t:"Morning Vinyasa",s:"Vinyasa",i:null,d:5,st:"08:00",et:"09:15",dur:75,p:350},
  { id:"s4-5-18:00-Restorative",sid:"s4",t:"Restorative Yoga",s:"Restorative",i:null,d:5,st:"18:00",et:"19:15",dur:75,p:350},
  { id:"s4-6-09:00-Vinyasa",sid:"s4",t:"Weekend Flow",s:"Vinyasa",i:null,d:6,st:"09:00",et:"10:15",dur:75,p:350},
  // CM Yoga Studio
  { id:"s5-1-09:00-Hatha",sid:"s5",t:"Hatha Yoga",s:"Hatha",i:null,d:1,st:"09:00",et:"10:15",dur:75,p:350},
  { id:"s5-1-17:00-Yin",sid:"s5",t:"Yin Therapy",s:"Yin",i:null,d:1,st:"17:00",et:"18:15",dur:75,p:350},
  { id:"s5-2-09:00-Vinyasa",sid:"s5",t:"Vinyasa Flow",s:"Vinyasa",i:null,d:2,st:"09:00",et:"10:15",dur:75,p:350},
  { id:"s5-2-17:00-Stretch",sid:"s5",t:"Stretching & Flexibility",s:"Stretch",i:null,d:2,st:"17:00",et:"18:15",dur:75,p:350},
  { id:"s5-3-09:00-Hatha",sid:"s5",t:"Hatha Flow",s:"Hatha",i:null,d:3,st:"09:00",et:"10:15",dur:75,p:350},
  { id:"s5-3-17:00-Stretch",sid:"s5",t:"Yoga for Flexibility",s:"Stretch",i:null,d:3,st:"17:00",et:"18:15",dur:75,p:350},
  { id:"s5-4-09:00-Vinyasa",sid:"s5",t:"Vinyasa Flow",s:"Vinyasa",i:null,d:4,st:"09:00",et:"10:15",dur:75,p:350},
  { id:"s5-4-17:00-Yin",sid:"s5",t:"Yin Therapy",s:"Yin",i:null,d:4,st:"17:00",et:"18:15",dur:75,p:350},
  { id:"s5-5-09:00-Hatha",sid:"s5",t:"Hatha Yoga",s:"Hatha",i:null,d:5,st:"09:00",et:"10:15",dur:75,p:350},
  { id:"s5-5-17:00-Stretch",sid:"s5",t:"Stretching & Flexibility",s:"Stretch",i:null,d:5,st:"17:00",et:"18:15",dur:75,p:350},
  { id:"s5-6-09:00-Hatha",sid:"s5",t:"Hatha Flow",s:"Hatha",i:null,d:6,st:"09:00",et:"10:15",dur:75,p:350},
];

async function main() {
  const now = new Date().toISOString();
  console.log("🧘 Seeding studios to Turso...\n");

  for (const s of studios) {
    await client.execute({
      sql: `INSERT OR REPLACE INTO Studio (id, name, slug, description, location, latitude, longitude, instagramUrl, facebookUrl, websiteUrl, phone, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [s.id, s.name, s.slug, s.description, s.location, s.latitude, s.longitude, s.instagramUrl ?? null, s.facebookUrl ?? null, s.websiteUrl ?? null, s.phone ?? null, now, now],
    });
    console.log("  ✅ " + s.name);
  }

  console.log("\n📅 Seeding classes...\n");

  for (const c of classes) {
    await client.execute({
      sql: `INSERT OR REPLACE INTO YogaClass (id, studioId, title, style, instructor, dayOfWeek, startTime, endTime, durationMin, dropInPriceTHB, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      args: [c.id, c.sid, c.t, c.s, c.i, c.d, c.st, c.et, c.dur, c.p, now, now],
    });
  }

  console.log("  ✅ " + classes.length + " classes seeded");
  console.log("\n🎉 Done!");
}

main().catch(console.error);

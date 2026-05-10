import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { DAYS_OF_WEEK } from "@/lib/types";
import Link from "next/link";

function getDateForDay(dayOfWeek: number): { dateStr: string; isToday: boolean } {
  const today = new Date();
  const todayDay = today.getDay();
  const diff = (dayOfWeek - todayDay + 7) % 7;
  const date = new Date(today);
  date.setDate(today.getDate() + diff);
  return {
    dateStr: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    isToday: diff === 0,
  };
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function StudioPage({ params }: Props) {
  const { slug } = await params;
  const studio = await prisma.studio.findUnique({
    where: { slug },
    include: {
      classes: {
        where: { isActive: true },
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      },
    },
  });

  if (!studio) return notFound();

  const classesByDay = studio.classes.reduce<Record<number, typeof studio.classes>>(
    (acc, cls) => {
      if (!acc[cls.dayOfWeek]) acc[cls.dayOfWeek] = [];
      acc[cls.dayOfWeek].push(cls);
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-amber-600 via-amber-500 to-orange-400 text-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-amber-100 hover:text-white text-sm mb-3 transition-colors"
          >
            ← Back to all classes
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{studio.name}</h1>
          {studio.location && (
            <p className="text-amber-100 text-sm mt-1">📍 {studio.location}</p>
          )}
          {studio.description && (
            <p className="text-amber-50/80 text-sm mt-2">{studio.description}</p>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Social links */}
        <div className="flex flex-wrap gap-3 mb-6">
          {studio.websiteUrl && (
            <a
              href={studio.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-sm text-stone-600 hover:text-amber-700 border border-stone-200 hover:border-amber-300 transition-colors"
            >
              🌐 Website
            </a>
          )}
          {studio.instagramUrl && (
            <a
              href={studio.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-sm text-stone-600 hover:text-pink-600 border border-stone-200 hover:border-pink-300 transition-colors"
            >
              📷 Instagram
            </a>
          )}
          {studio.facebookUrl && (
            <a
              href={studio.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-sm text-stone-600 hover:text-blue-600 border border-stone-200 hover:border-blue-300 transition-colors"
            >
              📘 Facebook
            </a>
          )}
          {studio.phone && (
            <a
              href={`tel:${studio.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-sm text-stone-600 hover:text-green-600 border border-stone-200 hover:border-green-300 transition-colors"
            >
              📞 {studio.phone}
            </a>
          )}
        </div>

        {/* Schedule */}
        <h2 className="text-lg font-bold text-stone-800 mb-4">Weekly Schedule</h2>

        {studio.classes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-stone-400">No classes listed yet</p>
          </div>
        ) : (
          Object.entries(classesByDay).map(([day, dayClasses]) => {
            const dayNum = parseInt(day);
            const { dateStr, isToday } = getDateForDay(dayNum);
            return (
            <div key={day} className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 mb-3 px-1 flex items-center gap-2">
                {DAYS_OF_WEEK[dayNum]}, {dateStr}
                {isToday && (
                  <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.5 rounded-full normal-case tracking-normal font-semibold">
                    Today
                  </span>
                )}
              </h3>
              <div className="flex flex-col gap-2">
                {dayClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="bg-white rounded-xl border border-stone-100 p-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-800 text-sm">
                          {cls.startTime}
                          {cls.endTime && (
                            <span className="text-stone-400"> – {cls.endTime}</span>
                          )}
                        </span>
                        {cls.durationMin && (
                          <span className="text-xs text-stone-400">{cls.durationMin}min</span>
                        )}
                      </div>
                      <p className="font-medium text-stone-900 text-sm mt-0.5">{cls.title}</p>
                      {cls.instructor && (
                        <p className="text-xs text-stone-500">with {cls.instructor}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {cls.style}
                      </span>
                      {cls.dropInPriceTHB && (
                        <p className="text-sm font-bold text-amber-700 mt-1">
                          ฿{cls.dropInPriceTHB}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            );
          })
        )}
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="max-w-2xl mx-auto px-4 py-6 text-center">
          <Link href="/" className="text-sm text-amber-600 hover:text-amber-800 font-medium">
            ← Back to all classes
          </Link>
        </div>
      </footer>
    </div>
  );
}

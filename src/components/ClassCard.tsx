"use client";

import { useTranslations } from "next-intl";
import { ClassWithStudio } from "@/lib/types";
import { Link } from "@/i18n/navigation";

function getTimeEmoji(startTime: string): string {
  const hour = parseInt(startTime.split(":")[0]);
  if (hour < 10) return "🌅";
  if (hour < 14) return "☀️";
  if (hour < 17) return "🌤️";
  return "🌙";
}

function getStyleColor(style: string): string {
  const colors: Record<string, string> = {
    Vinyasa: "bg-amber-100 text-amber-800",
    Hatha: "bg-emerald-100 text-emerald-800",
    Yin: "bg-indigo-100 text-indigo-800",
    Ashtanga: "bg-red-100 text-red-800",
    Restorative: "bg-purple-100 text-purple-800",
    Power: "bg-orange-100 text-orange-800",
    Kundalini: "bg-yellow-100 text-yellow-800",
    "Hot Yoga": "bg-rose-100 text-rose-800",
    Prenatal: "bg-pink-100 text-pink-800",
    Meditation: "bg-sky-100 text-sky-800",
    Breathwork: "bg-cyan-100 text-cyan-800",
    Flow: "bg-amber-100 text-amber-800",
    Stretch: "bg-lime-100 text-lime-800",
  };
  return colors[style] || "bg-stone-100 text-stone-800";
}

export default function ClassCard({ cls }: { cls: ClassWithStudio }) {
  const t = useTranslations("common");
  const ts = useTranslations("suggest");
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{getTimeEmoji(cls.startTime)}</span>
            <span className="font-semibold text-stone-800 text-base">
              {cls.startTime}
              {cls.endTime && <span className="text-stone-400"> – {cls.endTime}</span>}
            </span>
            {cls.durationMin && (
              <span className="text-xs text-stone-400">{t("min", { minutes: cls.durationMin })}</span>
            )}
          </div>

          <h3 className="font-bold text-stone-900 text-lg leading-tight">{cls.title}</h3>

          {cls.instructor && (
            <p className="text-stone-500 text-sm mt-0.5">{t("with", { instructor: cls.instructor })}</p>
          )}

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStyleColor(cls.style)}`}
            >
              {cls.style}
            </span>
            <Link
              href={`/studios/${cls.studio.slug}`}
              className="text-xs text-stone-500 hover:text-amber-700 transition-colors"
            >
              📍 {cls.studio.name}
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const data = prompt(ts("prompt"));
                if (data) {
                  fetch("/api/suggestions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "correction", targetClassId: cls.id, targetStudioId: cls.studio.id, data }),
                  }).then(() => alert(ts("thanks")));
                }
              }}
              className="text-[10px] text-stone-300 hover:text-amber-600 transition-colors"
            >
              ✏️ {ts("suggestEdit")}
            </button>
          </div>
        </div>

        {cls.dropInPriceTHB && (
          <div className="text-right shrink-0">
            <div className="text-lg font-bold text-amber-700">฿{cls.dropInPriceTHB}</div>
            <div className="text-[10px] text-stone-400 uppercase tracking-wider">{t("dropIn")}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ClassGroup({ day, classes }: { day: number; classes: ClassWithStudio[] }) {
  const t = useTranslations("common");
  const td = useTranslations("days");

  const dayKeys = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;

  const today = new Date();
  const todayDay = today.getDay();
  const diff = (day - todayDay + 7) % 7;
  const date = new Date(today);
  date.setDate(today.getDate() + diff);
  const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const isToday = diff === 0;

  return (
    <div className="mb-8">
      <h2 className="text-sm font-bold uppercase tracking-wider text-amber-700 mb-3 px-1 flex items-center gap-2">
        {td(dayKeys[day])}, {dateStr}
        {isToday && (
          <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.5 rounded-full normal-case tracking-normal font-semibold">
            {t("today")}
          </span>
        )}
      </h2>
      <div className="flex flex-col gap-3">
        {classes.map((cls) => (
          <ClassCard key={cls.id} cls={cls} />
        ))}
      </div>
    </div>
  );
}

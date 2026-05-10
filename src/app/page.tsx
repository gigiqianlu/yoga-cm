"use client";

import { useState, useEffect, useCallback } from "react";
import { ClassWithStudio, Filters } from "@/lib/types";
import { ClassGroup } from "@/components/ClassCard";
import FilterBar from "@/components/FilterBar";

interface Studio {
  id: string;
  name: string;
  slug: string;
}

export default function Home() {
  const [classes, setClasses] = useState<ClassWithStudio[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [loading, setLoading] = useState(true);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.style) params.set("style", filters.style);
    if (filters.studioId) params.set("studioId", filters.studioId);
    if (filters.dayOfWeek !== undefined) params.set("dayOfWeek", String(filters.dayOfWeek));
    if (filters.timeSlot) params.set("timeSlot", filters.timeSlot);

    const res = await fetch(`/api/classes?${params}`);
    const data = await res.json();
    setClasses(data);

    // Extract unique studios
    const studioMap = new Map<string, Studio>();
    data.forEach((c: ClassWithStudio) => {
      if (!studioMap.has(c.studio.id)) {
        studioMap.set(c.studio.id, c.studio);
      }
    });
    if (studios.length === 0) {
      setStudios(Array.from(studioMap.values()));
    }
    setLoading(false);
  }, [filters, studios.length]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Group classes by day
  const grouped = classes.reduce<Record<number, ClassWithStudio[]>>((acc, cls) => {
    if (!acc[cls.dayOfWeek]) acc[cls.dayOfWeek] = [];
    acc[cls.dayOfWeek].push(cls);
    return acc;
  }, {});

  // Sort days starting from today
  const today = new Date().getDay();
  const sortedDays = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => {
      const distA = (a - today + 7) % 7;
      const distB = (b - today + 7) % 7;
      return distA - distB;
    });

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-amber-600 via-amber-500 to-orange-400 text-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-3xl mb-1">🧘</div>
          <h1 className="text-2xl font-bold tracking-tight">Yoga in Chiang Mai</h1>
          <p className="text-amber-100 text-sm mt-1">
            Find your perfect class across {studios.length || "—"} studios
          </p>
        </div>
      </header>

      {/* Filters */}
      <FilterBar filters={filters} onChange={setFilters} studios={studios} />

      {/* Class Feed */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
            <p className="text-stone-400 mt-3 text-sm">Finding classes...</p>
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🙏</div>
            <h2 className="text-lg font-semibold text-stone-700">No classes found</h2>
            <p className="text-stone-400 text-sm mt-1">Try adjusting your filters</p>
            <button
              onClick={() => setFilters({})}
              className="mt-4 px-4 py-2 bg-amber-100 text-amber-800 rounded-xl text-sm font-medium hover:bg-amber-200 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-stone-400 mb-4">
              {classes.length} class{classes.length !== 1 ? "es" : ""} found
            </p>
            {sortedDays.map((day) => (
              <ClassGroup key={day} day={day} classes={grouped[day]} />
            ))}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white">
        <div className="max-w-2xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-stone-400">
            🧘 Yoga in Chiang Mai · Schedules may change — always confirm with the studio
          </p>
        </div>
      </footer>
    </div>
  );
}


"use client";

import { YOGA_STYLES, DAYS_OF_WEEK, TIME_SLOTS, Filters } from "@/lib/types";

interface Studio {
  id: string;
  name: string;
  slug: string;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  studios: Studio[];
}

export default function FilterBar({ filters, onChange, studios }: FilterBarProps) {
  const activeCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== ""
  ).length;

  return (
    <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-stone-100">
      <div className="max-w-2xl mx-auto px-4 py-3">
        {/* Quick filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          {/* Time of day */}
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot.value}
              onClick={() =>
                onChange({
                  ...filters,
                  timeSlot: filters.timeSlot === slot.value ? undefined : slot.value,
                })
              }
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.timeSlot === slot.value
                  ? "bg-amber-600 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {slot.label}
            </button>
          ))}

          {/* Divider */}
          <div className="shrink-0 w-px bg-stone-200 my-1" />

          {/* Day of week */}
          {DAYS_OF_WEEK.map((day, i) => (
            <button
              key={day}
              onClick={() =>
                onChange({
                  ...filters,
                  dayOfWeek: filters.dayOfWeek === i ? undefined : i,
                })
              }
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.dayOfWeek === i
                  ? "bg-amber-600 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Dropdowns row */}
        <div className="flex gap-2 mt-2">
          <select
            value={filters.style || ""}
            onChange={(e) => onChange({ ...filters, style: e.target.value || undefined })}
            className="flex-1 text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
          >
            <option value="">All styles</option>
            {YOGA_STYLES.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>

          <select
            value={filters.studioId || ""}
            onChange={(e) => onChange({ ...filters, studioId: e.target.value || undefined })}
            className="flex-1 text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
          >
            <option value="">All studios</option>
            {studios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Active filter count + clear */}
        {activeCount > 0 && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-stone-400">
              {activeCount} filter{activeCount > 1 ? "s" : ""} active
            </span>
            <button
              onClick={() => onChange({})}
              className="text-xs text-amber-600 hover:text-amber-800 font-medium"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

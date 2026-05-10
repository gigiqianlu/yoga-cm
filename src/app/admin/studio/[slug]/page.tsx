"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const STYLES = ["Vinyasa", "Hatha", "Yin", "Ashtanga", "Restorative", "Power", "Kundalini", "Hot Yoga", "Meditation", "Breathwork", "Flow", "Stretch", "Mixed"];

interface YogaClass {
  id: string;
  title: string;
  style: string;
  instructor: string | null;
  dayOfWeek: number;
  startTime: string;
  endTime: string | null;
  durationMin: number | null;
  priceTHB: number | null;
  dropInPriceTHB: number | null;
  status: string;
  source: string;
}

interface Studio {
  id: string;
  name: string;
  slug: string;
  websiteUrl: string | null;
  lastVerifiedAt: string | null;
  classes: YogaClass[];
}

const emptyClass = {
  title: "",
  style: "Vinyasa",
  instructor: "",
  dayOfWeek: 0,
  startTime: "09:00",
  endTime: "10:00",
  durationMin: 60,
  dropInPriceTHB: null as number | null,
  status: "live",
};

export default function StudioEditor() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingClass, setEditingClass] = useState<(typeof emptyClass & { id?: string }) | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const fetchStudio = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/studios/by-slug?slug=${slug}`);
    if (res.status === 401) { setAuthError(true); return; }
    if (res.ok) setStudio(await res.json());
    setLoading(false);
  }, [slug]);

  useEffect(() => { fetchStudio(); }, [fetchStudio]);

  async function handleVerify() {
    if (!studio) return;
    setSaving("verify");
    await fetch("/api/admin/studios/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studioId: studio.id }),
    });
    await fetchStudio();
    setSaving(null);
  }

  async function handleSaveClass(cls: typeof emptyClass & { id?: string }) {
    if (!studio) return;
    setSaving(cls.id || "new");

    const body = {
      ...cls,
      studioId: studio.id,
      durationMin: cls.durationMin || null,
      dropInPriceTHB: cls.dropInPriceTHB || null,
      instructor: cls.instructor || null,
    };

    if (cls.id) {
      await fetch("/api/admin/classes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/admin/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    setEditingClass(null);
    setShowAdd(false);
    await fetchStudio();
    setSaving(null);
  }

  async function handleDeleteClass(classId: string) {
    if (!confirm("Delete this class?")) return;
    setSaving(classId);
    await fetch("/api/admin/classes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: classId }),
    });
    await fetchStudio();
    setSaving(null);
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-stone-600 mb-4">Session expired.</p>
          <Link href="/admin/login" className="text-amber-600 underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  if (loading || !studio) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-400 animate-pulse text-lg">Loading…</div>
      </div>
    );
  }

  // Group classes by day
  const classesByDay = DAYS.map((_, i) => studio.classes.filter((c) => c.dayOfWeek === i));

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin" className="text-xs text-amber-600 hover:underline">← Dashboard</Link>
              <h1 className="text-xl font-bold text-stone-800 mt-1">{studio.name}</h1>
              {studio.websiteUrl && (
                <a href={studio.websiteUrl} target="_blank" rel="noopener" className="text-xs text-stone-400 hover:underline">
                  {studio.websiteUrl}
                </a>
              )}
            </div>
            <button
              onClick={handleVerify}
              disabled={saving === "verify"}
              className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {saving === "verify" ? "Saving…" : "✓ Mark Verified"}
            </button>
          </div>

          {studio.lastVerifiedAt && (
            <p className="text-xs text-stone-400 mt-2">
              Last verified: {new Date(studio.lastVerifiedAt).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
              })}
            </p>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Add class button */}
        <div className="flex justify-end">
          <button
            onClick={() => { setShowAdd(true); setEditingClass({ ...emptyClass }); }}
            className="px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition-colors"
          >
            + Add Class
          </button>
        </div>

        {/* Add/Edit modal */}
        {(showAdd || editingClass) && editingClass && (
          <ClassForm
            cls={editingClass}
            onSave={handleSaveClass}
            onCancel={() => { setEditingClass(null); setShowAdd(false); }}
            saving={saving !== null}
          />
        )}

        {/* Weekly timetable */}
        {DAYS.map((day, dayIndex) => {
          const dayClasses = classesByDay[dayIndex];
          return (
            <section key={day}>
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-700 mb-2 flex items-center gap-2">
                {day}
                <span className="text-xs font-normal text-stone-400">({dayClasses.length} classes)</span>
              </h2>

              {dayClasses.length === 0 ? (
                <div className="text-sm text-stone-400 italic mb-4">No classes</div>
              ) : (
                <div className="space-y-2 mb-4">
                  {dayClasses.map((cls) => (
                    <div key={cls.id} className="bg-white rounded-xl border border-stone-200 p-3 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-700 text-sm">
                            {cls.startTime}{cls.endTime && ` – ${cls.endTime}`}
                          </span>
                          <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">{cls.style}</span>
                          {cls.status !== "live" && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{cls.status}</span>
                          )}
                        </div>
                        <div className="text-sm text-stone-800 font-medium mt-0.5">{cls.title}</div>
                        {cls.instructor && <div className="text-xs text-stone-400">with {cls.instructor}</div>}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <button
                          onClick={() => setEditingClass({
                            id: cls.id,
                            title: cls.title,
                            style: cls.style,
                            instructor: cls.instructor || "",
                            dayOfWeek: cls.dayOfWeek,
                            startTime: cls.startTime,
                            endTime: cls.endTime || "",
                            durationMin: cls.durationMin || 60,
                            dropInPriceTHB: cls.dropInPriceTHB,
                            status: cls.status,
                          })}
                          className="text-xs text-amber-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClass(cls.id)}
                          disabled={saving === cls.id}
                          className="text-xs text-red-500 hover:underline disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </main>
    </div>
  );
}

function ClassForm({
  cls,
  onSave,
  onCancel,
  saving,
}: {
  cls: typeof emptyClass & { id?: string };
  onSave: (c: typeof emptyClass & { id?: string }) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(cls);

  function update(field: string, value: unknown) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-amber-300 p-4 shadow-lg">
      <h3 className="font-bold text-stone-800 mb-4">{cls.id ? "Edit Class" : "Add New Class"}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-stone-500 uppercase tracking-wider">Title</label>
          <input
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm mt-1"
            placeholder="e.g. Morning Flow"
          />
        </div>

        <div>
          <label className="text-xs text-stone-500 uppercase tracking-wider">Style</label>
          <select
            value={form.style}
            onChange={(e) => update("style", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm mt-1"
          >
            {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs text-stone-500 uppercase tracking-wider">Day</label>
          <select
            value={form.dayOfWeek}
            onChange={(e) => update("dayOfWeek", parseInt(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm mt-1"
          >
            {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs text-stone-500 uppercase tracking-wider">Instructor</label>
          <input
            value={form.instructor || ""}
            onChange={(e) => update("instructor", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm mt-1"
            placeholder="e.g. Sarah"
          />
        </div>

        <div>
          <label className="text-xs text-stone-500 uppercase tracking-wider">Start Time</label>
          <input
            type="time"
            value={form.startTime}
            onChange={(e) => update("startTime", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm mt-1"
          />
        </div>

        <div>
          <label className="text-xs text-stone-500 uppercase tracking-wider">End Time</label>
          <input
            type="time"
            value={form.endTime || ""}
            onChange={(e) => update("endTime", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm mt-1"
          />
        </div>

        <div>
          <label className="text-xs text-stone-500 uppercase tracking-wider">Duration (min)</label>
          <input
            type="number"
            value={form.durationMin || ""}
            onChange={(e) => update("durationMin", e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm mt-1"
          />
        </div>

        <div>
          <label className="text-xs text-stone-500 uppercase tracking-wider">Drop-in Price (THB)</label>
          <input
            type="number"
            value={form.dropInPriceTHB || ""}
            onChange={(e) => update("dropInPriceTHB", e.target.value ? parseFloat(e.target.value) : null)}
            className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm mt-1"
          />
        </div>

        <div>
          <label className="text-xs text-stone-500 uppercase tracking-wider">Status</label>
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm mt-1"
          >
            <option value="live">Live</option>
            <option value="draft">Draft</option>
            <option value="pending_review">Pending Review</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.title}
          className="px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-stone-500 hover:text-stone-700 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

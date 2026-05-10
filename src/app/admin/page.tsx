"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Studio {
  id: string;
  name: string;
  slug: string;
  status: string;
  lastVerifiedAt: string | null;
  _count: { classes: number };
}

interface Suggestion {
  id: string;
  type: string;
  data: string;
  status: string;
  createdAt: string;
}

function daysAgo(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const d = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  return `${d} days ago`;
}

function freshnessBadge(dateStr: string | null) {
  if (!dateStr) return <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Never verified</span>;
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days <= 7) return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Fresh</span>;
  if (days <= 14) return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">⚠ Getting stale</span>;
  return <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">⚠ Outdated</span>;
}

export default function AdminDashboard() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [studioRes, sugRes] = await Promise.all([
        fetch("/api/admin/studios"),
        fetch("/api/admin/suggestions?status=pending"),
      ]);

      if (studioRes.status === 401) {
        setAuthError(true);
        return;
      }

      setStudios(await studioRes.json());
      setSuggestions(await sugRes.json());
    } catch {
      console.error("Failed to fetch admin data");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (authError) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-stone-600 mb-4">Session expired. Please log in again.</p>
          <Link href="/admin/login" className="text-amber-600 underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-400 animate-pulse text-lg">Loading…</div>
      </div>
    );
  }

  const totalClasses = studios.reduce((sum, s) => sum + s._count.classes, 0);
  const staleStudios = studios.filter((s) => {
    if (!s.lastVerifiedAt) return true;
    return (Date.now() - new Date(s.lastVerifiedAt).getTime()) > 14 * 86400000;
  });

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-stone-800">🧘 Admin Dashboard</h1>
            <p className="text-sm text-stone-500">Yoga in Chiang Mai</p>
          </div>
          <Link href="/" className="text-sm text-amber-600 hover:underline">← Public site</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Studios" value={studios.length} />
          <StatCard label="Classes" value={totalClasses} />
          <StatCard label="Pending" value={suggestions.length} accent />
          <StatCard label="Stale" value={staleStudios.length} accent={staleStudios.length > 0} />
        </div>

        {/* Pending suggestions */}
        {suggestions.length > 0 && (
          <section className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
            <h2 className="font-bold text-amber-800 mb-3">📬 Pending Suggestions ({suggestions.length})</h2>
            <div className="space-y-2">
              {suggestions.slice(0, 5).map((s) => (
                <div key={s.id} className="bg-white rounded-xl p-3 border border-amber-100 text-sm">
                  <span className="font-medium text-stone-700">{s.type}</span>
                  <span className="text-stone-400 ml-2">— {new Date(s.createdAt).toLocaleDateString()}</span>
                  <p className="text-stone-500 mt-1 truncate">{s.data}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Studios list */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-stone-800 text-lg">Studios</h2>
          </div>

          <div className="space-y-3">
            {studios.map((studio) => (
              <Link
                key={studio.id}
                href={`/admin/studio/${studio.slug}`}
                className="block bg-white rounded-2xl border border-stone-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-stone-800">{studio.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-stone-400">{studio._count.classes} classes</span>
                      {freshnessBadge(studio.lastVerifiedAt)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-stone-400">Verified</div>
                    <div className="text-sm text-stone-600">{daysAgo(studio.lastVerifiedAt)}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${accent ? "bg-amber-50 border-amber-200" : "bg-white border-stone-200"}`}>
      <div className={`text-2xl font-bold ${accent ? "text-amber-700" : "text-stone-800"}`}>{value}</div>
      <div className="text-xs text-stone-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}

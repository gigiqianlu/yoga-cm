"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Invalid admin token");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-stone-800 mb-1">🔐 Admin</h1>
        <p className="text-stone-500 text-sm mb-6">Enter your admin token to continue</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Admin token"
            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 mb-4"
            autoFocus
          />

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}

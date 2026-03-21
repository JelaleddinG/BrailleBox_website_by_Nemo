"use client";

import { useEffect, useState } from "react";

type ParentSuggestion = { id: string; name: string; email: string };

export function LinkParentForm({ studentId }: { studentId: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [results, setResults] = useState<ParentSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = email.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }

    const t = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/parents/search?q=${encodeURIComponent(q)}`);
      const json = await res.json().catch(() => ({ results: [] }));
      setResults(Array.isArray(json.results) ? json.results : []);
      setLoading(false);
    }, 180);

    return () => clearTimeout(t);
  }, [email]);

  const link = async (selectedEmail?: string) => {
    const targetEmail = (selectedEmail || email).trim();
    setStatus("");
    const res = await fetch(`/api/students/${studentId}/link-parent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parentEmail: targetEmail }),
    });
    const j = await res.json().catch(() => ({}));
    setStatus(res.ok ? "Parent linked." : (j.error || "Failed to link"));
  };

  return (
    <div className="mt-6 rounded-[1.2rem] bg-[#f8fbfb] p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Link parent to student</div>
      <div className="mt-3 relative">
        <div className="flex gap-2">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Search parent by name or email"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <button type="button" onClick={() => link()} className="btn-dark">Link</button>
        </div>

        {loading ? <div className="mt-2 text-xs text-slate-500">Searching...</div> : null}

        {results.length > 0 ? (
          <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
            {results.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setEmail(r.email);
                  setResults([]);
                }}
                className="block w-full border-b border-slate-100 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-slate-50"
              >
                <div className="font-medium text-slate-800">{r.name}</div>
                <div className="text-xs text-slate-500">{r.email}</div>
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {status ? <div className="mt-2 text-xs text-slate-600">{status}</div> : null}
    </div>
  );
}

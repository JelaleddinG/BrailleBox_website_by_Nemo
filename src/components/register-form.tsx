"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type LocationSuggestion = { label: string; city: string; state: string; district: string };

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    school: "",
    district: "",
    city: "",
    state: "",
    password: "",
    role: "teacher",
  });
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<LocationSuggestion[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = locationQuery.trim();
    if (q.length < 2) {
      setLocationResults([]);
      return;
    }

    const t = setTimeout(async () => {
      const res = await fetch(`/api/location/search?q=${encodeURIComponent(q)}`);
      const json = await res.json().catch(() => ({ results: [] }));
      setLocationResults(Array.isArray(json.results) ? json.results : []);
    }, 180);

    return () => clearTimeout(t);
  }, [locationQuery]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error || "Could not register.");
      setLoading(false);
      return;
    }

    setMessage(json.delivery || (json.verificationCode ? `Verification code for ${json.email}: ${json.verificationCode}` : "Verification step ready."));
    setLoading(false);
    router.push(`/verify?email=${encodeURIComponent(form.email)}`);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="w-full rounded-2xl border border-white/12 bg-white/95 px-4 py-3 text-slate-950 outline-none" required />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-2xl border border-white/12 bg-white/95 px-4 py-3 text-slate-950 outline-none">
          <option value="teacher">Teacher</option>
          <option value="parent">Parent</option>
          <option value="admin">School Admin</option>
        </select>
      </div>

      <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="Email" className="w-full rounded-2xl border border-white/12 bg-white/95 px-4 py-3 text-slate-950 outline-none" required />

      <input
        value={locationQuery}
        onChange={(e) => setLocationQuery(e.target.value)}
        placeholder="Search city/state/district"
        className="w-full rounded-2xl border border-white/12 bg-white/95 px-4 py-3 text-slate-950 outline-none"
      />
      {locationResults.length > 0 ? (
        <div className="max-h-44 overflow-auto rounded-xl border border-[var(--bb-teal)]/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,255,255,0.96))] p-1 shadow-[0_12px_28px_rgba(1,194,194,0.16)]">
          {locationResults.map((r, i) => (
            <button
              key={`${r.label}-${i}`}
              type="button"
              className="block w-full rounded-lg px-3 py-2 text-left text-xs text-slate-700 hover:bg-[rgba(1,194,194,0.12)]"
              onClick={() => {
                setForm({ ...form, city: r.city, state: r.state, district: r.district || form.district });
                setLocationQuery(r.label);
                setLocationResults([]);
              }}
            >
              <div className="font-medium text-[var(--bb-dark-teal)]">{[r.city, r.state].filter(Boolean).join(", ") || "Location"}</div>
              <div className="text-[11px] text-slate-500">{r.district ? `${r.district} • ` : ""}{r.label}</div>
            </button>
          ))}
        </div>
      ) : null}

      {form.city || form.state || form.district ? (
        <div className="rounded-xl border border-[var(--bb-teal)]/35 bg-[linear-gradient(135deg,rgba(1,194,194,0.08),rgba(87,183,217,0.08))] px-4 py-3 text-xs text-slate-700">
          <span className="font-semibold">Location selected:</span>{" "}
          {[form.city, form.state, form.district].filter(Boolean).join(" • ")}
          <button
            type="button"
            onClick={() => {
              setForm({ ...form, city: "", state: "", district: "" });
              setLocationQuery("");
            }}
            className="ml-2 text-slate-500 hover:opacity-70"
          >
            Clear
          </button>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <input value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} placeholder="School / Organization name" className="w-full rounded-2xl border border-white/12 bg-white/95 px-4 py-3 text-slate-950 outline-none" required />
        <input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="Organization (optional)" className="w-full rounded-2xl border border-white/12 bg-white/95 px-4 py-3 text-slate-950 outline-none" />
      </div>

      <div className="flex overflow-hidden rounded-2xl border border-white/12 bg-white/95">
        <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type={showPassword ? "text" : "password"} placeholder="Password" className="w-full px-4 py-3 text-slate-950 outline-none" required />
        <button type="button" onClick={() => setShowPassword((v) => !v)} className="px-4 text-sm font-medium text-slate-500 transition hover:opacity-70">
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      {error ? <div className="text-sm text-[#ffd3cb]">{error}</div> : null}
      {message ? <div className="text-sm text-white/78">{message}</div> : null}
      <button type="submit" className="btn-light w-full" disabled={loading}>{loading ? "Registering..." : "Create account"}</button>
    </form>
  );
}

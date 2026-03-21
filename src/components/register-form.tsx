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

    setMessage(`Verification code for ${json.email}: ${json.verificationCode}`);
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
        placeholder="Search city/state/district (autocomplete)"
        className="w-full rounded-2xl border border-white/12 bg-white/95 px-4 py-3 text-slate-950 outline-none"
      />
      {locationResults.length > 0 ? (
        <div className="max-h-40 overflow-auto rounded-xl border border-white/15 bg-white/95 p-1">
          {locationResults.map((r, i) => (
            <button
              key={`${r.label}-${i}`}
              type="button"
              className="block w-full rounded-lg px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-100"
              onClick={() => {
                setForm({ ...form, city: r.city, state: r.state, district: r.district || form.district });
                setLocationQuery(r.label);
                setLocationResults([]);
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className="w-full rounded-2xl border border-white/12 bg-white/95 px-4 py-3 text-slate-950 outline-none" />
        <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="State" className="w-full rounded-2xl border border-white/12 bg-white/95 px-4 py-3 text-slate-950 outline-none" />
        <input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} placeholder="District" className="w-full rounded-2xl border border-white/12 bg-white/95 px-4 py-3 text-slate-950 outline-none" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} placeholder="School / Organization name" className="w-full rounded-2xl border border-white/12 bg-white/95 px-4 py-3 text-slate-950 outline-none" required />
        <input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="Organization (optional)" className="w-full rounded-2xl border border-white/12 bg-white/95 px-4 py-3 text-slate-950 outline-none" />
      </div>

      <div className="flex overflow-hidden rounded-2xl border border-white/12 bg-white/95">
        <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type={showPassword ? "text" : "password"} placeholder="Password" className="w-full px-4 py-3 text-slate-950 outline-none" required />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="px-4 text-sm font-medium text-slate-500 transition hover:bg-black/5 hover:text-slate-600"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      {error ? <div className="text-sm text-[#ffd3cb]">{error}</div> : null}
      {message ? <div className="text-sm text-white/78">{message}</div> : null}
      <button type="submit" className="btn-light w-full" disabled={loading}>{loading ? "Registering..." : "Create account"}</button>
    </form>
  );
}

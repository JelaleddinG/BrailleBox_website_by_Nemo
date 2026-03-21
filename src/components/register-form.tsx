"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", organization: "", school: "", password: "", role: "teacher" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error || 'Could not register.');
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
      <div className="grid gap-4 md:grid-cols-2">
        <input value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} placeholder="School" className="w-full rounded-2xl border border-white/12 bg-white/95 px-4 py-3 text-slate-950 outline-none" required />
        <input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="District / Organization" className="w-full rounded-2xl border border-white/12 bg-white/95 px-4 py-3 text-slate-950 outline-none" />
      </div>
      <div className="flex overflow-hidden rounded-2xl border border-white/12 bg-white/95">
        <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type={showPassword ? 'text' : 'password'} placeholder="Password" className="w-full px-4 py-3 text-slate-950 outline-none" required />
        <button type="button" onClick={() => setShowPassword((v) => !v)} className="px-4 text-sm font-medium text-slate-500 transition hover:text-[var(--bb-yellow)] hover:underline">{showPassword ? 'Hide' : 'Show'}</button>
      </div>
      {error ? <div className="text-sm text-[#ffd3cb]">{error}</div> : null}
      {message ? <div className="text-sm text-white/78">{message}</div> : null}
      <button type="submit" className="btn-light w-full" disabled={loading}>{loading ? 'Registering...' : 'Create account'}</button>
    </form>
  );
}

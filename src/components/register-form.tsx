"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", organization: "", password: "" });
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

    setMessage(`Verification code generated for ${json.email}. ${json.delivery || ''} Code: ${json.verificationCode}`);
    setLoading(false);
    router.push(`/verify?email=${encodeURIComponent(form.email)}`);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="w-full rounded-2xl border border-white/12 bg-white/95 px-4 py-3 text-slate-950 outline-none" required />
      <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="Email" className="w-full rounded-2xl border border-white/12 bg-white/95 px-4 py-3 text-slate-950 outline-none" required />
      <input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="Organization" className="w-full rounded-2xl border border-white/12 bg-white/95 px-4 py-3 text-slate-950 outline-none" required />
      <div className="flex overflow-hidden rounded-2xl border border-white/12 bg-white/95">
        <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type={showPassword ? 'text' : 'password'} placeholder="Password" className="w-full px-4 py-3 text-slate-950 outline-none" required />
        <button type="button" onClick={() => setShowPassword((v) => !v)} className="px-4 text-slate-500">{showPassword ? '🙈' : '👁️'}</button>
      </div>
      {error ? <div className="text-sm text-[#ffd3cb]">{error}</div> : null}
      {message ? <div className="text-sm text-white/78">{message}</div> : null}
      <button type="submit" className="btn-light w-full" disabled={loading}>{loading ? 'Registering...' : 'Create account'}</button>
    </form>
  );
}

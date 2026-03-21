"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@test.edu");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role: "admin" }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error || "Login failed.");
      setLoading(false);
      return;
    }

    router.push("/dashboard/admin");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-white">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded-2xl border border-white/12 bg-white/95 px-4 py-3 text-slate-950 outline-none transition focus:border-[var(--bb-blue)]" required />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-white">Password</label>
        <div className="flex overflow-hidden rounded-2xl border border-white/12 bg-white/95">
          <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} className="w-full px-4 py-3 text-slate-950 outline-none" required />
          <button type="button" onClick={() => setShowPassword((v) => !v)} className="px-4 text-sm font-medium text-slate-500 transition hover:bg-black/5 hover:text-slate-600">{showPassword ? "Hide" : "Show"}</button>
        </div>
      </div>
      {error ? <div className="text-sm text-[#ffd3cb]">{error}</div> : null}
      <button type="submit" className="btn-auth btn-auth-admin" disabled={loading}>{loading ? "Logging in..." : "Login to Admin Portal"}</button>
      <div className="text-center text-sm text-white/72">Not an admin? <Link href="/login" className="auth-link font-medium underline underline-offset-4">Choose different role</Link></div>
    </form>
  );
}

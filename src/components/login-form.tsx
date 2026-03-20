"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("test@test.edu");
  const [password, setPassword] = useState("password");
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
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error || "Login failed.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-white">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="w-full rounded-2xl border border-white/12 bg-white/95 px-4 py-3 text-slate-950 outline-none"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-white">Password</label>
        <div className="flex overflow-hidden rounded-2xl border border-white/12 bg-white/95">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-3 text-slate-950 outline-none"
            required
          />
          <button type="button" onClick={() => setShowPassword((v) => !v)} className="px-4 text-slate-500">
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
      </div>
      {error ? <div className="text-sm text-[#ffd3cb]">{error}</div> : null}
      <button type="submit" className="btn-light w-full" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      <div className="text-center text-sm text-white/72">
        Don’t have an account? <Link href="/register" className="underline underline-offset-4">Register</Link>
      </div>
    </form>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error || 'Verification failed.');
      setLoading(false);
      return;
    }
    router.push('/login');
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full rounded-2xl border border-white/12 bg-white/95 px-4 py-3 text-slate-950 outline-none" required />
      <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Verification code" className="w-full rounded-2xl border border-white/12 bg-white/95 px-4 py-3 text-slate-950 outline-none" required />
      {error ? <div className="text-sm text-[#ffd3cb]">{error}</div> : null}
      <button type="submit" className="btn-light w-full" disabled={loading}>{loading ? 'Verifying...' : 'Verify account'}</button>
    </form>
  );
}

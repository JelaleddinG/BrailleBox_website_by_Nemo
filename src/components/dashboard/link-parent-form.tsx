"use client";

import { useState } from "react";

export function LinkParentForm({ studentId }: { studentId: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const link = async () => {
    setStatus("");
    const res = await fetch(`/api/students/${studentId}/link-parent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parentEmail: email }),
    });
    const j = await res.json().catch(() => ({}));
    setStatus(res.ok ? "Parent linked." : (j.error || "Failed to link"));
  };

  return (
    <div className="mt-6 rounded-[1.2rem] bg-[#f8fbfb] p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Link parent to student</div>
      <div className="mt-3 flex gap-2">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Parent email" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <button type="button" onClick={link} className="btn-dark">Link</button>
      </div>
      {status ? <div className="mt-2 text-xs text-slate-600">{status}</div> : null}
    </div>
  );
}

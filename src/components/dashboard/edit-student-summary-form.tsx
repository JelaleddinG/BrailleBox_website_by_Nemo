"use client";

import { useState } from "react";

export function EditStudentSummaryForm({
  studentId,
  initial,
}: {
  studentId: string;
  initial: { profile_summary?: string; strengths?: string; support_needs?: string; goals?: string; notes?: string };
}) {
  const [form, setForm] = useState({
    profile_summary: initial.profile_summary || "",
    strengths: initial.strengths || "",
    support_needs: initial.support_needs || "",
    goals: initial.goals || "",
    notes: initial.notes || "",
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const save = async () => {
    setSaving(true);
    setStatus("");
    const res = await fetch(`/api/students/${studentId}/summary`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setStatus(res.ok ? "Saved." : "Save failed.");
  };

  return (
    <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
      <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Edit student summary</div>
      <div className="mt-4 grid gap-4">
        <textarea value={form.profile_summary} onChange={(e) => setForm({ ...form, profile_summary: e.target.value })} placeholder="Profile summary" className="min-h-[100px] w-full rounded-xl border border-slate-200 px-4 py-3" />
        <textarea value={form.strengths} onChange={(e) => setForm({ ...form, strengths: e.target.value })} placeholder="Strengths" className="min-h-[90px] w-full rounded-xl border border-slate-200 px-4 py-3" />
        <textarea value={form.support_needs} onChange={(e) => setForm({ ...form, support_needs: e.target.value })} placeholder="Support needs" className="min-h-[90px] w-full rounded-xl border border-slate-200 px-4 py-3" />
        <textarea value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value })} placeholder="Goals" className="min-h-[90px] w-full rounded-xl border border-slate-200 px-4 py-3" />
        <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Teacher comments / notes" className="min-h-[90px] w-full rounded-xl border border-slate-200 px-4 py-3" />
        <div className="flex items-center gap-3">
          <button type="button" onClick={save} disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save summary"}</button>
          {status ? <span className="text-sm text-slate-600">{status}</span> : null}
        </div>
      </div>
    </div>
  );
}

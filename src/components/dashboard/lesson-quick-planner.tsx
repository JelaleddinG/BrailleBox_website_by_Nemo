"use client";

import { useState } from "react";

export function LessonQuickPlanner({ studentId }: { studentId: string }) {
  const [objective, setObjective] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const create = async () => {
    if (!objective.trim()) return;
    setSaving(true);
    setStatus("");
    const res = await fetch('/api/lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, objective, scheduledFor: scheduledFor || null }),
    });
    const j = await res.json().catch(() => ({}));
    setSaving(false);
    if (res.ok) {
      setObjective("");
      setScheduledFor("");
      setStatus('Lesson scheduled.');
    } else {
      setStatus(j.error || 'Failed to schedule lesson.');
    }
  };

  return (
    <div className="mt-6 rounded-[1.2rem] bg-[#f8fbfb] p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Lesson quick planner</div>
      <p className="mt-2 text-sm text-slate-600">Set objective and schedule. BrailleBox auto-builds a 3-step adaptive session.</p>
      <input value={objective} onChange={(e) => setObjective(e.target.value)} placeholder="Objective (e.g., improve dots 2/5 distinction)" className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      <div className="mt-2 flex items-center gap-2">
        <input value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)} type="datetime-local" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <button type="button" onClick={create} disabled={saving} className="btn-dark">{saving ? 'Scheduling...' : 'Schedule lesson'}</button>
      </div>
      {status ? <div className="mt-2 text-xs text-slate-600">{status}</div> : null}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

type Agent = {
  id: string;
  name: string;
  role: string;
  status: string;
  currentTask: string;
  lastUpdate?: string;
  color?: string;
};

type Activity = {
  time: string;
  text: string;
  by: string;
};

export function OpsBoard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [note, setNote] = useState("");

  const load = async () => {
    const res = await fetch('/api/ops/status');
    const json = await res.json().catch(() => ({ agents: [], activity: [] }));
    setAgents(json.agents || []);
    setActivity(json.activity || []);
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  const addNote = async () => {
    if (!note.trim()) return;
    await fetch('/api/ops/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    });
    setNote('');
    load();
  };

  const colorClass = (c?: string) => {
    if (c === 'orange') return 'border-[var(--bb-orange)]/40 bg-[#fff6f3]';
    if (c === 'blue') return 'border-[var(--bb-blue)]/40 bg-[#f3fbff]';
    return 'border-[var(--bb-teal)]/35 bg-[#f3fffd]';
  };

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_.6fr]">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          {agents.map((a) => (
            <div key={a.id} className={`rounded-2xl border p-4 ${colorClass(a.color)}`}>
              <div className="text-sm font-semibold text-slate-900">{a.name}</div>
              <div className="text-xs text-slate-500">{a.role}</div>
              <div className="mt-2 inline-flex rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-700">{a.status}</div>
              <div className="mt-3 text-xs text-slate-700">{a.currentTask}</div>
              <div className="mt-2 text-[11px] text-slate-500">{a.lastUpdate ? new Date(a.lastUpdate).toLocaleString() : 'No updates yet'}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.06)]">
          <div className="text-sm uppercase tracking-[0.18em] text-slate-500">Activity Log</div>
          <div className="mt-4 max-h-[360px] space-y-3 overflow-auto">
            {activity.map((x, i) => (
              <div key={i} className="rounded-lg border border-slate-100 p-3">
                <div className="text-xs text-slate-500">{new Date(x.time).toLocaleString()} • {x.by}</div>
                <div className="mt-1 text-sm text-slate-700">{x.text}</div>
              </div>
            ))}
            {activity.length === 0 ? <div className="text-sm text-slate-500">No activity yet.</div> : null}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.06)] h-fit">
        <div className="text-sm uppercase tracking-[0.18em] text-slate-500">Ops Notes</div>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note for the ops timeline..." className="mt-3 min-h-[140px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        <button type="button" onClick={addNote} className="btn-dark mt-3 w-full">Log note</button>
      </div>
    </div>
  );
}

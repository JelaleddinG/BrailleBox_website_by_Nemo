"use client";

import { useEffect, useState } from "react";

type LiveEvent = {
  exercise_type?: string;
  expected_pattern?: string;
  actual_pattern?: string;
  is_correct?: number;
  hesitation_ms?: number;
  created_at?: string;
};

export function LiveSessionPanel({ studentId }: { studentId: string }) {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [lastConnected, setLastConnected] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const tick = async () => {
      const res = await fetch(`/api/students/${studentId}/live`);
      const json = await res.json().catch(() => ({}));
      if (!active) return;
      const live = json.live || {};
      setEvents(Array.isArray(live.events) ? live.events : []);
      setLastConnected(live.lastConnected || null);
    };

    tick();
    const interval = setInterval(tick, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [studentId]);

  return (
    <div className="mt-6 rounded-[1.2rem] bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.06)]">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Live session monitor</div>
      <div className="mt-2 text-sm text-slate-600">Last sync: {lastConnected ? new Date(lastConnected).toLocaleString() : "No sync yet"}</div>
      <div className="mt-3 grid gap-2">
        {events.slice(0, 6).map((e, i) => (
          <div key={i} className="rounded-lg border border-slate-100 p-2 text-xs text-slate-700">
            <strong>{e.exercise_type || "exercise"}</strong> • {e.is_correct ? "Correct" : "Incorrect"}
            {e.hesitation_ms ? ` • Hesitation ${Math.round(e.hesitation_ms / 1000)}s` : ""}
            {e.expected_pattern || e.actual_pattern ? ` • ${e.expected_pattern || "?"} → ${e.actual_pattern || "?"}` : ""}
          </div>
        ))}
        {events.length === 0 ? <div className="text-xs text-slate-500">No live events yet.</div> : null}
      </div>
    </div>
  );
}

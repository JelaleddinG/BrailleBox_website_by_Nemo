"use client";

import { useMemo, useState } from "react";

export function MissionImpactSlider() {
  const [students, setStudents] = useState(120);

  const derived = useMemo(() => {
    const teachers = Math.max(1, Math.round(students / 12));
    const reports = Math.round((students / 120) * 18);
    const visibility = Math.min(100, Math.round(28 + students / 8));
    return { teachers, reports, visibility };
  }, [students]);

  return (
    <section className="border-b border-black/6 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr] lg:items-start">
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-yellow)]">Interactive impact</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Drag the system forward.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/74">
              This is not a promise of exact outcomes. It is a simple way to show
              what better support can look like when more students, teachers, and
              schools are connected through a clearer learning system.
            </p>

            <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm uppercase tracking-[0.2em] text-white/56">Students supported</span>
                <span className="text-3xl font-semibold tracking-[-0.04em] text-[var(--bb-yellow)]">{students}</span>
              </div>
              <input
                type="range"
                min={20}
                max={1000}
                step={20}
                value={students}
                onChange={(e) => setStudents(Number(e.target.value))}
                className="mt-6 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-[var(--bb-yellow)]"
              />
              <div className="mt-4 flex justify-between text-xs uppercase tracking-[0.18em] text-white/40">
                <span>20</span>
                <span>1000</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
              <div className="text-sm uppercase tracking-[0.2em] text-white/56">Teachers with clearer visibility</div>
              <div className="mt-3 text-5xl font-semibold tracking-[-0.05em] text-[var(--bb-yellow)]">{derived.teachers}</div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-[var(--bb-yellow)] to-[var(--bb-orange)]" style={{ width: `${Math.min(100, (derived.teachers / 84) * 100)}%` }} />
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
              <div className="text-sm uppercase tracking-[0.2em] text-white/56">Reporting burden reduced</div>
              <div className="mt-3 text-5xl font-semibold tracking-[-0.05em] text-[var(--bb-teal)]">{derived.reports}%</div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-[var(--bb-dark-teal)] to-[var(--bb-teal)]" style={{ width: `${derived.reports}%` }} />
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
              <div className="text-sm uppercase tracking-[0.2em] text-white/56">Learning visibility</div>
              <div className="mt-3 text-5xl font-semibold tracking-[-0.05em] text-[var(--bb-blue)]">{derived.visibility}%</div>
              <div className="mt-5 grid grid-cols-10 gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-8 rounded-full ${i < Math.round(derived.visibility / 10) ? "bg-[var(--bb-blue)]" : "bg-white/10"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

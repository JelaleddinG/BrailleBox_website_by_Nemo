export function ActivityVisual({ visual }: { visual?: string | null }) {
  if (!visual) return null;

  try {
    const parsed = JSON.parse(visual) as { completed: number; target: number; score: number; category: string; title: string };
    return (
      <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
        <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Latest exercise activity</div>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{parsed.title}</h2>
        <p className="mt-2 text-base text-slate-600">{parsed.category}</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <div className="text-5xl font-semibold tracking-[-0.05em] text-[var(--bb-orange)]">{parsed.score}%</div>
            <p className="mt-3 text-sm leading-7 text-slate-600">A quick TVI view of the latest completed exercise so the teacher can see performance at a glance.</p>
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
              <span>Completed prompts</span>
              <span>{parsed.completed}/{parsed.target}</span>
            </div>
            <div className="grid grid-cols-10 gap-2">
              {Array.from({ length: parsed.target }).map((_, i) => (
                <div key={i} className={`h-8 rounded-full ${i < parsed.completed ? "bg-[var(--bb-dark-teal)]" : "bg-slate-100"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } catch {
    return null;
  }
}

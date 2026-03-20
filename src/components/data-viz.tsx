type BarDatum = {
  label: string;
  value: number;
  tone?: "teal" | "orange" | "yellow" | "blue";
  note?: string;
};

const toneClass: Record<NonNullable<BarDatum["tone"]>, string> = {
  teal: "from-[var(--bb-dark-teal)] to-[var(--bb-teal)]",
  orange: "from-[var(--bb-orange)] to-[#ff9b7a]",
  yellow: "from-[var(--bb-yellow)] to-[#ffe88a]",
  blue: "from-[var(--bb-blue)] to-[#a8ddf0]",
};

export function DataBarChart({
  title,
  subtitle,
  data,
  suffix = "",
}: {
  title: string;
  subtitle?: string;
  data: BarDatum[];
  suffix?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">{title}</h3>
      {subtitle ? <p className="mt-3 text-sm leading-6 text-slate-500">{subtitle}</p> : null}
      <div className="mt-8 space-y-5">
        {data.map((item) => {
          const width = `${(item.value / max) * 100}%`;
          return (
            <div key={item.label}>
              <div className="mb-2 flex items-end justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-slate-700">{item.label}</div>
                  {item.note ? <div className="text-xs text-slate-500">{item.note}</div> : null}
                </div>
                <div className="text-sm font-semibold text-slate-900">{item.value}{suffix}</div>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${toneClass[item.tone ?? "teal"]}`}
                  style={{ width }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function StatGrid({
  items,
  accent = "teal",
}: {
  items: { value: string; label: string }[];
  accent?: "teal" | "orange" | "yellow" | "blue";
}) {
  const colorMap = {
    teal: "text-[var(--bb-dark-teal)]",
    orange: "text-[var(--bb-orange)]",
    yellow: "text-[var(--bb-yellow)]",
    blue: "text-[var(--bb-blue)]",
  } as const;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.value + item.label} className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.05)]">
          <div className={`text-5xl font-semibold tracking-[-0.05em] ${colorMap[accent]}`}>{item.value}</div>
          <p className="mt-4 text-base leading-7 text-slate-600">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export function DotMatrix({
  title,
  subtitle,
  filled,
  total = 25,
  tone = "teal",
}: {
  title: string;
  subtitle?: string;
  filled: number;
  total?: number;
  tone?: "teal" | "orange" | "yellow" | "blue";
}) {
  const dotColor = {
    teal: "bg-[var(--bb-dark-teal)]",
    orange: "bg-[var(--bb-orange)]",
    yellow: "bg-[var(--bb-yellow)]",
    blue: "bg-[var(--bb-blue)]",
  } as const;

  return (
    <div className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">{title}</h3>
      {subtitle ? <p className="mt-3 text-sm leading-6 text-slate-500">{subtitle}</p> : null}
      <div className="mt-8 grid grid-cols-5 gap-3">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-8 rounded-full ${i < filled ? dotColor[tone] : "bg-slate-100"}`}
          />
        ))}
      </div>
    </div>
  );
}

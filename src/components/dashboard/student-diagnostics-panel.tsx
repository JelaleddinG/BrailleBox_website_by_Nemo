export function StudentDiagnosticsPanel({ diagnostics }: { diagnostics: { accuracy: number; avgHesitationSec: number; topConfusions: string[]; retentionRisk: string; interventionSuccess: number; } }) {
  return (
    <div className="mt-6 rounded-[1.2rem] bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.06)]">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Student intelligence</div>
      <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-[#f8fbfb] p-3 text-sm text-slate-700"><strong>Accuracy trend:</strong> {diagnostics.accuracy}%</div>
        <div className="rounded-lg bg-[#f8fbfb] p-3 text-sm text-slate-700"><strong>Avg hesitation:</strong> {diagnostics.avgHesitationSec}s</div>
        <div className="rounded-lg bg-[#f8fbfb] p-3 text-sm text-slate-700"><strong>Retention risk:</strong> {diagnostics.retentionRisk}</div>
        <div className="rounded-lg bg-[#f8fbfb] p-3 text-sm text-slate-700 md:col-span-2"><strong>Top confusions:</strong> {diagnostics.topConfusions.length ? diagnostics.topConfusions.join(", ") : "No strong confusion pattern yet."}</div>
        <div className="rounded-lg bg-[#f8fbfb] p-3 text-sm text-slate-700"><strong>Intervention success:</strong> {diagnostics.interventionSuccess}%</div>
      </div>
    </div>
  );
}

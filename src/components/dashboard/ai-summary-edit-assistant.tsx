"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SummaryEditAssistant({ studentId }: { studentId: string }) {
  const router = useRouter();
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const apply = async () => {
    if (!instruction.trim()) return;
    setLoading(true);
    setStatus("");

    const res = await fetch(`/api/students/${studentId}/ai-edit-summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instruction }),
    });

    setLoading(false);
    if (res.ok) {
      setStatus("Summary updated.");
      setInstruction("");
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setStatus(j.error || "Failed to update summary.");
    }
  };

  return (
    <div className="mt-6 rounded-[1.2rem] bg-[#f8fbfb] p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Summary edit assistant</div>
      <p className="mt-2 text-sm text-slate-600">Describe how you want the summary updated (example: "make this shorter and parent-friendly").</p>
      <div className="mt-3 flex gap-2">
        <input
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="Describe the summary change..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <button type="button" onClick={apply} disabled={loading} className="btn-dark">
          {loading ? "Applying..." : "Apply change"}
        </button>
      </div>
      {status ? <div className="mt-2 text-xs text-slate-600">{status}</div> : null}
    </div>
  );
}

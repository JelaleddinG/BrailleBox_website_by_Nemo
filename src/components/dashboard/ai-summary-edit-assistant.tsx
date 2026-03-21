"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AISummaryEditAssistant({ studentId }: { studentId: string }) {
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
      setStatus("Updated summary using AI instruction.");
      setInstruction("");
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setStatus(j.error || "Failed to update summary.");
    }
  };

  return (
    <div className="mt-6 rounded-[1.2rem] bg-[#f8fbfb] p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">AI summary edit</div>
      <p className="mt-2 text-sm text-slate-600">Tell AI how to revise the summary (e.g., "make this parent-friendly and shorter").</p>
      <div className="mt-3 flex gap-2">
        <input
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="Ask AI to change summary..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <button type="button" onClick={apply} disabled={loading} className="btn-dark">
          {loading ? "Applying..." : "Apply with AI"}
        </button>
      </div>
      {status ? <div className="mt-2 text-xs text-slate-600">{status}</div> : null}
    </div>
  );
}

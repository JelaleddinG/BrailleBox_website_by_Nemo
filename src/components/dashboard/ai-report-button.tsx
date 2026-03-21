"use client";

import { useState } from "react";

export function AIReportButton({ studentId, studentName }: { studentId: string; studentName: string }) {
  const [status, setStatus] = useState("");

  const generate = async () => {
    setStatus("Generating...");
    const res = await fetch(`/api/students/${studentId}/ai-report`);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus(json.error || "Failed");
      return;
    }

    const blob = new Blob([JSON.stringify(json.report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${studentName.replace(/\s+/g, "_")}_ai_progress_report.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Downloaded");
  };

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={generate} className="btn-dark">Generate AI report</button>
      {status ? <span className="text-xs text-slate-500">{status}</span> : null}
    </div>
  );
}

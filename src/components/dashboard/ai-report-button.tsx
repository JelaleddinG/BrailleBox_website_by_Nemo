"use client";

import { useState } from "react";

export function ReportButton({ studentId, studentName }: { studentId: string; studentName: string }) {
  const [status, setStatus] = useState("");

  const generate = async () => {
    setStatus("Generating...");
    const res = await fetch(`/api/students/${studentId}/report`);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setStatus(j.error || "Failed");
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${studentName.replace(/\s+/g, "_")}_progress_report.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Downloaded PDF");
  };

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={generate} className="btn-dark">Generate report</button>
      {status ? <span className="text-xs text-slate-500">{status}</span> : null}
    </div>
  );
}

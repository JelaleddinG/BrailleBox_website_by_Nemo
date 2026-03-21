"use client";

import { useState } from "react";

export function ParentDownloadReportButton({ studentId, studentName }: { studentId: string; studentName: string }) {
  const [status, setStatus] = useState("");

  const download = async () => {
    setStatus("Preparing...");
    const res = await fetch(`/api/students/${studentId}/report`);
    if (!res.ok) {
      setStatus("Unavailable");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${studentName.replace(/\s+/g, "_")}_progress_report.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Downloaded");
  };

  return (
    <div className="mt-3 flex items-center gap-2">
      <button type="button" onClick={download} className="btn-message-send">Download report</button>
      {status ? <span className="text-xs text-slate-500">{status}</span> : null}
    </div>
  );
}

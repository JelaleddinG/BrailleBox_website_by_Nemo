"use client";

import { useState } from "react";

export function AdminReportButton({ studentId, studentName }: { studentId: string; studentName: string }) {
  const [status, setStatus] = useState("");

  const generate = async () => {
    setStatus("Generating...");
    const res = await fetch(`/api/admin/report?studentId=${encodeURIComponent(studentId)}`);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus(json.error || "Failed");
      return;
    }

    const blob = new Blob([JSON.stringify(json.report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${studentName.replace(/\s+/g, "_")}_compliance_report.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Downloaded");
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={generate} className="btn-admin-report">Generate report</button>
      {status ? <span className="text-xs text-slate-500">{status}</span> : null}
    </div>
  );
}

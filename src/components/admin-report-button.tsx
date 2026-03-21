"use client";

import { useState } from "react";

export function AdminReportButton({ studentId, studentName }: { studentId: string; studentName: string }) {
  const [status, setStatus] = useState("");

  const generate = async () => {
    setStatus("Generating...");
    const res = await fetch(`/api/admin/report?studentId=${encodeURIComponent(studentId)}`);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      setStatus(text || "Failed");
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${studentName.replace(/\s+/g, "_")}_admin_compliance_report.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Downloaded PDF");
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={generate} className="btn-admin-report">Generate report</button>
      {status ? <span className="text-xs text-slate-500">{status}</span> : null}
    </div>
  );
}

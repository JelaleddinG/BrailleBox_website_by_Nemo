"use client";

import { useState } from "react";

export function AdminBoardPacketButton() {
  const [status, setStatus] = useState("");

  const generate = async () => {
    setStatus("Generating...");
    const res = await fetch('/api/admin/board-packet');
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus(json.error || 'Failed');
      return;
    }

    const blob = new Blob([JSON.stringify(json.packet, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'district_board_packet.json';
    a.click();
    URL.revokeObjectURL(url);
    setStatus('Downloaded');
  };

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={generate} className="btn-admin-report">Board packet</button>
      {status ? <span className="text-xs text-slate-500">{status}</span> : null}
    </div>
  );
}

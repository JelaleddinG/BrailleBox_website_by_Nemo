"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeviceConnectButton({ studentId, connected, deviceName }: { studentId: string; connected?: boolean; deviceName?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (connected) {
    return <div className="rounded-full bg-[var(--bb-dark-teal)] px-5 py-3 text-sm font-semibold text-white">Device connected • {deviceName || "BrailleBox"}</div>;
  }

  return (
    <button
      className="btn-primary"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await fetch(`/api/students/${studentId}/device-connect`, { method: "POST" });
        router.refresh();
        setLoading(false);
      }}
    >
      {loading ? "Connecting..." : "Connect BrailleBox"}
    </button>
  );
}

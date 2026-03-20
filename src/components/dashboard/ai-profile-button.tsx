"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AIProfileButton({ studentId }: { studentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      className="btn-primary"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await fetch(`/api/students/${studentId}/ai-profile`, { method: "POST" });
        router.refresh();
        setLoading(false);
      }}
    >
      {loading ? "Generating profile..." : "Generate AI profile"}
    </button>
  );
}

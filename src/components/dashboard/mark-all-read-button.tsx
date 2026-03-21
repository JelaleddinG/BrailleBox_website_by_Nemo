"use client";

import { useRouter } from "next/navigation";

export function MarkAllReadButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="text-xs font-medium text-slate-500 hover:opacity-70"
      onClick={async () => {
        await fetch('/api/messages/read', { method: 'POST' });
        router.refresh();
      }}
    >
      Mark all read
    </button>
  );
}

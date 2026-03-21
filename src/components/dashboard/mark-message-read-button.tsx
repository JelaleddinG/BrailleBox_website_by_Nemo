"use client";

import { useRouter } from "next/navigation";

export function MarkMessageReadButton({ messageId }: { messageId: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      className="text-xs text-slate-500 hover:opacity-70"
      onClick={async () => {
        await fetch('/api/messages/read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messageId }),
        });
        router.refresh();
      }}
    >
      Mark read
    </button>
  );
}

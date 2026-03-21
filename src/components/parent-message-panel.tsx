"use client";

import { useState } from "react";

export function ParentMessagePanel({ teacherId, studentId }: { teacherId: string; studentId: string }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("");

  const send = async () => {
    setStatus("");
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientId: teacherId, recipientType: "teacher", studentId, subject, body }),
    });
    if (res.ok) {
      setSubject("");
      setBody("");
      setStatus("Message sent.");
    } else {
      const j = await res.json().catch(() => ({}));
      setStatus(j.error || "Failed to send.");
    }
  };

  return (
    <div className="mt-4 rounded-xl bg-[#fff3ef] p-4">
      <div className="text-sm font-semibold text-[var(--bb-orange)]">Message Teacher</div>
      <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="mt-3 w-full rounded-lg border border-orange-100 px-3 py-2 text-sm" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your message" className="mt-2 min-h-[90px] w-full rounded-lg border border-orange-100 px-3 py-2 text-sm" />
      <div className="mt-2 flex items-center gap-3">
        <button onClick={send} className="btn-message-send">Send message</button>
        {status ? <span className="text-xs text-slate-600">{status}</span> : null}
      </div>
    </div>
  );
}

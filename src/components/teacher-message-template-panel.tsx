"use client";

import { useState } from "react";

const templates = [
  "Student progressing well in this week’s Braille sessions.",
  "Needs reinforcement in targeted dot patterns before next fluency session.",
  "Great effort today. Focus next on consistency and independent recall.",
];

export function TeacherMessageTemplatePanel({ parentId, studentId }: { parentId: string; studentId: string }) {
  const [text, setText] = useState(templates[0]);
  const [status, setStatus] = useState("");

  const send = async () => {
    setStatus("");
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId: parentId, recipientType: 'parent', studentId, subject: 'Teacher update', body: text }),
    });
    setStatus(res.ok ? 'Update sent.' : 'Failed to send update.');
  };

  return (
    <div className="mt-3 rounded-xl bg-[#f8fbfb] p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Parent update templates</div>
      <select value={text} onChange={(e) => setText(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
        {templates.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <textarea value={text} onChange={(e) => setText(e.target.value)} className="mt-2 min-h-[90px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      <div className="mt-2 flex items-center gap-2">
        <button type="button" className="btn-dark" onClick={send}>Send update</button>
        {status ? <span className="text-xs text-slate-500">{status}</span> : null}
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function NewStudentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    grade: "",
    age: "",
    progress_percent: "0",
    current_focus: "",
    recent_activity: "",
    notes: "",
  });

  const update = (key: string, value: string) => setForm((s) => ({ ...s, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error || "Could not create student.");
      setLoading(false);
      return;
    }

    router.push(`/dashboard/students/${json.id}`);
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Student name" className="rounded-2xl border border-black/10 bg-white px-4 py-3" required />
        <input value={form.grade} onChange={(e) => update("grade", e.target.value)} placeholder="Grade" className="rounded-2xl border border-black/10 bg-white px-4 py-3" />
        <input value={form.age} onChange={(e) => update("age", e.target.value)} placeholder="Age" type="number" className="rounded-2xl border border-black/10 bg-white px-4 py-3" />
        <input value={form.progress_percent} onChange={(e) => update("progress_percent", e.target.value)} placeholder="Progress %" type="number" className="rounded-2xl border border-black/10 bg-white px-4 py-3" />
      </div>
      <input value={form.current_focus} onChange={(e) => update("current_focus", e.target.value)} placeholder="Current focus" className="rounded-2xl border border-black/10 bg-white px-4 py-3" />
      <input value={form.recent_activity} onChange={(e) => update("recent_activity", e.target.value)} placeholder="Recent activity" className="rounded-2xl border border-black/10 bg-white px-4 py-3" />
      <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Teacher notes for AI drafting" className="min-h-[140px] rounded-2xl border border-black/10 bg-white px-4 py-3" />
      {error ? <div className="text-sm text-[var(--bb-orange)]">{error}</div> : null}
      <button className="btn-primary w-full md:w-fit" disabled={loading}>{loading ? "Creating..." : "Create student"}</button>
    </form>
  );
}

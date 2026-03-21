import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LogoutButton } from "@/components/logout-button";
import { MarkMessageReadButton } from "@/components/dashboard/mark-message-read-button";
import { MarkAllReadButton } from "@/components/dashboard/mark-all-read-button";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "parent") redirect("/dashboard/parent");
  if (session.role === "admin") redirect("/dashboard/admin");

  const students = db
    .prepare("SELECT id, name, grade, progress_percent, current_focus, recent_activity, updated_at FROM students WHERE teacher_id = ? ORDER BY name")
    .all(session.id) as Array<{
      id: string;
      name: string;
      grade?: string;
      progress_percent: number;
      current_focus?: string;
      recent_activity?: string;
      updated_at?: string;
    }>;

  const avgProgress = students.length
    ? Math.round(students.reduce((sum, s) => sum + s.progress_percent, 0) / students.length)
    : 0;

  const teachingFeed = students
    .map((s) => {
      let risk = 0;
      const reasons: string[] = [];
      if (s.progress_percent < 50) {
        risk += 45;
        reasons.push("Low progress baseline");
      } else if (s.progress_percent < 65) {
        risk += 25;
        reasons.push("Progress below target band");
      }

      const activity = (s.recent_activity || "").toLowerCase();
      if (activity.includes("needs") || activity.includes("reinforcement") || activity.includes("struggle")) {
        risk += 25;
        reasons.push("Recent struggle signal");
      }

      const updated = s.updated_at ? new Date(s.updated_at).getTime() : 0;
      const hoursSince = updated ? Math.round((Date.now() - updated) / 36e5) : 999;
      if (hoursSince > 72) {
        risk += 20;
        reasons.push("Inactivity > 72h");
      }

      const recommendation =
        s.progress_percent < 55
          ? "Run Dot Recognition Reinforcement (8 min)"
          : activity.includes("reinforcement")
            ? "Review targeted confusion set (dots 2/5/6)"
            : "Run Fluency Builder Level 2";

      return { ...s, risk, reasons, recommendation, hoursSince };
    })
    .sort((a, b) => b.risk - a.risk)
    .slice(0, 6);

  const inbox = db.prepare(`
    SELECT m.id, m.subject, m.body, m.is_read, m.created_at, p.name as parent_name, s.name as student_name
    FROM messages m
    LEFT JOIN parents p ON m.sender_id = p.id
    LEFT JOIN students s ON m.student_id = s.id
    WHERE m.recipient_id = ? AND m.recipient_type = 'teacher'
    ORDER BY m.created_at DESC
    LIMIT 6
  `).all(session.id) as Array<{ id: string; subject?: string; body: string; is_read?: number; created_at: string; parent_name?: string; student_name?: string }>;

  const unreadCount = inbox.filter((m) => !m.is_read).length;

  return (
    <main className="min-h-screen bg-[#f8fbfb] text-slate-950">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="/login" className="panel-back">← Back</Link>
            <div className="mt-2 text-sm uppercase tracking-[0.24em] text-[var(--bb-dark-teal)]">Teacher Dashboard</div>
            <h1 className="mt-3 text-5xl font-semibold tracking-[-0.05em]">Welcome back, {session.name}.</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">Review student progress, recent activity, and where support is needed next.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/students/new" className="btn-primary">New student</Link>
            <Link href="/onboarding/teacher" className="btn-dark">Onboarding</Link>
            <LogoutButton />
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Today’s Teaching Feed</div>
          <p className="mt-2 text-sm text-slate-600">Prioritized students needing immediate attention with suggested next actions.</p>
          <div className="mt-5 grid gap-4">
            {teachingFeed.map((item) => (
              <Link key={item.id} href={`/dashboard/students/${item.id}`} className="rounded-xl border border-slate-100 p-4 transition hover:border-[var(--bb-teal)]/35 hover:bg-[#f7fefe]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                    <div className="mt-1 text-xs text-slate-500">Risk score: {item.risk} • Last update: {item.hoursSince > 900 ? "Unknown" : `${item.hoursSince}h ago`}</div>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-xs font-semibold ${item.risk >= 60 ? 'bg-[#ffe8e3] text-[#b94733]' : item.risk >= 35 ? 'bg-[#fff4df] text-[#9a6a1c]' : 'bg-[#e8f8f8] text-[var(--bb-dark-teal)]'}`}>
                    {item.risk >= 60 ? 'High priority' : item.risk >= 35 ? 'Watch' : 'Stable'}
                  </div>
                </div>
                <div className="mt-3 text-sm text-slate-700"><strong>Suggested action:</strong> {item.recommendation}</div>
                <div className="mt-1 text-xs text-slate-500">{item.reasons.length ? item.reasons.join(" • ") : "No active risk flags"}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]"><div className="text-sm uppercase tracking-[0.2em] text-slate-500">Students</div><div className="mt-3 text-5xl font-semibold tracking-[-0.05em] text-[var(--bb-dark-teal)]">{students.length}</div></div>
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]"><div className="text-sm uppercase tracking-[0.2em] text-slate-500">Average progress</div><div className="mt-3 text-5xl font-semibold tracking-[-0.05em] text-[var(--bb-orange)]">{avgProgress}%</div></div>
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]"><div className="text-sm uppercase tracking-[0.2em] text-slate-500">School</div><div className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{session.school || "BrailleBox"}</div></div>
        </div>

        <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Parent messages</div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 ? <div className="rounded-full bg-[#e8f8f8] px-3 py-1 text-xs font-semibold text-[var(--bb-dark-teal)]">{unreadCount} unread</div> : null}
              {unreadCount > 0 ? <MarkAllReadButton /> : null}
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            {inbox.map((m) => (
              <div key={m.id} className={`rounded-xl border p-4 ${m.is_read ? 'border-slate-100 bg-white' : 'border-[var(--bb-teal)]/25 bg-[#f5fefe]'}`}>
                <div className="text-xs text-slate-500">From Parent: <span className="font-medium text-slate-700">{m.parent_name || 'Unknown parent'}</span></div>
                <div className="mt-1 text-xs text-slate-500">Student: <span className="font-medium text-slate-700">{m.student_name || 'Not specified'}</span></div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">{m.subject || 'Message'}</div>
                  {!m.is_read ? <MarkMessageReadButton messageId={m.id} /> : <span className="text-xs text-slate-400">Read</span>}
                </div>
                <div className="mt-1 text-sm text-slate-700">{m.body}</div>
              </div>
            ))}
            {inbox.length === 0 ? <div className="text-sm text-slate-500">No messages yet.</div> : null}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

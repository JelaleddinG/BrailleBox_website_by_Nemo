import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "parent") redirect("/dashboard/parent");
  if (session.role === "admin") redirect("/dashboard/admin");

  const students = db
    .prepare("SELECT id, name, grade, progress_percent, current_focus, recent_activity FROM students WHERE teacher_id = ? ORDER BY name")
    .all(session.id) as Array<{
      id: string;
      name: string;
      grade?: string;
      progress_percent: number;
      current_focus?: string;
      recent_activity?: string;
    }>;

  const avgProgress = students.length
    ? Math.round(students.reduce((sum, s) => sum + s.progress_percent, 0) / students.length)
    : 0;

  const inbox = db.prepare(`
    SELECT m.id, m.subject, m.body, m.created_at, p.name as parent_name, s.name as student_name
    FROM messages m
    LEFT JOIN parents p ON m.sender_id = p.id
    LEFT JOIN students s ON m.student_id = s.id
    WHERE m.recipient_id = ? AND m.recipient_type = 'teacher'
    ORDER BY m.created_at DESC
    LIMIT 6
  `).all(session.id) as Array<{ id: string; subject?: string; body: string; created_at: string; parent_name?: string; student_name?: string }>;

  return (
    <main className="min-h-screen bg-[#f8fbfb] text-slate-950">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-dark-teal)]">Teacher Dashboard</div>
            <h1 className="mt-3 text-5xl font-semibold tracking-[-0.05em]">Welcome back, {session.name}.</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Review student progress, recent activity, and where support is needed next.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/students/new" className="btn-primary">New student</Link>
            <LogoutButton />
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Students</div>
            <div className="mt-3 text-5xl font-semibold tracking-[-0.05em] text-[var(--bb-dark-teal)]">{students.length}</div>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Average progress</div>
            <div className="mt-3 text-5xl font-semibold tracking-[-0.05em] text-[var(--bb-orange)]">{avgProgress}%</div>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-500">School</div>
            <div className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{session.school || "BrailleBox"}</div>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Parent messages</div>
          <div className="mt-4 grid gap-3">
            {inbox.map((m) => (
              <div key={m.id} className="rounded-xl border border-slate-100 p-4">
                <div className="text-xs text-slate-500">From Parent: <span className="font-medium text-slate-700">{m.parent_name || 'Unknown parent'}</span></div>
                <div className="mt-1 text-xs text-slate-500">Student: <span className="font-medium text-slate-700">{m.student_name || 'Not specified'}</span></div>
                <div className="mt-2 text-sm font-semibold">{m.subject || 'Message'}</div>
                <div className="mt-1 text-sm text-slate-700">{m.body}</div>
              </div>
            ))}
            {inbox.length === 0 ? <div className="text-sm text-slate-500">No messages yet.</div> : null}
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Student progress</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Current classroom view</h2>
            </div>
          </div>

          <div className="mt-8 grid gap-5">
            {students.map((student) => (
              <Link key={student.id} href={`/dashboard/students/${student.id}`} className="rounded-[1.6rem] border border-black/8 p-6 transition hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-[-0.03em]">{student.name}</h3>
                    <p className="mt-2 text-sm text-slate-500">{student.grade || "Student"}</p>
                  </div>
                  <div className="min-w-[220px]">
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                      <span>Progress</span>
                      <span>{student.progress_percent}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-gradient-to-r from-[var(--bb-dark-teal)] to-[var(--bb-teal)]" style={{ width: `${student.progress_percent}%` }} />
                    </div>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[1.2rem] bg-[#f8fbfb] p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Current focus</div>
                    <div className="mt-2 text-sm leading-7 text-slate-700">{student.current_focus || "No current focus set"}</div>
                  </div>
                  <div className="rounded-[1.2rem] bg-[#f8fbfb] p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Recent activity</div>
                    <div className="mt-2 text-sm leading-7 text-slate-700">{student.recent_activity || "No recent activity recorded"}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

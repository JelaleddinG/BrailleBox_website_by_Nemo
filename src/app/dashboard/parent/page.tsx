import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ParentMessagePanel } from "@/components/parent-message-panel";

export default async function ParentDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "parent") redirect("/dashboard");

  const students = db.prepare(`
    SELECT s.id, s.name, s.grade, s.progress_percent, s.current_focus, s.recent_activity, s.profile_summary, s.notes, s.strengths, s.support_needs,
           t.id as teacher_id, t.name as teacher_name
    FROM parent_student ps
    JOIN students s ON ps.student_id = s.id
    JOIN teachers t ON s.teacher_id = t.id
    WHERE ps.parent_id = ?
    ORDER BY s.name
  `).all(session.id) as Array<any>;

  return (
    <main className="min-h-screen bg-[#fff8f6] text-slate-950">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
        <div>
          <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-orange)]">Parent Portal</div>
          <h1 className="mt-3 text-5xl font-semibold tracking-[-0.05em]">Hello, {session.name}.</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">Here is your child&apos;s current progress in simple terms.</p>
        </div>

        <div className="mt-10 grid gap-6">
          {students.map((student) => (
            <div key={student.id} className="rounded-[1.8rem] border border-black/8 bg-white p-7 shadow-[0_12px_34px_rgba(15,23,42,0.06)]">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-semibold">{student.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{student.grade || "Student"} • Teacher: {student.teacher_name}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Progress</div>
                  <div className="text-3xl font-semibold text-[var(--bb-orange)]">{student.progress_percent}%</div>
                </div>
              </div>

              <p className="mt-4 text-slate-700"><strong>Focus:</strong> {student.current_focus || "Teacher is setting goals."}</p>
              <p className="mt-2 text-slate-700"><strong>Recent activity:</strong> {student.recent_activity || "No recent activity yet."}</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg bg-[#fff3ef] p-3 text-sm text-slate-700"><strong>Current progress:</strong> {student.progress_percent}%</div>
                <div className="rounded-lg bg-[#fff3ef] p-3 text-sm text-slate-700"><strong>Teacher:</strong> {student.teacher_name}</div>
              </div>

              <details className="mt-4 rounded-xl bg-[#fff3ef] p-4">
                <summary className="cursor-pointer font-medium text-[var(--bb-orange)]">View detailed notes</summary>
                <p className="mt-3 text-sm leading-7 text-slate-700">{student.profile_summary || "No detailed summary yet."}</p>
                <p className="mt-2 text-sm leading-7 text-slate-700"><strong>Teacher comments:</strong> {student.notes || "No comments yet."}</p>
              </details>

              <ParentMessagePanel teacherId={student.teacher_id} studentId={student.id} />
            </div>
          ))}

          {students.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-slate-600">No students linked yet. Ask your teacher to connect your parent account.</div>
          ) : null}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

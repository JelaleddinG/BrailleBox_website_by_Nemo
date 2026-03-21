import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AdminReportButton } from "@/components/admin-report-button";
import { AdminBoardPacketButton } from "@/components/admin-board-packet-button";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/dashboard");

  const teachers = db.prepare("SELECT id, name, email FROM teachers WHERE school_id = ? ORDER BY name").all(session.schoolId) as Array<any>;
  const parents = db.prepare("SELECT id, name, email FROM parents WHERE school_id = ? ORDER BY name").all(session.schoolId) as Array<any>;
  const students = db.prepare("SELECT id, name, grade, progress_percent FROM students WHERE teacher_id IN (SELECT id FROM teachers WHERE school_id = ?) ORDER BY name").all(session.schoolId) as Array<any>;

  const avgLiteracyImprovement = students.length ? Math.round(students.reduce((s, i) => s + (i.progress_percent || 0), 0) / students.length) : 0;
  const activeTeachers = db.prepare("SELECT COUNT(DISTINCT teacher_id) as count FROM students WHERE teacher_id IN (SELECT id FROM teachers WHERE school_id = ?)").get(session.schoolId) as { count: number };
  const interventionRows = db.prepare("SELECT outcome_score FROM intervention_history WHERE teacher_id IN (SELECT id FROM teachers WHERE school_id = ?) AND outcome_score IS NOT NULL").all(session.schoolId) as Array<{ outcome_score?: number }>;
  const interventionSuccessRate = interventionRows.length ? Math.round(interventionRows.reduce((s, i) => s + (i.outcome_score || 0), 0) / interventionRows.length) : 0;

  return (
    <main className="min-h-screen bg-[#f5fbff] text-slate-950">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div>
          <Link href="/login" className="panel-back">← Back</Link>
          <div className="mt-2 text-sm uppercase tracking-[0.24em] text-[var(--bb-blue)]">School Admin Portal</div>
          <h1 className="mt-3 text-5xl font-semibold tracking-[-0.05em]">{session.school || "District"} Overview</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">Account visibility and compliance reporting only (student content hidden by design).</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-7 shadow-[0_12px_34px_rgba(15,23,42,0.06)]"><div className="text-sm text-slate-500">Teachers</div><div className="mt-2 text-4xl font-semibold text-[var(--bb-blue)]">{teachers.length}</div></div>
          <div className="rounded-2xl bg-white p-7 shadow-[0_12px_34px_rgba(15,23,42,0.06)]"><div className="text-sm text-slate-500">Parents</div><div className="mt-2 text-4xl font-semibold text-[var(--bb-blue)]">{parents.length}</div></div>
          <div className="rounded-2xl bg-white p-7 shadow-[0_12px_34px_rgba(15,23,42,0.06)]"><div className="text-sm text-slate-500">Students</div><div className="mt-2 text-4xl font-semibold text-[var(--bb-blue)]">{students.length}</div></div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-7 shadow-[0_12px_34px_rgba(15,23,42,0.06)]">
          <h2 className="text-xl font-semibold">District outcomes snapshot</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-[#f5fbff] p-4 text-sm text-slate-700"><strong>Average literacy improvement:</strong> {avgLiteracyImprovement}%</div>
            <div className="rounded-xl bg-[#f5fbff] p-4 text-sm text-slate-700"><strong>Teacher engagement:</strong> {activeTeachers.count}/{teachers.length} active</div>
            <div className="rounded-xl bg-[#f5fbff] p-4 text-sm text-slate-700"><strong>Intervention success:</strong> {interventionSuccessRate}%</div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-7 shadow-[0_12px_34px_rgba(15,23,42,0.06)]">
          <h2 className="text-xl font-semibold">Compliance report generator</h2>
          <p className="mt-2 text-sm text-slate-600">Generate per-student reports without opening full student detail pages.</p>
          <div className="mt-4 flex items-center justify-end">
            <AdminBoardPacketButton />
          </div>
          <div className="mt-4 grid gap-3">
            {students.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                <div className="text-sm text-slate-700">{s.name} {s.grade ? `• ${s.grade}` : ""}</div>
                <AdminReportButton studentId={s.id} studentName={s.name} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-7 shadow-[0_12px_34px_rgba(15,23,42,0.06)]">
            <h2 className="text-xl font-semibold">Teacher Accounts</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">{teachers.map((t) => <li key={t.id}>{t.name} — {t.email}</li>)}</ul>
          </div>
          <div className="rounded-2xl bg-white p-7 shadow-[0_12px_34px_rgba(15,23,42,0.06)]">
            <h2 className="text-xl font-semibold">Parent Accounts</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">{parents.map((p) => <li key={p.id}>{p.name} — {p.email}</li>)}</ul>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

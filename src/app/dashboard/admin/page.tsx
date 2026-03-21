import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/dashboard");

  const teachers = db.prepare("SELECT id, name, email FROM teachers WHERE school_id = ? ORDER BY name").all(session.schoolId) as Array<any>;
  const parents = db.prepare("SELECT id, name, email FROM parents WHERE school_id = ? ORDER BY name").all(session.schoolId) as Array<any>;
  const students = db.prepare("SELECT id, name, grade, teacher_id FROM students WHERE teacher_id IN (SELECT id FROM teachers WHERE school_id = ?) ORDER BY name").all(session.schoolId) as Array<any>;

  return (
    <main className="min-h-screen bg-[#f5fbff] text-slate-950">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div>
          <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-blue)]">School Admin Portal</div>
          <h1 className="mt-3 text-5xl font-semibold tracking-[-0.05em]">{session.school || "District"} Overview</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">Account visibility and compliance reporting only (student content hidden by design).</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-7 shadow-[0_12px_34px_rgba(15,23,42,0.06)]"><div className="text-sm text-slate-500">Teachers</div><div className="mt-2 text-4xl font-semibold text-[var(--bb-blue)]">{teachers.length}</div></div>
          <div className="rounded-2xl bg-white p-7 shadow-[0_12px_34px_rgba(15,23,42,0.06)]"><div className="text-sm text-slate-500">Parents</div><div className="mt-2 text-4xl font-semibold text-[var(--bb-blue)]">{parents.length}</div></div>
          <div className="rounded-2xl bg-white p-7 shadow-[0_12px_34px_rgba(15,23,42,0.06)]"><div className="text-sm text-slate-500">Students</div><div className="mt-2 text-4xl font-semibold text-[var(--bb-blue)]">{students.length}</div></div>
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

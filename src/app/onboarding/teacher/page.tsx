import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default async function TeacherOnboardingPage() {
  const session = await getSession();
  if (!session || session.role !== "teacher") redirect('/login');

  const studentCount = (db.prepare("SELECT COUNT(*) as count FROM students WHERE teacher_id = ?").get(session.id) as { count: number }).count;

  return (
    <main className="min-h-screen bg-[#f8fbfb] text-slate-950">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
        <Link href="/dashboard" className="panel-back">← Back</Link>
        <div className="mt-2 text-sm uppercase tracking-[0.22em] text-[var(--bb-dark-teal)]">Teacher Onboarding</div>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-0.05em]">Get classroom-ready in under 5 minutes.</h1>
        <div className="mt-8 grid gap-4">
          <div className={`rounded-xl p-5 ${studentCount > 0 ? 'bg-[#e8f8f8]' : 'bg-white'}`}>
            <div className="text-sm font-semibold">1) Add your first student</div>
            <p className="mt-1 text-sm text-slate-600">Create a student profile so BrailleBox can begin tracking outcomes.</p>
            <Link href="/dashboard/students/new" className="mt-3 inline-flex btn-dark">Add student</Link>
          </div>
          <div className="rounded-xl bg-white p-5">
            <div className="text-sm font-semibold">2) Run your first exercise</div>
            <p className="mt-1 text-sm text-slate-600">Launch a guided exercise and collect session data.</p>
            <Link href="/dashboard" className="mt-3 inline-flex btn-dark">Open dashboard</Link>
          </div>
          <div className="rounded-xl bg-white p-5">
            <div className="text-sm font-semibold">3) Review your first insight</div>
            <p className="mt-1 text-sm text-slate-600">Use Today’s Teaching Feed to decide who needs intervention now.</p>
            <Link href="/dashboard" className="mt-3 inline-flex btn-dark">View Teaching Feed</Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

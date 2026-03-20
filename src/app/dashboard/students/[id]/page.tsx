import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AIProfileButton } from "@/components/dashboard/ai-profile-button";
import { DeviceConnectButton } from "@/components/dashboard/device-connect-button";
import { ExerciseCategories } from "@/components/dashboard/exercise-categories";

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect('/login');
  const { id } = await params;

  const columns = new Set((db.prepare("PRAGMA table_info(students)").all() as Array<{ name: string }>).map((c) => c.name));
  if (!columns.has("device_connected")) db.exec("ALTER TABLE students ADD COLUMN device_connected INTEGER DEFAULT 0;");
  if (!columns.has("device_name")) db.exec("ALTER TABLE students ADD COLUMN device_name TEXT;");

  const student = db
    .prepare(`SELECT * FROM students WHERE id = ? AND teacher_id = ?`)
    .get(id, session.id) as
    | {
        id: string;
        name: string;
        grade?: string;
        age?: number;
        progress_percent: number;
        current_focus?: string;
        recent_activity?: string;
        profile_summary?: string;
        strengths?: string;
        support_needs?: string;
        goals?: string;
        preferred_learning_style?: string;
        notes?: string;
        device_connected?: number;
        device_name?: string;
      }
    | undefined;

  if (!student) redirect('/dashboard');

  return (
    <main className="min-h-screen bg-[#f8fbfb] text-slate-950">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-dark-teal)]">Student Profile</div>
            <h1 className="mt-3 text-5xl font-semibold tracking-[-0.05em]">{student.name}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{student.grade || 'Student'}{student.age ? ` • Age ${student.age}` : ''}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard" className="btn-dark">Back to dashboard</Link>
            <DeviceConnectButton studentId={student.id} connected={Boolean(student.device_connected)} deviceName={student.device_name} />
            <AIProfileButton studentId={student.id} />
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Progress</div>
            <div className="mt-3 text-5xl font-semibold tracking-[-0.05em] text-[var(--bb-orange)]">{student.progress_percent}%</div>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Current focus</div>
            <div className="mt-3 text-xl font-semibold tracking-[-0.03em] text-slate-950">{student.current_focus || 'Not set yet'}</div>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Recent activity</div>
            <div className="mt-3 text-base leading-7 text-slate-700">{student.recent_activity || 'No recent activity yet'}</div>
          </div>
        </div>

        <ExerciseCategories />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Profile summary</div>
            <p className="mt-4 text-base leading-8 text-slate-700">{student.profile_summary || 'No profile summary yet. Use Generate AI profile to draft one.'}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Strengths</div>
            <p className="mt-4 text-base leading-8 text-slate-700">{student.strengths || 'No strengths drafted yet.'}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Support needs</div>
            <p className="mt-4 text-base leading-8 text-slate-700">{student.support_needs || 'No support needs drafted yet.'}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Goals</div>
            <p className="mt-4 text-base leading-8 text-slate-700">{student.goals || 'No goals drafted yet.'}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)] lg:col-span-2">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Preferred learning style</div>
            <p className="mt-4 text-base leading-8 text-slate-700">{student.preferred_learning_style || 'No preferred learning style drafted yet.'}</p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

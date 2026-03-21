import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AIProfileButton } from "@/components/dashboard/ai-profile-button";
import { DeviceConnectButton } from "@/components/dashboard/device-connect-button";
import { ExerciseCategories } from "@/components/dashboard/exercise-categories";
import { ActivityVisual } from "@/components/dashboard/activity-visual";
import { EditStudentSummaryForm } from "@/components/dashboard/edit-student-summary-form";
import { LinkParentForm } from "@/components/dashboard/link-parent-form";
import { SummaryEditAssistant } from "@/components/dashboard/ai-summary-edit-assistant";
import { ReportButton } from "@/components/dashboard/ai-report-button";
import { LessonQuickPlanner } from "@/components/dashboard/lesson-quick-planner";
import { TeacherMessageTemplatePanel } from "@/components/teacher-message-template-panel";

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "teacher") redirect("/login");
  const { id } = await params;

  const student = db.prepare(`SELECT * FROM students WHERE id = ? AND teacher_id = ?`).get(id, session.id) as any;
  if (!student) redirect("/dashboard");

  const linkedParents = db.prepare(`
    SELECT p.id, p.name, p.email
    FROM parent_student ps
    JOIN parents p ON ps.parent_id = p.id
    WHERE ps.student_id = ?
    ORDER BY p.name
  `).all(student.id) as Array<{ id: string; name: string; email: string }>;

  return (
    <main className="min-h-screen bg-[#f8fbfb] text-slate-950">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-dark-teal)]">Student Profile</div>
            <h1 className="mt-3 text-5xl font-semibold tracking-[-0.05em]">{student.name}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{student.grade || "Student"}{student.age ? ` • Age ${student.age}` : ""}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard" className="btn-dark">Back to dashboard</Link>
            <DeviceConnectButton studentId={student.id} connected={Boolean(student.device_connected)} deviceName={student.device_name} />
            <AIProfileButton studentId={student.id} />
            <ReportButton studentId={student.id} studentName={student.name} />
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]"><div className="text-sm uppercase tracking-[0.2em] text-slate-500">Progress</div><div className="mt-3 text-5xl font-semibold tracking-[-0.05em] text-[var(--bb-orange)]">{student.progress_percent}%</div></div>
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]"><div className="text-sm uppercase tracking-[0.2em] text-slate-500">Current focus</div><div className="mt-3 text-xl font-semibold tracking-[-0.03em] text-slate-950">{student.current_focus || "Not set yet"}</div></div>
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]"><div className="text-sm uppercase tracking-[0.2em] text-slate-500">Device</div><div className="mt-3 text-base leading-7 text-slate-700">{student.device_connected ? student.device_name || "BrailleBox connected" : "Not connected yet"}</div></div>
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]"><div className="text-sm uppercase tracking-[0.2em] text-slate-500">Recent activity</div><div className="mt-3 text-base leading-7 text-slate-700">{student.recent_activity || "No recent activity yet"}</div></div>
        </div>

        <LinkParentForm studentId={student.id} />
        <LessonQuickPlanner studentId={student.id} />
        <SummaryEditAssistant studentId={student.id} />

        {linkedParents.length > 0 ? (
          <div className="mt-6 rounded-[1.2rem] bg-white p-4 shadow-[0_10px_26px_rgba(15,23,42,0.06)]">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Send structured parent update</div>
            {linkedParents.map((p) => (
              <div key={p.id} className="mt-3 rounded-lg border border-slate-100 p-3">
                <div className="text-sm font-semibold text-slate-800">{p.name}</div>
                <div className="text-xs text-slate-500">{p.email}</div>
                <TeacherMessageTemplatePanel parentId={p.id} studentId={student.id} />
              </div>
            ))}
          </div>
        ) : null}

        <ExerciseCategories studentId={student.id} connected={Boolean(student.device_connected)} />
        <ActivityVisual visual={student.activity_visual} />

        <EditStudentSummaryForm
          studentId={student.id}
          initial={{
            profile_summary: student.profile_summary,
            strengths: student.strengths,
            support_needs: student.support_needs,
            goals: student.goals,
            notes: student.notes,
          }}
        />
      </section>
      <SiteFooter />
    </main>
  );
}

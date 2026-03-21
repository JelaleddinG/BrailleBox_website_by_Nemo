import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateAiProgressReport } from "@/lib/student-ai";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;

  const student = db.prepare("SELECT * FROM students WHERE id = ?").get(id) as any;
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  if (session.role === "teacher" && student.teacher_id !== session.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (session.role === "parent") {
    const link = db.prepare("SELECT id FROM parent_student WHERE parent_id = ? AND student_id = ?").get(session.id, id);
    if (!link) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const report = generateAiProgressReport({
    studentName: student.name,
    grade: student.grade,
    progressPercent: student.progress_percent,
    currentFocus: student.current_focus,
    recentActivity: student.recent_activity,
    strengths: student.strengths,
    supportNeeds: student.support_needs,
    goals: student.goals,
  });

  return NextResponse.json({ ok: true, report });
}

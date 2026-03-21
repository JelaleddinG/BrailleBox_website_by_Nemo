import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildSchoolProgressPdf } from "@/lib/pdf";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const student = db.prepare(`
    SELECT s.*, t.name as teacher_name, sc.name as school_name
    FROM students s
    LEFT JOIN teachers t ON s.teacher_id = t.id
    LEFT JOIN schools sc ON t.school_id = sc.id
    WHERE s.id = ?
  `).get(id) as any;

  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  if (session.role === "teacher" && student.teacher_id !== session.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (session.role === "parent") {
    const link = db.prepare("SELECT id FROM parent_student WHERE parent_id = ? AND student_id = ?").get(session.id, id);
    if (!link) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const pdf = buildSchoolProgressPdf({
    schoolName: student.school_name || "School",
    reportDate: new Date().toLocaleDateString("en-US"),
    studentName: student.name,
    grade: student.grade,
    teacherName: student.teacher_name,
    progressPercent: student.progress_percent,
    currentFocus: student.current_focus,
    recentActivity: student.recent_activity,
    strengths: student.strengths,
    supportNeeds: student.support_needs,
    goals: student.goals,
    notes: student.notes,
  });

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${student.name.replace(/\s+/g, "_")}_progress_report.pdf"`,
    },
  });
}

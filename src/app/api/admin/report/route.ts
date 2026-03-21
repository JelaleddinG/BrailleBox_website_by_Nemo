import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildSchoolProgressPdf } from "@/lib/pdf";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const studentId = String(searchParams.get("studentId") || "");
  if (!studentId) return NextResponse.json({ error: "studentId required" }, { status: 400 });

  const student = db.prepare(`
    SELECT s.*, t.name as teacher_name, sc.name as school_name, t.school_id as teacher_school_id
    FROM students s
    JOIN teachers t ON s.teacher_id = t.id
    LEFT JOIN schools sc ON t.school_id = sc.id
    WHERE s.id = ?
  `).get(studentId) as any;

  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  if (session.schoolId && student.teacher_school_id && session.schoolId !== student.teacher_school_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const pdf = buildSchoolProgressPdf({
    schoolName: student.school_name || session.school || "School",
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
      "Content-Disposition": `attachment; filename="${student.name.replace(/\\s+/g, "_")}_admin_compliance_report.pdf"`,
    },
  });
}

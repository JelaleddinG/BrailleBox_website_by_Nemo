import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildStateCompliancePdf } from "@/lib/pdf";

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

  const parentMessage = db.prepare(`
    SELECT created_at
    FROM messages
    WHERE student_id = ? AND sender_type = 'teacher' AND recipient_type = 'parent'
    ORDER BY created_at DESC
    LIMIT 1
  `).get(student.id) as { created_at?: string } | undefined;

  const pdf = buildStateCompliancePdf({
    schoolName: student.school_name || session.school || "School",
    district: student.school_name || undefined,
    state: "MA",
    reportDate: new Date().toLocaleDateString("en-US"),
    reportingPeriod: "Current quarter",
    studentName: student.name,
    grade: student.grade,
    teacherName: student.teacher_name,
    annualGoal: student.goals,
    baseline: student.profile_summary,
    measurementMethod: "Braille exercise accuracy, fluency timing, teacher observation, and intervention outcomes.",
    progressPercent: student.progress_percent,
    progressNarrative: student.recent_activity,
    accommodations: student.support_needs,
    serviceSummary: student.current_focus,
    nextSteps: student.goals,
    parentCommunicationDate: parentMessage?.created_at,
  });

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${student.name.replace(/\\s+/g, "_")}_admin_compliance_report.pdf"`,
    },
  });
}

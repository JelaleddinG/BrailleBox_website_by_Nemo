import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const teachers = (db.prepare("SELECT COUNT(*) as count FROM teachers WHERE school_id = ?").get(session.schoolId) as { count: number }).count;
  const students = (db.prepare("SELECT COUNT(*) as count FROM students WHERE teacher_id IN (SELECT id FROM teachers WHERE school_id = ?)").get(session.schoolId) as { count: number }).count;
  const avgProgress = (db.prepare("SELECT AVG(progress_percent) as avg FROM students WHERE teacher_id IN (SELECT id FROM teachers WHERE school_id = ?)").get(session.schoolId) as { avg?: number }).avg || 0;
  const activeTeachers = (db.prepare("SELECT COUNT(DISTINCT teacher_id) as count FROM students WHERE teacher_id IN (SELECT id FROM teachers WHERE school_id = ?) AND updated_at >= datetime('now','-14 days')").get(session.schoolId) as { count: number }).count;

  const packet = {
    generatedAt: new Date().toISOString(),
    school: session.school,
    headline: "Braille literacy implementation snapshot",
    metrics: {
      teacherCount: teachers,
      studentCount: students,
      averageProgressPercent: Math.round(avgProgress),
      activeTeacherCount14d: activeTeachers,
      teacherEngagementRatePercent: teachers ? Math.round((activeTeachers / teachers) * 100) : 0,
    },
    boardSummary: [
      "BrailleBox is actively used in daily instruction with measurable student progression.",
      "Intervention tracking and progress reporting are now integrated into school workflows.",
      "Parent communication cadence and compliance-ready reporting are operational.",
    ],
  };

  return NextResponse.json({ ok: true, packet });
}

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateStudentDraft } from "@/lib/student-ai";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const student = db
    .prepare("SELECT id, teacher_id, name, grade, age, current_focus, notes FROM students WHERE id = ?")
    .get(id) as
    | { id: string; teacher_id: string; name: string; grade?: string; age?: number; current_focus?: string; notes?: string }
    | undefined;

  if (!student || student.teacher_id !== session.id) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const draft = generateStudentDraft(student);

  db.prepare(
    `UPDATE students SET profile_summary = ?, strengths = ?, support_needs = ?, goals = ?, preferred_learning_style = ? WHERE id = ?`
  ).run(
    draft.profile_summary,
    draft.strengths,
    draft.support_needs,
    draft.goals,
    draft.preferred_learning_style,
    id,
  );

  return NextResponse.json({ ok: true, draft });
}

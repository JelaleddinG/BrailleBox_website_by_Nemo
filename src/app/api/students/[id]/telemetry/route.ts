import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const body = await req.json().catch(() => ({}));

  const student = db.prepare("SELECT id, teacher_id FROM students WHERE id = ?").get(id) as { id: string; teacher_id: string } | undefined;
  if (!student || student.teacher_id !== session.id) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  const sessionId = body.sessionId ? String(body.sessionId) : null;
  const exerciseType = String(body.exerciseType || "guided-practice");
  const expectedPattern = body.expectedPattern ? String(body.expectedPattern) : null;
  const actualPattern = body.actualPattern ? String(body.actualPattern) : null;
  const isCorrect = body.isCorrect ? 1 : 0;
  const hesitationMs = body.hesitationMs ? Number(body.hesitationMs) : null;

  db.prepare(`
    INSERT INTO student_error_events (id, student_id, session_id, exercise_type, expected_pattern, actual_pattern, is_correct, hesitation_ms)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(crypto.randomUUID(), id, sessionId, exerciseType, expectedPattern, actualPattern, isCorrect, hesitationMs);

  db.prepare("UPDATE students SET updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);

  return NextResponse.json({ ok: true });
}

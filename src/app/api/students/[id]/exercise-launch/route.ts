import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const body = await req.json();

  const student = db.prepare("SELECT id, teacher_id, progress_percent FROM students WHERE id = ?").get(id) as { id: string; teacher_id: string; progress_percent: number } | undefined;
  if (!student || student.teacher_id !== session.id) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const columns = new Set((db.prepare("PRAGMA table_info(students)").all() as Array<{ name: string }>).map((c) => c.name));
  if (!columns.has("last_exercise_title")) db.exec("ALTER TABLE students ADD COLUMN last_exercise_title TEXT;");
  if (!columns.has("last_exercise_category")) db.exec("ALTER TABLE students ADD COLUMN last_exercise_category TEXT;");
  if (!columns.has("last_exercise_score")) db.exec("ALTER TABLE students ADD COLUMN last_exercise_score INTEGER DEFAULT 0;");
  if (!columns.has("activity_visual")) db.exec("ALTER TABLE students ADD COLUMN activity_visual TEXT;");

  const title = String(body.title || "Exercise");
  const category = String(body.category || "Practice");
  const score = Math.min(100, Math.max(40, Number(body.score ?? 72)));
  const progress = Math.min(100, student.progress_percent + Math.max(1, Math.round((score - 50) / 8)));
  const activityVisual = JSON.stringify({
    completed: Math.max(3, Math.round(score / 10)),
    target: 10,
    score,
    category,
    title,
  });

  db.prepare(
    `UPDATE students SET progress_percent = ?, recent_activity = ?, last_exercise_title = ?, last_exercise_category = ?, last_exercise_score = ?, activity_visual = ? WHERE id = ?`
  ).run(
    progress,
    `Completed ${title} in ${category} with a score of ${score}%`,
    title,
    category,
    score,
    activityVisual,
    id,
  );

  return NextResponse.json({ ok: true, progress, score });
}

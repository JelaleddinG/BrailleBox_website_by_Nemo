import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const studentId = String(url.searchParams.get("studentId") || "");

  const rows = db.prepare(`
    SELECT lp.*, s.name as student_name
    FROM lesson_plans lp
    JOIN students s ON lp.student_id = s.id
    WHERE lp.teacher_id = ? ${studentId ? "AND lp.student_id = ?" : ""}
    ORDER BY COALESCE(lp.scheduled_for, lp.created_at) ASC
    LIMIT 50
  `).all(...(studentId ? [session.id, studentId] : [session.id])) as any[];

  return NextResponse.json({ lessons: rows });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const studentId = String(body.studentId || "");
  const objective = String(body.objective || "").trim();
  const scheduledFor = body.scheduledFor ? String(body.scheduledFor) : null;

  if (!studentId || !objective) return NextResponse.json({ error: "studentId and objective required" }, { status: 400 });

  const student = db.prepare("SELECT id FROM students WHERE id = ? AND teacher_id = ?").get(studentId, session.id) as { id: string } | undefined;
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  const lessonId = crypto.randomUUID();
  db.prepare("INSERT INTO lesson_plans (id, teacher_id, student_id, title, objective, status, scheduled_for) VALUES (?, ?, ?, ?, ?, 'scheduled', ?)")
    .run(lessonId, session.id, studentId, "Adaptive Braille Session", objective, scheduledFor);

  const perf = db.prepare("SELECT progress_percent FROM students WHERE id = ?").get(studentId) as { progress_percent?: number } | undefined;
  const progress = perf?.progress_percent || 0;
  const recentErrors = db.prepare("SELECT COUNT(*) as c FROM student_error_events WHERE student_id = ? AND is_correct = 0 AND created_at >= datetime('now','-7 days')").get(studentId) as { c: number };

  const baseDifficulty = progress >= 80 ? 3 : progress >= 60 ? 2 : 1;
  const needsReinforcement = recentErrors.c >= 8;

  const templates = [
    { exercise: needsReinforcement ? "dot-reinforcement" : "dot-recognition", difficulty: Math.max(1, baseDifficulty - 1), min: 6 },
    { exercise: "pattern-recall", difficulty: baseDifficulty, min: 6 },
    { exercise: progress >= 70 ? "timed-fluency" : "guided-reading", difficulty: Math.min(4, baseDifficulty + (needsReinforcement ? 0 : 1)), min: 8 },
  ];

  const insertStep = db.prepare("INSERT INTO lesson_steps (id, lesson_id, step_order, exercise_type, difficulty_level, estimated_min) VALUES (?, ?, ?, ?, ?, ?)");
  templates.forEach((t, i) => insertStep.run(crypto.randomUUID(), lessonId, i + 1, t.exercise, t.difficulty, t.min));

  return NextResponse.json({ ok: true, lessonId });
}

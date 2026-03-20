import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const id = crypto.randomUUID();

  db.prepare(
    `INSERT INTO students (
      id, teacher_id, name, grade, age, progress_percent, current_focus, recent_activity,
      profile_summary, strengths, support_needs, goals, preferred_learning_style, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    session.id,
    String(body.name || "").trim(),
    String(body.grade || "").trim() || null,
    body.age ? Number(body.age) : null,
    body.progress_percent ? Number(body.progress_percent) : 0,
    String(body.current_focus || "").trim() || null,
    String(body.recent_activity || "").trim() || null,
    String(body.profile_summary || "").trim() || null,
    String(body.strengths || "").trim() || null,
    String(body.support_needs || "").trim() || null,
    String(body.goals || "").trim() || null,
    String(body.preferred_learning_style || "").trim() || null,
    String(body.notes || "").trim() || null,
  );

  return NextResponse.json({ ok: true, id });
}

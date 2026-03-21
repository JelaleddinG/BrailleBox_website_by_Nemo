import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const result = db.prepare(`
    UPDATE students
    SET profile_summary = ?, strengths = ?, support_needs = ?, goals = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND teacher_id = ?
  `).run(
    String(body.profile_summary || ""),
    String(body.strengths || ""),
    String(body.support_needs || ""),
    String(body.goals || ""),
    String(body.notes || ""),
    id,
    session.id,
  );

  if (result.changes === 0) return NextResponse.json({ error: "Student not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

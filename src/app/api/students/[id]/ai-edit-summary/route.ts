import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { applyTeacherSummaryInstruction } from "@/lib/student-ai";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const body = await req.json();
  const instruction = String(body.instruction || "").trim();
  if (!instruction) return NextResponse.json({ error: "Instruction required" }, { status: 400 });

  const student = db.prepare("SELECT id, teacher_id, profile_summary FROM students WHERE id = ?").get(id) as
    | { id: string; teacher_id: string; profile_summary?: string }
    | undefined;

  if (!student || student.teacher_id !== session.id) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const updatedSummary = applyTeacherSummaryInstruction(student.profile_summary || "", instruction);

  db.prepare("UPDATE students SET profile_summary = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(updatedSummary, id);

  return NextResponse.json({ ok: true, profile_summary: updatedSummary });
}

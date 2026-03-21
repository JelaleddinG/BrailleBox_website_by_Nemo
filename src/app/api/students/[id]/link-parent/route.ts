import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: studentId } = await params;
  const body = await req.json();
  const parentEmail = String(body.parentEmail || "").trim().toLowerCase();

  if (!parentEmail) return NextResponse.json({ error: "Parent email required" }, { status: 400 });

  const student = db.prepare("SELECT id, teacher_id FROM students WHERE id = ? AND teacher_id = ?").get(studentId, session.id) as any;
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  const teacher = db.prepare("SELECT school_id FROM teachers WHERE id = ?").get(session.id) as { school_id?: string } | undefined;
  const parent = db.prepare("SELECT id, school_id FROM parents WHERE email = ?").get(parentEmail) as { id: string; school_id?: string } | undefined;
  if (!parent) return NextResponse.json({ error: "Parent account not found" }, { status: 404 });

  if (!teacher?.school_id || teacher.school_id !== parent.school_id) {
    return NextResponse.json({ error: "Parent must belong to the same school/community" }, { status: 403 });
  }

  db.prepare("INSERT OR IGNORE INTO parent_student (id, parent_id, student_id, relationship) VALUES (?, ?, ?, ?)").run(crypto.randomUUID(), parent.id, studentId, "Parent");

  return NextResponse.json({ ok: true });
}

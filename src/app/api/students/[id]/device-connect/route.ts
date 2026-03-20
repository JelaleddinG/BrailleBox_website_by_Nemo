import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;

  const student = db.prepare("SELECT id, teacher_id FROM students WHERE id = ?").get(id) as { id: string; teacher_id: string } | undefined;
  if (!student || student.teacher_id !== session.id) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const columns = new Set((db.prepare("PRAGMA table_info(students)").all() as Array<{ name: string }>).map((c) => c.name));
  if (!columns.has("device_connected")) db.exec("ALTER TABLE students ADD COLUMN device_connected INTEGER DEFAULT 0;");
  if (!columns.has("device_name")) db.exec("ALTER TABLE students ADD COLUMN device_name TEXT;");

  db.prepare("UPDATE students SET device_connected = 1, device_name = ? WHERE id = ?").run("BrailleBox Classroom Unit", id);

  return NextResponse.json({ ok: true, connected: true, deviceName: "BrailleBox Classroom Unit" });
}

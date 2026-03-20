import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
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
  if (!columns.has("device_serial")) db.exec("ALTER TABLE students ADD COLUMN device_serial TEXT;");
  if (!columns.has("device_mac")) db.exec("ALTER TABLE students ADD COLUMN device_mac TEXT;");

  const body = await req.json().catch(() => ({}));
  const deviceName = String(body.deviceName || "BrailleBox Classroom Unit");
  const serial = body.serial ? String(body.serial) : null;
  const mac = body.mac ? String(body.mac) : null;

  db.prepare("UPDATE students SET device_connected = 1, device_name = ?, device_serial = ?, device_mac = ? WHERE id = ?").run(deviceName, serial, mac, id);

  return NextResponse.json({ ok: true, connected: true, deviceName, serial, mac });
}

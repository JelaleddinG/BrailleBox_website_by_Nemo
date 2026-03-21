import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = db.prepare(
    `SELECT * FROM messages WHERE recipient_id = ? AND recipient_type = ? ORDER BY created_at DESC LIMIT 100`
  ).all(session.id, session.role) as any[];

  return NextResponse.json({ messages: rows });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const recipientId = String(body.recipientId || "");
  const recipientType = String(body.recipientType || "");
  const subject = String(body.subject || "");
  const text = String(body.body || "").trim();
  const studentId = body.studentId ? String(body.studentId) : null;

  if (!recipientId || !recipientType || !text) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  if (session.role === "parent" && recipientType !== "teacher") return NextResponse.json({ error: "Parents can only message teachers" }, { status: 403 });
  if (session.role === "teacher" && recipientType !== "parent") return NextResponse.json({ error: "Teachers can only message linked parents" }, { status: 403 });

  db.prepare(
    `INSERT INTO messages (id, sender_id, sender_type, recipient_id, recipient_type, student_id, subject, body) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(crypto.randomUUID(), session.id, session.role, recipientId, recipientType, studentId, subject || null, text);

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const messageId = body.messageId ? String(body.messageId) : null;

  if (messageId) {
    db.prepare("UPDATE messages SET is_read = 1 WHERE id = ? AND recipient_id = ? AND recipient_type = ?").run(messageId, session.id, session.role);
  } else {
    db.prepare("UPDATE messages SET is_read = 1 WHERE recipient_id = ? AND recipient_type = ?").run(session.id, session.role);
  }

  return NextResponse.json({ ok: true });
}

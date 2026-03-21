import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const body = await req.json().catch(() => ({}));
  const syncStatus = String(body.syncStatus || "online");
  const liveState = String(body.liveState || "active");

  const result = db.prepare(`
    UPDATE students
    SET device_sync_status = ?,
        live_session_state = ?,
        device_last_sync_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND teacher_id = ?
  `).run(syncStatus, liveState, id, session.id);

  if (result.changes === 0) return NextResponse.json({ error: "Student not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

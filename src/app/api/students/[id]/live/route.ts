import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const student = db.prepare("SELECT id, teacher_id FROM students WHERE id = ?").get(id) as { id: string; teacher_id: string } | undefined;
  if (!student || student.teacher_id !== session.id) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  const recent = db.prepare(`
    SELECT exercise_type, expected_pattern, actual_pattern, is_correct, hesitation_ms, created_at
    FROM student_error_events
    WHERE student_id = ?
    ORDER BY created_at DESC
    LIMIT 12
  `).all(id) as Array<any>;

  const deviceState = db.prepare("SELECT updated_at, device_sync_status, device_last_sync_at, live_session_state FROM students WHERE id = ?").get(id) as { updated_at?: string; device_sync_status?: string; device_last_sync_at?: string; live_session_state?: string } | undefined;

  return NextResponse.json({
    live: {
      lastConnected: deviceState?.updated_at || null,
      syncStatus: deviceState?.device_sync_status || "unknown",
      lastSyncAt: deviceState?.device_last_sync_at || null,
      sessionState: deviceState?.live_session_state || "idle",
      totalRecentEvents: recent.length,
      events: recent,
    },
  });
}

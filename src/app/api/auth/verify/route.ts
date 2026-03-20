import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body.email || "").trim().toLowerCase();
  const code = String(body.code || "").trim();

  if (!email || !code) {
    return NextResponse.json({ error: "Email and verification code are required." }, { status: 400 });
  }

  const row = db.prepare(
    `SELECT vc.id, vc.teacher_id, vc.expires_at FROM verification_codes vc WHERE vc.email = ? AND vc.code = ? ORDER BY vc.created_at DESC LIMIT 1`
  ).get(email, code) as { id: string; teacher_id: string; expires_at: string } | undefined;

  if (!row) return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: "Verification code expired." }, { status: 400 });
  }

  db.prepare("UPDATE teachers SET is_verified = 1 WHERE id = ?").run(row.teacher_id);
  db.prepare("DELETE FROM verification_codes WHERE teacher_id = ?").run(row.teacher_id);

  return NextResponse.json({ ok: true });
}

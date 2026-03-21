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
    `SELECT id, user_id, user_type, expires_at FROM verification_codes WHERE email = ? AND code = ? ORDER BY created_at DESC LIMIT 1`
  ).get(email, code) as { id: string; user_id: string; user_type: string; expires_at: string } | undefined;

  if (!row) return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: "Verification code expired." }, { status: 400 });
  }

  if (row.user_type === "parent") db.prepare("UPDATE parents SET is_verified = 1 WHERE id = ?").run(row.user_id);
  else if (row.user_type === "admin") db.prepare("UPDATE school_admins SET is_verified = 1 WHERE id = ?").run(row.user_id);
  else db.prepare("UPDATE teachers SET is_verified = 1 WHERE id = ?").run(row.user_id);

  db.prepare("DELETE FROM verification_codes WHERE user_id = ?").run(row.user_id);

  return NextResponse.json({ ok: true });
}

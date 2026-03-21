import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body.email || "").trim().toLowerCase();
  const code = String(body.code || "").trim();

  if (!email || !code) {
    return NextResponse.json({ error: "Email and verification code are required." }, { status: 400 });
  }

  const verificationColumns = new Set((db.prepare("PRAGMA table_info(verification_codes)").all() as Array<{ name: string }>).map((c) => c.name));

  const selectFields = ["id", "email", "code", "expires_at", "created_at"];
  if (verificationColumns.has("user_id")) selectFields.push("user_id");
  if (verificationColumns.has("user_type")) selectFields.push("user_type");
  if (verificationColumns.has("teacher_id")) selectFields.push("teacher_id");

  const row = db
    .prepare(`SELECT ${selectFields.join(", ")} FROM verification_codes WHERE email = ? AND code = ? ORDER BY created_at DESC LIMIT 1`)
    .get(email, code) as any;

  if (!row) return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: "Verification code expired." }, { status: 400 });
  }

  const userId = row.user_id || row.teacher_id;
  const userType = row.user_type || "teacher";
  if (!userId) return NextResponse.json({ error: "Invalid verification record." }, { status: 400 });

  if (userType === "parent") db.prepare("UPDATE parents SET is_verified = 1 WHERE id = ?").run(userId);
  else if (userType === "admin") db.prepare("UPDATE school_admins SET is_verified = 1 WHERE id = ?").run(userId);
  else db.prepare("UPDATE teachers SET is_verified = 1 WHERE id = ?").run(userId);

  if (verificationColumns.has("user_id")) db.prepare("DELETE FROM verification_codes WHERE user_id = ?").run(userId);
  else if (verificationColumns.has("teacher_id")) db.prepare("DELETE FROM verification_codes WHERE teacher_id = ?").run(userId);
  else db.prepare("DELETE FROM verification_codes WHERE email = ?").run(email);

  return NextResponse.json({ ok: true });
}

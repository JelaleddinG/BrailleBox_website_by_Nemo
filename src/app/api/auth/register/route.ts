import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateVerificationCode } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const organization = String(body.organization || "").trim();
  const password = String(body.password || "");

  if (!name || !email || !organization || !password) {
    return NextResponse.json({ error: "Name, email, organization, and password are required." }, { status: 400 });
  }

  const existing = db.prepare("SELECT id FROM teachers WHERE email = ?").get(email) as { id?: string } | undefined;
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const teacherId = crypto.randomUUID();
  const passwordHash = await bcrypt.hash(password, 10);
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15).toISOString();

  db.prepare(
    `INSERT INTO teachers (id, name, email, password_hash, organization, school, role, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, 0)`
  ).run(teacherId, name, email, passwordHash, organization, organization, "Teacher of the Visually Impaired");

  db.prepare("INSERT INTO verification_codes (id, teacher_id, email, code, expires_at) VALUES (?, ?, ?, ?, ?)")
    .run(crypto.randomUUID(), teacherId, email, code, expiresAt);

  return NextResponse.json({ ok: true, email, verificationCode: code, delivery: "Email sending not configured yet on this machine. Use the code shown to verify locally." });
}

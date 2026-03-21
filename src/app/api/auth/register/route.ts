import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateVerificationCode } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const organization = String(body.organization || "").trim();
  const schoolName = String(body.school || organization || "").trim();
  const password = String(body.password || "");
  const role = String(body.role || "teacher").toLowerCase();

  if (!name || !email || !password || !schoolName) {
    return NextResponse.json({ error: "Name, email, school, and password are required." }, { status: 400 });
  }

  const existingTeacher = db.prepare("SELECT id FROM teachers WHERE email = ?").get(email);
  const existingParent = db.prepare("SELECT id FROM parents WHERE email = ?").get(email);
  const existingAdmin = db.prepare("SELECT id FROM school_admins WHERE email = ?").get(email);
  if (existingTeacher || existingParent || existingAdmin) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  let school = db.prepare("SELECT id FROM schools WHERE name = ?").get(schoolName) as { id: string } | undefined;
  if (!school) {
    const schoolId = crypto.randomUUID();
    db.prepare("INSERT INTO schools (id, name, district, state) VALUES (?, ?, ?, ?)").run(schoolId, schoolName, organization || schoolName, "MA");
    school = { id: schoolId };
  }

  const userId = crypto.randomUUID();
  const passwordHash = await bcrypt.hash(password, 10);
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15).toISOString();

  if (role === "parent") {
    db.prepare(`INSERT INTO parents (id, name, email, password_hash, school_id, is_verified) VALUES (?, ?, ?, ?, ?, 0)`).run(userId, name, email, passwordHash, school.id);
  } else if (role === "admin") {
    db.prepare(`INSERT INTO school_admins (id, name, email, password_hash, school_id, admin_level, is_verified) VALUES (?, ?, ?, ?, ?, ?, 0)`).run(userId, name, email, passwordHash, school.id, "school");
  } else {
    db.prepare(`INSERT INTO teachers (id, name, email, password_hash, school_id, organization, role, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, 0)`).run(userId, name, email, passwordHash, school.id, organization || schoolName, "Teacher of the Visually Impaired");
  }

  db.prepare("INSERT INTO verification_codes (id, user_id, user_type, email, code, expires_at) VALUES (?, ?, ?, ?, ?, ?)").run(
    crypto.randomUUID(),
    userId,
    role,
    email,
    code,
    expiresAt,
  );

  return NextResponse.json({ ok: true, email, verificationCode: code, role, delivery: "Email sending not configured yet. Use the verification code shown to verify locally." });
}

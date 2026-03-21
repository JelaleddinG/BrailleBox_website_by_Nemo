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
  const district = String(body.district || organization || "").trim();
  const city = String(body.city || "").trim();
  const state = String(body.state || "").trim();
  const password = String(body.password || "");
  const role = String(body.role || "teacher").toLowerCase();

  if (!name || !email || !password || !schoolName) {
    return NextResponse.json({ error: "Name, email, school, and password are required." }, { status: 400 });
  }

  const existingTeacher = db.prepare("SELECT id, is_verified FROM teachers WHERE email = ?").get(email) as { id: string; is_verified?: number } | undefined;
  const existingParent = db.prepare("SELECT id, is_verified FROM parents WHERE email = ?").get(email) as { id: string; is_verified?: number } | undefined;
  const existingAdmin = db.prepare("SELECT id, is_verified FROM school_admins WHERE email = ?").get(email) as { id: string; is_verified?: number } | undefined;

  const existing = existingTeacher ? { userId: existingTeacher.id, userType: "teacher", verified: !!existingTeacher.is_verified }
    : existingParent ? { userId: existingParent.id, userType: "parent", verified: !!existingParent.is_verified }
    : existingAdmin ? { userId: existingAdmin.id, userType: "admin", verified: !!existingAdmin.is_verified }
    : null;

  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15).toISOString();

  if (existing) {
    if (existing.verified) {
      return NextResponse.json({ error: "An account with this email already exists and is verified." }, { status: 409 });
    }

    db.prepare("DELETE FROM verification_codes WHERE user_id = ?").run(existing.userId);
    db.prepare("INSERT INTO verification_codes (id, user_id, user_type, email, code, expires_at) VALUES (?, ?, ?, ?, ?, ?)").run(
      crypto.randomUUID(),
      existing.userId,
      existing.userType,
      email,
      code,
      expiresAt,
    );

    return NextResponse.json({ ok: true, email, verificationCode: code, role: existing.userType, delivery: "Account exists but was unverified. New verification code generated." });
  }

  let school = db.prepare("SELECT id FROM schools WHERE name = ?").get(schoolName) as { id: string } | undefined;
  if (!school) {
    const schoolId = crypto.randomUUID();
    db.prepare("INSERT INTO schools (id, name, district, state, city) VALUES (?, ?, ?, ?, ?)").run(
      schoolId,
      schoolName,
      district || organization || schoolName,
      state || "MA",
      city || null,
    );
    school = { id: schoolId };
  }

  const userId = crypto.randomUUID();
  const passwordHash = await bcrypt.hash(password, 10);

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

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "braillebox-local-dev-secret-change-me");
const COOKIE_NAME = "bb_teacher_session";

export type TeacherSession = {
  id: string;
  email: string;
  name: string;
  school?: string;
  role?: string;
};

export function generateVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function verifyTeacher(email: string, password: string): Promise<TeacherSession | null> {
  const teacher = db
    .prepare("SELECT id, email, name, school, role, password_hash, is_verified FROM teachers WHERE email = ?")
    .get(email) as
    | { id: string; email: string; name: string; school?: string; role?: string; password_hash: string; is_verified: number }
    | undefined;

  if (!teacher) return null;
  if (!teacher.is_verified) throw new Error("Please verify your email before logging in.");
  const valid = await bcrypt.compare(password, teacher.password_hash);
  if (!valid) return null;

  return {
    id: teacher.id,
    email: teacher.email,
    name: teacher.name,
    school: teacher.school,
    role: teacher.role,
  };
}

export async function createSession(session: TeacherSession) {
  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<TeacherSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      id: String(payload.id),
      email: String(payload.email),
      name: String(payload.name),
      school: payload.school ? String(payload.school) : undefined,
      role: payload.role ? String(payload.role) : undefined,
    };
  } catch {
    return null;
  }
}

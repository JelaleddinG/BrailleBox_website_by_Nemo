import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "braillebox-local-dev-secret-change-me");
const COOKIE_NAME = "bb_session";

export type UserRole = "teacher" | "parent" | "admin";

export type TeacherSession = {
  id: string;
  email: string;
  name: string;
  school?: string;
  schoolId?: string;
  role: "teacher";
};

export type ParentSession = {
  id: string;
  email: string;
  name: string;
  school?: string;
  schoolId?: string;
  role: "parent";
};

export type AdminSession = {
  id: string;
  email: string;
  name: string;
  school?: string;
  schoolId?: string;
  adminLevel?: string;
  role: "admin";
};

export type UserSession = TeacherSession | ParentSession | AdminSession;

export function generateVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function verifyTeacher(email: string, password: string): Promise<TeacherSession | null> {
  const teacher = db
    .prepare(`
      SELECT t.id, t.email, t.name, t.school_id, s.name as school_name, t.role, t.password_hash, t.is_verified 
      FROM teachers t 
      LEFT JOIN schools s ON t.school_id = s.id 
      WHERE t.email = ?
    `).get(email) as
    | { id: string; email: string; name: string; school_id?: string; school_name?: string; role: string; password_hash: string; is_verified: number }
    | undefined;

  if (!teacher) return null;
  if (!teacher.is_verified) throw new Error("Please verify your email before logging in.");
  const valid = await bcrypt.compare(password, teacher.password_hash);
  if (!valid) return null;

  return {
    id: teacher.id,
    email: teacher.email,
    name: teacher.name,
    school: teacher.school_name,
    schoolId: teacher.school_id,
    role: "teacher",
  };
}

export async function verifyParent(email: string, password: string): Promise<ParentSession | null> {
  const parent = db
    .prepare(`
      SELECT p.id, p.email, p.name, p.school_id, s.name as school_name, p.password_hash, p.is_verified 
      FROM parents p 
      LEFT JOIN schools s ON p.school_id = s.id 
      WHERE p.email = ?
    `).get(email) as
    | { id: string; email: string; name: string; school_id?: string; school_name?: string; password_hash: string; is_verified: number }
    | undefined;

  if (!parent) return null;
  if (!parent.is_verified) throw new Error("Please verify your email before logging in.");
  const valid = await bcrypt.compare(password, parent.password_hash);
  if (!valid) return null;

  return {
    id: parent.id,
    email: parent.email,
    name: parent.name,
    school: parent.school_name,
    schoolId: parent.school_id,
    role: "parent",
  };
}

export async function verifyAdmin(email: string, password: string): Promise<AdminSession | null> {
  const admin = db
    .prepare(`
      SELECT a.id, a.email, a.name, a.school_id, s.name as school_name, a.admin_level, a.password_hash, a.is_verified 
      FROM school_admins a 
      LEFT JOIN schools s ON a.school_id = s.id 
      WHERE a.email = ?
    `).get(email) as
    | { id: string; email: string; name: string; school_id?: string; school_name?: string; admin_level: string; password_hash: string; is_verified: number }
    | undefined;

  if (!admin) return null;
  if (!admin.is_verified) throw new Error("Please verify your email before logging in.");
  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) return null;

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    school: admin.school_name,
    schoolId: admin.school_id,
    adminLevel: admin.admin_level,
    role: "admin",
  };
}

export async function createSession(session: UserSession) {
  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as UserRole;
    
    if (role === "teacher") {
      return {
        id: String(payload.id),
        email: String(payload.email),
        name: String(payload.name),
        school: payload.school ? String(payload.school) : undefined,
        schoolId: payload.schoolId ? String(payload.schoolId) : undefined,
        role: "teacher",
      };
    } else if (role === "parent") {
      return {
        id: String(payload.id),
        email: String(payload.email),
        name: String(payload.name),
        school: payload.school ? String(payload.school) : undefined,
        schoolId: payload.schoolId ? String(payload.schoolId) : undefined,
        role: "parent",
      };
    } else if (role === "admin") {
      return {
        id: String(payload.id),
        email: String(payload.email),
        name: String(payload.name),
        school: payload.school ? String(payload.school) : undefined,
        schoolId: payload.schoolId ? String(payload.schoolId) : undefined,
        adminLevel: payload.adminLevel ? String(payload.adminLevel) : undefined,
        role: "admin",
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function requireTeacherSession(): Promise<TeacherSession> {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    throw new Error("Teacher authentication required");
  }
  return session as TeacherSession;
}

export async function requireParentSession(): Promise<ParentSession> {
  const session = await getSession();
  if (!session || session.role !== "parent") {
    throw new Error("Parent authentication required");
  }
  return session as ParentSession;
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Admin authentication required");
  }
  return session as AdminSession;
}

import { NextResponse } from "next/server";
import { createSession, verifyTeacher } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const teacher = await verifyTeacher(email, password);
  if (!teacher) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await createSession(teacher);
  return NextResponse.json({ ok: true });
}

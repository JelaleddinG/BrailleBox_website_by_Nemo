import { NextResponse } from "next/server";
import { createSession, verifyAdmin, verifyParent, verifyTeacher } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const role = String(body.role || "teacher").toLowerCase();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  try {
    if (role === "parent") {
      const user = await verifyParent(email, password);
      if (!user) return NextResponse.json({ error: "Invalid parent credentials." }, { status: 401 });
      await createSession(user);
      return NextResponse.json({ ok: true, role: "parent" });
    }

    if (role === "admin") {
      const user = await verifyAdmin(email, password);
      if (!user) return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
      await createSession(user);
      return NextResponse.json({ ok: true, role: "admin" });
    }

    const user = await verifyTeacher(email, password);
    if (!user) return NextResponse.json({ error: "Invalid teacher credentials." }, { status: 401 });
    await createSession(user);
    return NextResponse.json({ ok: true, role: "teacher" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Login failed." }, { status: 401 });
  }
}

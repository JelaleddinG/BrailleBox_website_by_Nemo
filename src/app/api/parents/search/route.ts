import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const q = String(url.searchParams.get("q") || "").trim().toLowerCase();
  if (!q) return NextResponse.json({ results: [] });

  const teacher = db.prepare("SELECT school_id FROM teachers WHERE id = ?").get(session.id) as { school_id?: string } | undefined;
  if (!teacher?.school_id) return NextResponse.json({ results: [] });

  const results = db.prepare(`
    SELECT id, name, email
    FROM parents
    WHERE school_id = ?
      AND (LOWER(email) LIKE ? OR LOWER(name) LIKE ?)
    ORDER BY name
    LIMIT 8
  `).all(teacher.school_id, `%${q}%`, `%${q}%`) as Array<{ id: string; name: string; email: string }>;

  return NextResponse.json({ results });
}

import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { getSession } from "@/lib/auth";

const OPS_PATH = path.join(process.cwd(), "data", "agent-ops.json");

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const raw = readFileSync(OPS_PATH, "utf8");
  const json = JSON.parse(raw);
  return NextResponse.json(json);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { agentId, status, currentTask, note } = body as { agentId?: string; status?: string; currentTask?: string; note?: string };

  const raw = readFileSync(OPS_PATH, "utf8");
  const json = JSON.parse(raw) as { agents: any[]; activity: any[] };

  if (agentId) {
    const agent = json.agents.find((a) => a.id === agentId);
    if (agent) {
      if (status) agent.status = status;
      if (currentTask) agent.currentTask = currentTask;
      agent.lastUpdate = new Date().toISOString();
    }
  }

  if (note) {
    json.activity.unshift({
      time: new Date().toISOString(),
      text: note,
      by: session.name || session.email,
    });
    json.activity = json.activity.slice(0, 40);
  }

  writeFileSync(OPS_PATH, JSON.stringify(json, null, 2), "utf8");
  return NextResponse.json({ ok: true, data: json });
}

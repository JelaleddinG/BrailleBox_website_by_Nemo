import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = String(url.searchParams.get("q") || "").trim();
  if (q.length < 2) return NextResponse.json({ results: [] });

  const endpoint = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&q=${encodeURIComponent(q)}`;
  const res = await fetch(endpoint, { headers: { "User-Agent": "BrailleBox/1.0" } });
  if (!res.ok) return NextResponse.json({ results: [] });

  const rows = (await res.json()) as Array<any>;
  const results = rows.map((r) => ({
    label: r.display_name,
    city: r.address?.city || r.address?.town || r.address?.village || "",
    state: r.address?.state || "",
    district: r.address?.county || r.address?.state_district || "",
  }));

  return NextResponse.json({ results });
}

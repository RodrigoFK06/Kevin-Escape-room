import { NextResponse } from "next/server";
import { fetchRanking } from "@/lib/api-ranking";

export async function GET() {
  const data = await fetchRanking();

  if ("error" in data) {
    return NextResponse.json({ error: data.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

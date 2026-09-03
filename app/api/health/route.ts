import { NextResponse } from "next/server";
import { hasDatabase, query } from "@/lib/db";

export async function GET() {
  if (!hasDatabase()) {
    return NextResponse.json({ ok: true, db: "file" });
  }
  try {
    await query("SELECT 1 AS ok");
    return NextResponse.json({ ok: true, db: "postgres" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database query failed.";
    return NextResponse.json({ ok: false, db: "error", message }, { status: 500 });
  }
}

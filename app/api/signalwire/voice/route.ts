import { NextResponse } from "next/server";
import { updateCallByExternalId } from "@/lib/comms";

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const sid = String(form?.get("CallSid") || "");
  const status = String(form?.get("CallStatus") || "");
  const duration = Number(form?.get("CallDuration") || 0) || undefined;
  await updateCallByExternalId(sid, { status, durationSeconds: duration });
  return NextResponse.json({ ok: true });
}

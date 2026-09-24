import { NextResponse } from "next/server";
import { recordNotification } from "@/lib/comms";

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const sid = String(form?.get("MessageSid") || "");
  const status = String(form?.get("MessageStatus") || "unknown");
  const to = String(form?.get("To") || "");
  await recordNotification({
    channel: "sms",
    to,
    subject: "SMS status",
    body: `SignalWire marked ${sid || "a message"} as ${status}.`,
    provider: "signalwire",
    status: status === "failed" || status === "undelivered" ? "failed" : "sent",
    kind: "status",
    externalId: sid || undefined,
  });
  return NextResponse.json({ ok: true });
}

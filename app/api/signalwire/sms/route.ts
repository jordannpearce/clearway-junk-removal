import { NextResponse } from "next/server";
import { recordNotification } from "@/lib/comms";

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const body = form
    ? {
        from: String(form.get("From") || ""),
        to: String(form.get("To") || ""),
        text: String(form.get("Body") || ""),
        sid: String(form.get("MessageSid") || form.get("SmsSid") || ""),
      }
    : await request.json().catch(() => ({}));
  const from = String(body.from || body.From || "");
  const text = String(body.text || body.Body || body.body || "");
  const sid = String(body.sid || body.MessageSid || "");
  await recordNotification({
    channel: "sms",
    to: String(body.to || body.To || "Clearway"),
    subject: "Inbound SMS",
    body: `${from}: ${text}`,
    provider: "signalwire",
    status: "sent",
    kind: "inbound",
    audience: "customer",
    externalId: sid || undefined,
  });
  return new NextResponse("<Response></Response>", {
    headers: { "Content-Type": "text/xml" },
  });
}

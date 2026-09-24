import { NextResponse } from "next/server";
import { toE164 } from "@/lib/phone";
import { getIntegrationSecrets } from "@/lib/settings";
import { site } from "@/lib/site";

export async function GET(request: Request) {
  const secrets = await getIntegrationSecrets();
  const to = toE164(new URL(request.url).searchParams.get("to") || "");
  const caller = toE164(secrets.signalwireFromNumber || site.phoneTel);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Connecting you with Clearway Junk Removal.</Say>
  ${to ? `<Dial callerId="${caller}">${to}</Dial>` : "<Hangup />"}
</Response>`;
  return new NextResponse(xml, { headers: { "Content-Type": "text/xml" } });
}

export async function POST(request: Request) {
  return GET(request);
}

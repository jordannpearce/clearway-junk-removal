import { publicSiteUrl } from "@/lib/site";
import { toE164 } from "@/lib/phone";

export function signalwireConfig() {
  const spaceRaw = process.env.SIGNALWIRE_SPACE || process.env.SIGNALWIRE_SPACE_URL || "";
  const projectId = process.env.SIGNALWIRE_PROJECT_ID || "";
  const token = process.env.SIGNALWIRE_API_TOKEN || process.env.SIGNALWIRE_TOKEN || "";
  const fromNumber = process.env.SIGNALWIRE_FROM_NUMBER || process.env.SIGNALWIRE_PHONE_NUMBER || "";
  const space = spaceRaw.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return {
    space,
    projectId,
    token,
    fromNumber,
    configured: Boolean(space && projectId && token && fromNumber),
  };
}

function authHeader(projectId: string, token: string) {
  return `Basic ${Buffer.from(`${projectId}:${token}`).toString("base64")}`;
}

async function parseBody(response: Response) {
  const text = await response.text();
  try {
    return { ok: response.ok, status: response.status, data: JSON.parse(text) as Record<string, unknown> };
  } catch {
    return { ok: response.ok, status: response.status, data: { raw: text } as Record<string, unknown> };
  }
}

export async function sendSignalWireSms(input: { to: string; body: string }) {
  const config = signalwireConfig();
  if (!config.configured) {
    return { ok: false, mocked: true, id: "", error: "SignalWire is not configured." };
  }
  const to = toE164(input.to);
  const from = toE164(config.fromNumber);
  const url = `https://${config.space}/api/laml/2010-04-01/Accounts/${config.projectId}/Messages.json`;
  const params = new URLSearchParams({
    To: to,
    From: from,
    Body: input.body,
    StatusCallback: `${publicSiteUrl()}/api/signalwire/sms-status`,
  });
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeader(config.projectId, config.token),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  const parsed = await parseBody(response);
  const id = String(parsed.data.sid || parsed.data.id || "");
  if (!parsed.ok) {
    const error = String(parsed.data.message || parsed.data.error || parsed.data.raw || `SignalWire SMS failed (${parsed.status})`);
    return { ok: false, mocked: false, id, error };
  }
  return { ok: true, mocked: false, id, error: "" };
}

export async function startSignalWireCall(input: { to: string; contactName?: string }) {
  const config = signalwireConfig();
  if (!config.configured) {
    return { ok: false, mocked: true, id: "", error: "SignalWire is not configured." };
  }
  const to = toE164(input.to);
  const from = toE164(config.fromNumber);
  const twimlUrl = `${publicSiteUrl()}/api/signalwire/twiml/connect?to=${encodeURIComponent(to)}`;
  const url = `https://${config.space}/api/laml/2010-04-01/Accounts/${config.projectId}/Calls.json`;
  const params = new URLSearchParams({
    To: to,
    From: from,
    Url: twimlUrl,
    StatusCallback: `${publicSiteUrl()}/api/signalwire/voice`,
    StatusCallbackEvent: "initiated ringing answered completed",
  });
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeader(config.projectId, config.token),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  const parsed = await parseBody(response);
  const id = String(parsed.data.sid || parsed.data.id || "");
  if (!parsed.ok) {
    const error = String(parsed.data.message || parsed.data.error || parsed.data.raw || `SignalWire call failed (${parsed.status})`);
    return { ok: false, mocked: false, id, error };
  }
  return { ok: true, mocked: false, id, error: "" };
}

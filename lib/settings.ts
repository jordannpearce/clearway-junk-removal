import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { hasDatabase, query } from "@/lib/db";
import { site } from "@/lib/site";

export type IntegrationSecrets = {
  resendApiKey: string;
  resendFromEmail: string;
  signalwireSpace: string;
  signalwireProjectId: string;
  signalwireApiToken: string;
  signalwireFromNumber: string;
};

export type IntegrationSource = "environment" | "admin" | "mixed" | "none";

const settingKeys = [
  "resend_api_key",
  "resend_from_email",
  "signalwire_space",
  "signalwire_project_id",
  "signalwire_api_token",
  "signalwire_from_number",
] as const;

const filePath = path.join(process.cwd(), "data", "app-settings.json");

function emptySecrets(): IntegrationSecrets {
  return {
    resendApiKey: "",
    resendFromEmail: "",
    signalwireSpace: "",
    signalwireProjectId: "",
    signalwireApiToken: "",
    signalwireFromNumber: "",
  };
}

function fromRowMap(rows: Record<string, string>): IntegrationSecrets {
  return {
    resendApiKey: rows.resend_api_key || "",
    resendFromEmail: rows.resend_from_email || "",
    signalwireSpace: (rows.signalwire_space || "").replace(/^https?:\/\//, "").replace(/\/$/, ""),
    signalwireProjectId: rows.signalwire_project_id || "",
    signalwireApiToken: rows.signalwire_api_token || "",
    signalwireFromNumber: rows.signalwire_from_number || "",
  };
}

function envSecrets(): IntegrationSecrets {
  return {
    resendApiKey: process.env.RESEND_API_KEY || "",
    resendFromEmail: process.env.RESEND_FROM_EMAIL || "",
    signalwireSpace: (process.env.SIGNALWIRE_SPACE || process.env.SIGNALWIRE_SPACE_URL || "").replace(/^https?:\/\//, "").replace(/\/$/, ""),
    signalwireProjectId: process.env.SIGNALWIRE_PROJECT_ID || "",
    signalwireApiToken: process.env.SIGNALWIRE_API_TOKEN || process.env.SIGNALWIRE_TOKEN || "",
    signalwireFromNumber: process.env.SIGNALWIRE_FROM_NUMBER || process.env.SIGNALWIRE_PHONE_NUMBER || "",
  };
}

function readFileSecrets(): IntegrationSecrets {
  if (!existsSync(filePath)) return emptySecrets();
  try {
    return { ...emptySecrets(), ...JSON.parse(readFileSync(filePath, "utf8")) };
  } catch {
    return emptySecrets();
  }
}

function writeFileSecrets(next: IntegrationSecrets) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(next, null, 2));
}

async function storedSecrets(): Promise<IntegrationSecrets> {
  if (!hasDatabase()) return readFileSecrets();
  const result = await query<{ key: string; value: string }>("SELECT key, value FROM settings");
  const rows: Record<string, string> = {};
  for (const row of result.rows) rows[row.key] = row.value;
  return fromRowMap(rows);
}

function pick(envValue: string, storedValue: string) {
  return envValue || storedValue;
}

export async function getIntegrationSecrets(): Promise<IntegrationSecrets> {
  const env = envSecrets();
  const stored = await storedSecrets();
  return {
    resendApiKey: pick(env.resendApiKey, stored.resendApiKey),
    resendFromEmail: pick(env.resendFromEmail, stored.resendFromEmail) || `Clearway Junk Removal <${site.email}>`,
    signalwireSpace: pick(env.signalwireSpace, stored.signalwireSpace),
    signalwireProjectId: pick(env.signalwireProjectId, stored.signalwireProjectId),
    signalwireApiToken: pick(env.signalwireApiToken, stored.signalwireApiToken),
    signalwireFromNumber: pick(env.signalwireFromNumber, stored.signalwireFromNumber),
  };
}

export function maskSecret(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.length <= 4) return "••••";
  return `••••${trimmed.slice(-4)}`;
}

export async function getIntegrationStatus() {
  const env = envSecrets();
  const stored = await storedSecrets();
  const merged = await getIntegrationSecrets();
  const sourceFor = (envValue: string, storedValue: string): "environment" | "admin" | "none" => {
    if (envValue) return "environment";
    if (storedValue) return "admin";
    return "none";
  };
  return {
    resend: {
      configured: Boolean(merged.resendApiKey),
      fromEmail: merged.resendFromEmail,
      keyHint: maskSecret(merged.resendApiKey),
      source: sourceFor(env.resendApiKey, stored.resendApiKey),
      lockedByEnv: Boolean(env.resendApiKey),
    },
    signalwire: {
      configured: Boolean(merged.signalwireSpace && merged.signalwireProjectId && merged.signalwireApiToken && merged.signalwireFromNumber),
      space: merged.signalwireSpace,
      projectHint: maskSecret(merged.signalwireProjectId),
      tokenHint: maskSecret(merged.signalwireApiToken),
      fromNumber: merged.signalwireFromNumber,
      source: sourceFor(env.signalwireApiToken, stored.signalwireApiToken),
      lockedByEnv: Boolean(env.signalwireApiToken || env.signalwireProjectId),
    },
  };
}

export async function saveIntegrationSecrets(input: Partial<IntegrationSecrets>) {
  const current = await storedSecrets();
  const next: IntegrationSecrets = {
    resendApiKey: input.resendApiKey ?? current.resendApiKey,
    resendFromEmail: input.resendFromEmail ?? current.resendFromEmail,
    signalwireSpace: (input.signalwireSpace ?? current.signalwireSpace).replace(/^https?:\/\//, "").replace(/\/$/, ""),
    signalwireProjectId: input.signalwireProjectId ?? current.signalwireProjectId,
    signalwireApiToken: input.signalwireApiToken ?? current.signalwireApiToken,
    signalwireFromNumber: input.signalwireFromNumber ?? current.signalwireFromNumber,
  };
  if (!hasDatabase()) {
    writeFileSecrets(next);
    return next;
  }
  const pairs: Array<[string, string]> = [
    ["resend_api_key", next.resendApiKey],
    ["resend_from_email", next.resendFromEmail],
    ["signalwire_space", next.signalwireSpace],
    ["signalwire_project_id", next.signalwireProjectId],
    ["signalwire_api_token", next.signalwireApiToken],
    ["signalwire_from_number", next.signalwireFromNumber],
  ];
  for (const [key, value] of pairs) {
    await query(
      `INSERT INTO settings (key, value, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [key, value],
    );
  }
  return next;
}

export { settingKeys };

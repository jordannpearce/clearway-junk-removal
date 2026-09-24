import { hasDatabase, query } from "@/lib/db";
import { addNotification as addFileNotification, listNotifications as listFileNotifications } from "@/lib/store";
import type { CallRecord, NotificationLog, NotifyChannel } from "@/lib/types";

function mapNotification(row: {
  id: string;
  job_id: string | null;
  channel: NotifyChannel;
  destination: string;
  subject: string;
  body: string;
  provider: string;
  status: NotificationLog["status"];
  kind: string | null;
  audience: string | null;
  external_id: string | null;
  created_at: Date;
}): NotificationLog {
  return {
    id: row.id,
    jobId: row.job_id || undefined,
    channel: row.channel,
    to: row.destination,
    subject: row.subject,
    body: row.body,
    provider: row.provider,
    status: row.status,
    kind: row.kind || undefined,
    audience: row.audience || undefined,
    externalId: row.external_id || undefined,
    createdAt: row.created_at.toISOString(),
  };
}

export async function recordNotification(entry: Omit<NotificationLog, "id" | "createdAt">) {
  if (!hasDatabase()) {
    return addFileNotification(entry);
  }
  const item: NotificationLog = {
    ...entry,
    id: `note-${crypto.randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
  };
  await query(
    `INSERT INTO notifications (id, job_id, channel, destination, subject, body, provider, status, kind, audience, external_id, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [item.id, item.jobId || null, item.channel, item.to, item.subject, item.body, item.provider, item.status, item.kind || null, item.audience || null, item.externalId || null, item.createdAt],
  );
  return item;
}

export async function listNotificationLog(limit = 80): Promise<NotificationLog[]> {
  if (!hasDatabase()) return listFileNotifications().slice(0, limit);
  const result = await query<{
    id: string;
    job_id: string | null;
    channel: NotifyChannel;
    destination: string;
    subject: string;
    body: string;
    provider: string;
    status: NotificationLog["status"];
    kind: string | null;
    audience: string | null;
    external_id: string | null;
    created_at: Date;
  }>("SELECT * FROM notifications ORDER BY created_at DESC LIMIT $1", [limit]);
  return result.rows.map(mapNotification);
}

export async function recordCall(entry: Omit<CallRecord, "id" | "createdAt">) {
  const item: CallRecord = {
    ...entry,
    id: `call-${crypto.randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
  };
  if (!hasDatabase()) {
    await recordNotification({
      channel: "call",
      to: item.toNumber,
      subject: item.purpose || "Call",
      body: `${item.direction} ${item.contactName} ${item.fromNumber} → ${item.toNumber}\n${item.notes}`,
      provider: item.provider,
      status: item.status === "failed" ? "failed" : item.provider.includes("mock") ? "mocked" : "logged",
      kind: "call",
      audience: item.contactRole,
      externalId: item.externalId,
    });
    return item;
  }
  await query(
    `INSERT INTO calls (id, direction, from_number, to_number, contact_name, contact_role, purpose, notes, duration_seconds, status, provider, external_id, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
    [item.id, item.direction, item.fromNumber, item.toNumber, item.contactName, item.contactRole, item.purpose, item.notes, item.durationSeconds ?? null, item.status, item.provider, item.externalId || null, item.createdAt],
  );
  await recordNotification({
    channel: "call",
    to: item.toNumber,
    subject: item.purpose || "Call",
    body: `${item.direction} ${item.contactName}\n${item.notes}`,
    provider: item.provider,
    status: item.status === "failed" ? "failed" : "logged",
    kind: "call",
    audience: item.contactRole,
    externalId: item.externalId,
  });
  return item;
}

export async function listCalls(limit = 80): Promise<CallRecord[]> {
  if (!hasDatabase()) {
    return (await listNotificationLog(limit))
      .filter((item) => item.channel === "call")
      .map((item) => ({
        id: item.id,
        direction: item.body.startsWith("inbound") ? "inbound" : "outbound",
        fromNumber: "",
        toNumber: item.to,
        contactName: item.audience || "",
        contactRole: (item.audience as CallRecord["contactRole"]) || "other",
        purpose: item.subject,
        notes: item.body,
        status: item.status,
        provider: item.provider,
        externalId: item.externalId,
        createdAt: item.createdAt,
      }));
  }
  const result = await query<{
    id: string;
    direction: CallRecord["direction"];
    from_number: string;
    to_number: string;
    contact_name: string;
    contact_role: CallRecord["contactRole"];
    purpose: string;
    notes: string;
    duration_seconds: number | null;
    status: string;
    provider: string;
    external_id: string | null;
    created_at: Date;
  }>("SELECT * FROM calls ORDER BY created_at DESC LIMIT $1", [limit]);
  return result.rows.map((row) => ({
    id: row.id,
    direction: row.direction,
    fromNumber: row.from_number,
    toNumber: row.to_number,
    contactName: row.contact_name,
    contactRole: row.contact_role,
    purpose: row.purpose,
    notes: row.notes,
    durationSeconds: row.duration_seconds ?? undefined,
    status: row.status,
    provider: row.provider,
    externalId: row.external_id || undefined,
    createdAt: row.created_at.toISOString(),
  }));
}

export async function updateCallByExternalId(externalId: string, patch: Partial<Pick<CallRecord, "status" | "durationSeconds" | "notes">>) {
  if (!hasDatabase() || !externalId) return;
  await query(
    `UPDATE calls
     SET status = COALESCE($2, status),
         duration_seconds = COALESCE($3, duration_seconds),
         notes = CASE WHEN $4 <> '' THEN notes || E'\\n' || $4 ELSE notes END
     WHERE external_id = $1`,
    [externalId, patch.status || null, patch.durationSeconds ?? null, patch.notes || ""],
  );
}

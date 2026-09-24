import { Resend } from "resend";
import { recordNotification } from "@/lib/comms";
import { sendSignalWireSms, signalwireConfig } from "@/lib/signalwire";
import { site } from "@/lib/site";
import type { Job, NotifyChannel } from "@/lib/types";

function resendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export function resendConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  body: string;
  jobId?: string;
  kind?: string;
  audience?: string;
}) {
  const from = process.env.RESEND_FROM_EMAIL || `Clearway Junk Removal <${site.email}>`;
  const client = resendClient();
  if (!client) {
    return recordNotification({
      jobId: input.jobId,
      channel: "email",
      to: input.to,
      subject: input.subject,
      body: input.body,
      provider: "resend-mock",
      status: "mocked",
      kind: input.kind,
      audience: input.audience,
    });
  }
  try {
    const result = await client.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      text: input.body,
    });
    return recordNotification({
      jobId: input.jobId,
      channel: "email",
      to: input.to,
      subject: input.subject,
      body: input.body,
      provider: "resend",
      status: "sent",
      kind: input.kind,
      audience: input.audience,
      externalId: result.data?.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Resend send failed";
    return recordNotification({
      jobId: input.jobId,
      channel: "email",
      to: input.to,
      subject: input.subject,
      body: `${input.body}\n\nError: ${message}`,
      provider: "resend",
      status: "failed",
      kind: input.kind,
      audience: input.audience,
    });
  }
}

export async function sendSms(input: {
  to: string;
  body: string;
  jobId?: string;
  kind?: string;
  audience?: string;
}) {
  const config = signalwireConfig();
  if (!config.configured) {
    return recordNotification({
      jobId: input.jobId,
      channel: "sms",
      to: input.to,
      subject: input.kind === "review" ? "Review request" : "SMS",
      body: input.body,
      provider: "signalwire-mock",
      status: "mocked",
      kind: input.kind || "sms",
      audience: input.audience,
    });
  }
  try {
    const result = await sendSignalWireSms({ to: input.to, body: input.body });
    if (!result.ok) {
      return recordNotification({
        jobId: input.jobId,
        channel: "sms",
        to: input.to,
        subject: "SMS",
        body: `${input.body}\n\nError: ${result.error}`,
        provider: "signalwire",
        status: "failed",
        kind: input.kind || "sms",
        audience: input.audience,
        externalId: result.id,
      });
    }
    return recordNotification({
      jobId: input.jobId,
      channel: "sms",
      to: input.to,
      subject: "SMS",
      body: input.body,
      provider: "signalwire",
      status: "queued",
      kind: input.kind || "sms",
      audience: input.audience,
      externalId: result.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "SignalWire SMS failed";
    return recordNotification({
      jobId: input.jobId,
      channel: "sms",
      to: input.to,
      subject: "SMS",
      body: `${input.body}\n\nError: ${message}`,
      provider: "signalwire",
      status: "failed",
      kind: input.kind || "sms",
      audience: input.audience,
    });
  }
}

export async function notifyPeople(input: {
  channel: NotifyChannel;
  to: string;
  subject: string;
  body: string;
  jobId?: string;
  kind?: string;
}) {
  if (input.channel === "email") {
    return sendEmail({ ...input, kind: input.kind || "notification" });
  }
  if (input.channel === "sms") {
    return sendSms({ to: input.to, body: `${input.subject}\n\n${input.body}`, jobId: input.jobId, kind: input.kind || "notification" });
  }
  return recordNotification({
    jobId: input.jobId,
    channel: "call",
    to: input.to,
    subject: input.subject,
    body: input.body,
    provider: "manual",
    status: "logged",
    kind: input.kind,
  });
}

export function jobStatusMessage(job: Job) {
  const window = `${job.scheduledDate} ${job.scheduledWindow}`;
  const tech = job.technicianName ? ` Technician ${job.technicianName} is assigned.` : "";
  switch (job.status) {
    case "requested":
      return `We received your ${job.serviceName} request for ${job.address}, ${job.city}. Our dispatch desk will confirm a window shortly.`;
    case "confirmed":
      return `Your ${job.serviceName} visit is confirmed for ${window} at ${job.address}, ${job.city}.${tech}`;
    case "dispatched":
      return `A Clearway crew has been dispatched for ${window} in ${job.city}.${tech}`;
    case "en_route":
      return `${job.technicianName || "Your technician"} is en route to ${job.address}, ${job.city}.`;
    case "on_site":
      return `The crew is on site at ${job.address}. If you have a last keep-versus-go decision, tell them before anything is loaded.`;
    case "completed":
      return `Your ${job.serviceName} job in ${job.city} is complete. Thank you for trusting Clearway. We would be grateful for a short review.`;
    case "cancelled":
      return `Your ${job.serviceName} job in ${job.city} was cancelled. If that was a mistake, reply and we will restore a window.`;
  }
}

export async function notifyJobChange(job: Job, audience: Array<{ channel: NotifyChannel; to: string; name: string }>) {
  const subject = `Clearway job ${job.id} is ${job.status.replace("_", " ")}`;
  const body = jobStatusMessage(job);
  const logs = [];
  for (const person of audience) {
    logs.push(
      await notifyPeople({
        channel: person.channel,
        to: person.to,
        subject,
        body: `Hi ${person.name},\n\n${body}\n\nJob ${job.id}\n${job.address}, ${job.city} ${job.zip}\n${site.phone}`,
        jobId: job.id,
        kind: "notification",
      }),
    );
  }
  return logs;
}

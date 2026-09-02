import { Resend } from "resend";
import { addNotification } from "@/lib/store";
import { site } from "@/lib/site";
import type { Job, NotifyChannel } from "@/lib/types";

const smsProviders = [
  {
    name: "Telnyx",
    bestFor: "East Bay businesses that want lower per-message cost and strong 10DLC tools",
    notes:
      "Good default for a Hayward operator. You register your local brand once, then send reminders and review requests from a California number.",
    url: "https://telnyx.com/products/sms-api",
  },
  {
    name: "Twilio",
    bestFor: "Teams that want the most tutorials, a mature Node SDK, and easy Resend-like developer flow",
    notes:
      "The usual starting point. A1/10DLC registration is required for application-to-person SMS in the United States. Excellent docs for Next.js.",
    url: "https://www.twilio.com/en-us/messaging/channels/sms",
  },
  {
    name: "Bandwidth",
    bestFor: "Operators already buying local phone numbers or wanting a carrier-style CPaaS",
    notes:
      "Strong if you also want voice dispatch or to port a Hayward (510) or Contra Costa (925) number onto the same account.",
    url: "https://www.bandwidth.com/messaging/sms/",
  },
  {
    name: "Plivo",
    bestFor: "Simple SMS APIs with straightforward pricing",
    notes: "A lighter alternative when you only need reminders, not a full contact-center stack.",
    url: "https://www.plivo.com/sms/",
  },
  {
    name: "Vonage",
    bestFor: "Combined voice plus SMS if dispatchers also call customers",
    notes: "Useful when your ops desk wants click-to-call and text from one platform.",
    url: "https://www.vonage.com/communications-apis/messages/",
  },
] as const;

export const recommendedSmsProviders = smsProviders;

function resendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  body: string;
  jobId?: string;
}) {
  const from = process.env.RESEND_FROM_EMAIL || `Clearway Junk Removal <${site.email}>`;
  const client = resendClient();
  if (!client) {
    return addNotification({
      jobId: input.jobId,
      channel: "email",
      to: input.to,
      subject: input.subject,
      body: input.body,
      provider: "resend-mock",
      status: "mocked",
    });
  }
  try {
    await client.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      text: input.body,
    });
    return addNotification({
      jobId: input.jobId,
      channel: "email",
      to: input.to,
      subject: input.subject,
      body: input.body,
      provider: "resend",
      status: "sent",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Resend send failed";
    return addNotification({
      jobId: input.jobId,
      channel: "email",
      to: input.to,
      subject: input.subject,
      body: `${input.body}\n\nError: ${message}`,
      provider: "resend",
      status: "failed",
    });
  }
}

export async function sendSms(input: { to: string; body: string; jobId?: string }) {
  const provider = process.env.SMS_PROVIDER || "mock";
  const token = process.env.SMS_API_KEY;
  if (!token || provider === "mock") {
    return addNotification({
      jobId: input.jobId,
      channel: "sms",
      to: input.to,
      subject: "SMS",
      body: input.body,
      provider: `${provider}-mock`,
      status: "mocked",
    });
  }

  // Provider-specific implementations can be added when keys are present.
  // We keep the send path honest: without a configured integration we mock.
  return addNotification({
    jobId: input.jobId,
    channel: "sms",
    to: input.to,
    subject: "SMS",
    body: input.body,
    provider,
    status: "mocked",
  });
}

export async function notifyPeople(input: {
  channel: NotifyChannel;
  to: string;
  subject: string;
  body: string;
  jobId?: string;
}) {
  if (input.channel === "email") {
    return sendEmail(input);
  }
  return sendSms({ to: input.to, body: `${input.subject}\n\n${input.body}`, jobId: input.jobId });
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
      }),
    );
  }
  return logs;
}

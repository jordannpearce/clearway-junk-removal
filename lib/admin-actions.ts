"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAccount, findUserByEmail, hasStaffAccount, listAccounts, listCustomers, upsertCustomer } from "@/lib/accounts";
import { recordCall } from "@/lib/comms";
import { applyTemplate, defaultEmailCopy, emailKinds } from "@/lib/email-templates";
import { getSession, setSession } from "@/lib/auth";
import { findCityByName } from "@/lib/cities";
import { sendEmail, sendSms } from "@/lib/notify";
import { signalwireConfig, startSignalWireCall } from "@/lib/signalwire";
import { site } from "@/lib/site";
import { createTechnician, listTechnicians } from "@/lib/store";
import type { EmailKind, UserRole } from "@/lib/types";

function isStaff(role?: string) {
  return role === "admin" || role === "ops";
}

async function requireStaff() {
  const session = await getSession();
  if (!session || !isStaff(session.role)) redirect("/login");
  return session;
}

export async function createFirstAdminAction(formData: FormData) {
  if (await hasStaffAccount()) {
    redirect("/login?error=An%20admin%20account%20already%20exists.");
  }
  const password = String(formData.get("password") || "").trim();
  const confirm = String(formData.get("confirm") || "").trim();
  if (password.length < 8 || password !== confirm) {
    redirect("/admin/setup?error=Use%20a%20password%20of%20at%20least%208%20characters%20and%20confirm%20it.");
  }
  const user = await createAccount({
    name: String(formData.get("name") || "Clearway admin"),
    email: String(formData.get("email") || site.email),
    phone: String(formData.get("phone") || site.phone),
    password,
    role: "admin",
    city: "Hayward",
    zip: "94541",
  });
  await setSession({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  });
  redirect("/admin");
}

export async function createPersonAction(formData: FormData) {
  await requireStaff();
  const role = String(formData.get("role") || "customer") as UserRole;
  const email = String(formData.get("email") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const password = String(formData.get("password") || "");
  const cityName = String(formData.get("city") || "Hayward");
  const notes = String(formData.get("notes") || "");
  if (!name || !email || !phone) {
    redirect("/admin/people?error=Name%2C%20email%2C%20and%20phone%20are%20required.");
  }
  if (await findUserByEmail(email)) {
    redirect("/admin/people?error=That%20email%20already%20has%20an%20account.");
  }
  if (role !== "customer" && password.length < 8) {
    redirect("/admin/people?error=Staff%20accounts%20need%20a%20password%20of%20at%20least%208%20characters.");
  }
  const city = findCityByName(cityName);
  const user = await createAccount({
    name,
    email,
    phone,
    password: password || crypto.randomUUID().slice(0, 12),
    role,
    city: city?.name || cityName,
    zip: city?.zip,
  });
  if (role === "customer") {
    await upsertCustomer({ userId: user.id, name, email, phone, city: city?.name, zip: city?.zip, notes });
  }
  if (role === "tech") {
    createTechnician({
      userId: user.id,
      name,
      phone,
      email,
      homeCity: city?.name || "Hayward",
      county: city?.county || "Alameda",
      lat: city?.lat || 37.6688,
      lng: city?.lng || -122.081,
      active: true,
      specialties: String(formData.get("specialties") || "Household junk")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  }
  if (String(formData.get("send_welcome") || "") === "1") {
    const kind = role === "customer" ? "welcome" : "account_opening";
    const copy = defaultEmailCopy(kind, name);
    await sendEmail({
      to: email,
      subject: copy.subject,
      body: applyTemplate(copy.body, { name }),
      kind,
      audience: role,
    });
  }
  revalidatePath("/admin");
  revalidatePath("/admin/people");
  redirect("/admin/people?created=1");
}

function parseAudience(raw: string) {
  return raw as "one" | "customers" | "technicians" | "dispatch" | "staff";
}

async function recipientsFor(audience: string, oneTo: string, oneName: string) {
  if (audience === "one") {
    return oneTo ? [{ to: oneTo, name: oneName || "there", role: "other" }] : [];
  }
  const users = await listAccounts();
  if (audience === "customers") {
    const customers = await listCustomers();
    return customers
      .filter((item) => item.email)
      .map((item) => ({ to: item.email, name: item.name, role: "customer" }));
  }
  if (audience === "technicians") {
    return listTechnicians().map((item) => ({ to: item.email, name: item.name, role: "tech" }));
  }
  if (audience === "dispatch") {
    return users.filter((item) => item.role === "ops" || item.role === "admin").map((item) => ({ to: item.email, name: item.name, role: item.role }));
  }
  return users.filter((item) => item.role !== "customer").map((item) => ({ to: item.email, name: item.name, role: item.role }));
}

export async function sendAdminEmailAction(formData: FormData) {
  await requireStaff();
  const kind = (String(formData.get("kind") || "notification") as EmailKind) || "notification";
  const audience = parseAudience(String(formData.get("audience") || "one"));
  const subject = String(formData.get("subject") || defaultEmailCopy(kind).subject);
  const body = String(formData.get("body") || defaultEmailCopy(kind).body);
  const people = await recipientsFor(audience, String(formData.get("to") || ""), String(formData.get("name") || ""));
  if (people.length === 0) {
    redirect("/admin/email?error=Add%20at%20least%20one%20recipient.");
  }
  for (const person of people) {
    await sendEmail({
      to: person.to,
      subject: applyTemplate(subject, { name: person.name }),
      body: applyTemplate(body, { name: person.name }),
      kind,
      audience: person.role,
    });
  }
  revalidatePath("/admin/email");
  revalidatePath("/admin/notifications");
  redirect(`/admin/email?sent=${people.length}`);
}

export async function sendAdminSmsAction(formData: FormData) {
  await requireStaff();
  const audience = parseAudience(String(formData.get("audience") || "one"));
  const body = String(formData.get("body") || "");
  if (!body.trim()) redirect("/admin/sms?error=Write%20the%20text%20first.");
  const smsTargets = [];
  if (audience === "one") {
    smsTargets.push({ to: String(formData.get("to") || ""), name: String(formData.get("name") || "there"), role: "other" });
  } else if (audience === "customers") {
    const customers = await listCustomers();
    smsTargets.push(...customers.filter((item) => item.phone).map((item) => ({ to: item.phone, name: item.name, role: "customer" })));
  } else if (audience === "technicians") {
    smsTargets.push(...listTechnicians().map((item) => ({ to: item.phone, name: item.name, role: "tech" })));
  } else {
    const users = await listAccounts();
    const roles = audience === "dispatch" ? ["ops", "admin"] : ["ops", "admin", "tech"];
    smsTargets.push(...users.filter((item) => roles.includes(item.role) && item.phone).map((item) => ({ to: item.phone, name: item.name, role: item.role })));
  }
  if (smsTargets.length === 0) redirect("/admin/sms?error=Add%20a%20phone%20number%20or%20choose%20an%20audience.");
  for (const person of smsTargets) {
    await sendSms({
      to: person.to,
      body: applyTemplate(body, { name: person.name }),
      kind: String(formData.get("kind") || "notification"),
      audience: person.role,
    });
  }
  revalidatePath("/admin/sms");
  revalidatePath("/admin/notifications");
  redirect(`/admin/sms?sent=${smsTargets.length}`);
}

export async function logCallAction(formData: FormData) {
  await requireStaff();
  await recordCall({
    direction: String(formData.get("direction") || "outbound") === "inbound" ? "inbound" : "outbound",
    fromNumber: String(formData.get("from") || site.phone),
    toNumber: String(formData.get("to") || ""),
    contactName: String(formData.get("name") || ""),
    contactRole: (String(formData.get("contact_role") || "customer") as "customer" | "tech" | "ops" | "other"),
    purpose: String(formData.get("purpose") || "Follow-up"),
    notes: String(formData.get("notes") || ""),
    durationSeconds: Number(formData.get("duration") || 0) ? Number(formData.get("duration")) * 60 : undefined,
    status: "logged",
    provider: "manual",
  });
  revalidatePath("/admin/calls");
  redirect("/admin/calls?logged=1");
}

export async function startCallAction(formData: FormData) {
  await requireStaff();
  const to = String(formData.get("to") || "");
  const name = String(formData.get("name") || "");
  const config = signalwireConfig();
  const result = await startSignalWireCall({ to, contactName: name });
  await recordCall({
    direction: "outbound",
    fromNumber: config.fromNumber || site.phone,
    toNumber: to,
    contactName: name,
    contactRole: (String(formData.get("contact_role") || "customer") as "customer" | "tech" | "ops" | "other"),
    purpose: String(formData.get("purpose") || "Outbound call"),
    notes: result.ok ? "Started from admin." : result.error,
    status: result.ok ? "queued" : result.mocked ? "mocked" : "failed",
    provider: result.mocked ? "signalwire-mock" : "signalwire",
    externalId: result.id || undefined,
  });
  revalidatePath("/admin/calls");
  redirect(result.ok || result.mocked ? "/admin/calls?started=1" : `/admin/calls?error=${encodeURIComponent(result.error)}`);
}

export async function loadEmailTemplateAction(formData: FormData) {
  await requireStaff();
  const kind = String(formData.get("kind") || "notification");
  redirect(`/admin/email?kind=${encodeURIComponent(kind)}`);
}

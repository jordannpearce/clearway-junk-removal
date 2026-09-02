"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cities, findCityByName } from "@/lib/cities";
import { clearSession, getSession, loginWithPassword, registerCustomer, setSession } from "@/lib/auth";
import { setSavedLocation } from "@/lib/location-cookie";
import { suggestTechnician } from "@/lib/location";
import { notifyJobChange, notifyPeople, sendEmail, sendSms } from "@/lib/notify";
import { getService } from "@/lib/services";
import {
  createJob,
  getJob,
  getTechnician,
  updateJob,
} from "@/lib/store";
import type { JobSize, JobStatus, NotifyChannel } from "@/lib/types";

export async function saveLocationAction(formData: FormData) {
  const cityName = String(formData.get("city") || "");
  const zip = String(formData.get("zip") || "");
  const city = findCityByName(cityName) ?? cities.find((item) => item.zip === zip);
  if (!city) {
    throw new Error("Choose a city we serve in Alameda County or Contra Costa County.");
  }
  await setSavedLocation({
    city: city.name,
    zip: zip || city.zip,
    label: `${city.name}, ${city.county} County`,
  });
  revalidatePath("/");
  redirect("/location");
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const session = loginWithPassword(email, password);
  if (!session) {
    redirect("/login?error=We%20could%20not%20match%20that%20email%20and%20password.");
  }
  await setSession(session);
  redirect(session.role === "customer" ? "/account" : "/ops");
}

export async function registerAction(formData: FormData) {
  try {
    const session = registerCustomer({
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      password: String(formData.get("password") || ""),
      city: String(formData.get("city") || ""),
      zip: String(formData.get("zip") || ""),
    });
    await setSession(session);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create the account.";
    redirect(`/login?error=${encodeURIComponent(message)}`);
  }
  redirect("/account");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}

export async function scheduleJobAction(formData: FormData) {
  const session = await getSession();
  const service = getService(String(formData.get("service") || ""));
  if (!service) {
    redirect("/schedule?error=Choose%20a%20service%20so%20we%20can%20price%20and%20staff%20the%20visit.");
  }
  const cityName = String(formData.get("city") || "Hayward");
  const city = findCityByName(cityName);
  const location = {
    city: city?.name || cityName,
    zip: String(formData.get("zip") || city?.zip || "94541"),
    label: city ? `${city.name}, ${city.county} County` : cityName,
  };
  const nearest = suggestTechnician(location);
  const customerName = session?.name || String(formData.get("name") || "Guest customer");
  const customerEmail = session?.email || String(formData.get("email") || "");
  const customerPhone = String(formData.get("phone") || "");

  const job = createJob({
    customerId: session?.userId || "guest",
    customerName,
    customerEmail,
    customerPhone,
    serviceSlug: service.slug,
    serviceName: service.name,
    city: location.city,
    address: String(formData.get("address") || ""),
    zip: location.zip,
    notes: String(formData.get("notes") || ""),
    size: String(formData.get("size") || "truck-half") as JobSize,
    scheduledDate: String(formData.get("date") || ""),
    scheduledWindow: String(formData.get("window") || "9:00 a.m. – 12:00 p.m."),
    technicianId: nearest?.tech.id,
    technicianName: nearest?.tech.name,
    status: nearest ? "confirmed" : "requested",
  });

  const audience = [
    { channel: "email" as const, to: customerEmail, name: customerName },
    { channel: "email" as const, to: "ops@clearwayjunk.com", name: "Clearway dispatch" },
  ];
  if (nearest) {
    audience.push({ channel: "email", to: nearest.tech.email, name: nearest.tech.name });
  }
  if (customerPhone) {
    audience.push({ channel: "sms", to: customerPhone, name: customerName });
  }
  await notifyJobChange(job, audience.filter((item) => item.to));

  revalidatePath("/account");
  revalidatePath("/ops");
  if (session) {
    redirect(`/account/jobs/${job.id}?booked=1`);
  }
  redirect(`/schedule/thanks?job=${job.id}`);
}

export async function updateCustomerJobAction(formData: FormData) {
  const session = await getSession();
  const id = String(formData.get("id") || "");
  const job = getJob(id);
  if (!session || !job || (session.role === "customer" && job.customerId !== session.userId)) {
    redirect("/account");
  }
  const next = updateJob(id, {
    address: String(formData.get("address") || job.address),
    city: String(formData.get("city") || job.city),
    zip: String(formData.get("zip") || job.zip),
    notes: String(formData.get("notes") || job.notes),
    scheduledDate: String(formData.get("date") || job.scheduledDate),
    scheduledWindow: String(formData.get("window") || job.scheduledWindow),
    size: String(formData.get("size") || job.size) as JobSize,
  });
  if (next) {
    const audience = [{ channel: "email" as const, to: "ops@clearwayjunk.com", name: "Clearway dispatch" }];
    if (next.technicianId) {
      const tech = getTechnician(next.technicianId);
      if (tech) audience.push({ channel: "email", to: tech.email, name: tech.name });
    }
    await notifyJobChange(next, audience);
  }
  revalidatePath("/account");
  revalidatePath("/ops");
  redirect(`/account/jobs/${id}?updated=1`);
}

export async function cancelJobAction(formData: FormData) {
  const session = await getSession();
  const id = String(formData.get("id") || "");
  const job = getJob(id);
  if (!session || !job) redirect("/");
  if (session.role === "customer" && job.customerId !== session.userId) redirect("/account");
  const next = updateJob(id, { status: "cancelled" });
  if (next) {
    await notifyJobChange(next, [
      { channel: "email", to: next.customerEmail, name: next.customerName },
      { channel: "email", to: "ops@clearwayjunk.com", name: "Clearway dispatch" },
      ...(next.technicianId
        ? [
            {
              channel: "email" as const,
              to: getTechnician(next.technicianId)?.email || "",
              name: next.technicianName || "Technician",
            },
          ]
        : []),
    ].filter((item) => item.to));
  }
  revalidatePath("/account");
  revalidatePath("/ops");
  redirect(session.role === "customer" ? "/account?cancelled=1" : "/ops/jobs");
}

export async function dispatchJobAction(formData: FormData) {
  const session = await getSession();
  if (!session || (session.role !== "ops" && session.role !== "tech")) {
    redirect("/login");
  }
  const id = String(formData.get("id") || "");
  const technicianId = String(formData.get("technicianId") || "");
  const status = String(formData.get("status") || "dispatched") as JobStatus;
  const tech = technicianId ? getTechnician(technicianId) : undefined;
  const job = updateJob(id, {
    technicianId: tech?.id,
    technicianName: tech?.name,
    status,
  });
  if (job) {
    const audience = [
      { channel: "email" as const, to: job.customerEmail, name: job.customerName },
      { channel: "email" as const, to: "ops@clearwayjunk.com", name: "Clearway dispatch" },
    ];
    if (tech) audience.push({ channel: "email", to: tech.email, name: tech.name });
    if (job.customerPhone) audience.push({ channel: "sms", to: job.customerPhone, name: job.customerName });
    await notifyJobChange(job, audience);
  }
  revalidatePath("/ops");
  redirect("/ops/dispatch");
}

export async function sendReviewRequestAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "ops") redirect("/login");
  const id = String(formData.get("id") || "");
  const channel = String(formData.get("channel") || "email") as NotifyChannel;
  const job = getJob(id);
  if (!job) redirect("/ops/reviews");
  const subject = "How did Clearway do on your junk haul?";
  const body = `Hi ${job.customerName},\n\nYour ${job.serviceName} visit in ${job.city} is complete, and we would be grateful for a short review. Tell us what felt careful, what we could improve, and whether you would call us again.\n\nThank you for trusting a Hayward crew.\nClearway Junk Removal\n(510) 555-0192`;
  if (channel === "email") {
    await sendEmail({ to: job.customerEmail, subject, body, jobId: job.id });
  } else {
    await sendSms({
      to: job.customerPhone,
      body: `${subject} Reply or visit your Clearway account. Job ${job.id}.`,
      jobId: job.id,
    });
  }
  updateJob(id, { reviewRequestedAt: new Date().toISOString() });
  revalidatePath("/ops/reviews");
  redirect("/ops/reviews?sent=1");
}

export async function contactAction(formData: FormData) {
  const name = String(formData.get("name") || "Neighbor");
  const email = String(formData.get("email") || "");
  const message = String(formData.get("message") || "");
  await notifyPeople({
    channel: "email",
    to: "hello@clearwayjunk.com",
    subject: `Website note from ${name}`,
    body: `${message}\n\nFrom ${name} <${email}> ${formData.get("phone") || ""}`,
  });
  if (email) {
    await sendEmail({
      to: email,
      subject: "We received your note at Clearway",
      body: `Hi ${name},\n\nThank you for writing. A dispatcher in Hayward will reply during shop hours. If this is a same-day haul, call (510) 555-0192.\n\nGlad you reached out.`,
    });
  }
  redirect("/contact?sent=1");
}

export async function createOpsJobAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "ops") redirect("/login");
  const service = getService(String(formData.get("service") || "household-junk-removal"));
  const cityName = String(formData.get("city") || "Hayward");
  const location = {
    city: cityName,
    zip: String(formData.get("zip") || "94541"),
    label: cityName,
  };
  const nearest = suggestTechnician(location);
  const techId = String(formData.get("technicianId") || nearest?.tech.id || "");
  const tech = techId ? getTechnician(techId) : nearest?.tech;
  createJob({
    customerId: "ops-created",
    customerName: String(formData.get("name") || ""),
    customerEmail: String(formData.get("email") || ""),
    customerPhone: String(formData.get("phone") || ""),
    serviceSlug: service?.slug || "household-junk-removal",
    serviceName: service?.name || "Household junk removal",
    city: cityName,
    address: String(formData.get("address") || ""),
    zip: location.zip,
    notes: String(formData.get("notes") || ""),
    size: String(formData.get("size") || "truck-half") as JobSize,
    scheduledDate: String(formData.get("date") || ""),
    scheduledWindow: String(formData.get("window") || "9:00 a.m. – 12:00 p.m."),
    technicianId: tech?.id,
    technicianName: tech?.name,
    status: tech ? "dispatched" : "confirmed",
  });
  revalidatePath("/ops");
  redirect("/ops/jobs");
}

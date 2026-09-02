import { NextResponse } from "next/server";
import { createJob, listJobs } from "@/lib/store";
import { getService } from "@/lib/services";
import { findCityByName } from "@/lib/cities";
import { suggestTechnician } from "@/lib/location";
import { notifyJobChange } from "@/lib/notify";
import type { JobSize } from "@/lib/types";

export async function GET() {
  return NextResponse.json({ jobs: listJobs().map((job) => ({ id: job.id, status: job.status, city: job.city })) });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const service = getService(String(body.service || "household-junk-removal"));
  if (!service) {
    return NextResponse.json({ error: "Unknown service" }, { status: 400 });
  }
  const cityName = String(body.city || "Hayward");
  const city = findCityByName(cityName);
  const location = {
    city: city?.name || cityName,
    zip: String(body.zip || city?.zip || "94541"),
    label: city ? `${city.name}, ${city.county} County` : cityName,
  };
  const nearest = suggestTechnician(location);
  const job = createJob({
    customerId: String(body.customerId || "guest"),
    customerName: String(body.name || "Guest customer"),
    customerEmail: String(body.email || ""),
    customerPhone: String(body.phone || ""),
    serviceSlug: service.slug,
    serviceName: service.name,
    city: location.city,
    address: String(body.address || ""),
    zip: location.zip,
    notes: String(body.notes || ""),
    size: (body.size || "truck-half") as JobSize,
    scheduledDate: String(body.date || new Date().toISOString().slice(0, 10)),
    scheduledWindow: String(body.window || "10:00 a.m. – 12:00 p.m."),
    technicianId: nearest?.tech.id,
    technicianName: nearest?.tech.name,
    status: nearest ? "confirmed" : "requested",
  });
  await notifyJobChange(job, [
    { channel: "email", to: job.customerEmail || "ops@clearwayjunk.com", name: job.customerName },
    { channel: "email", to: "ops@clearwayjunk.com", name: "Clearway dispatch" },
  ]);
  return NextResponse.json({ job });
}

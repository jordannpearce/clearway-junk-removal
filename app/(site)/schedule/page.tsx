import { ScheduleForm } from "@/components/schedule-form";
import { getSession } from "@/lib/auth";
import { cities } from "@/lib/cities";
import { getSavedLocation } from "@/lib/location-cookie";
import { pageMeta } from "@/lib/seo";
import { services } from "@/lib/services";
import { jobSizes } from "@/lib/store";

export const metadata = pageMeta({
  title: "Schedule Junk Removal in Hayward and the East Bay",
  description:
    "Book a Clearway junk hauling appointment. Set your city, choose a service, and we assign the closest technician in Alameda or Contra Costa County.",
  path: "/schedule",
});

const windows = [
  "8:00 a.m. – 10:00 a.m.",
  "10:00 a.m. – 12:00 p.m.",
  "12:00 p.m. – 3:00 p.m.",
  "3:00 p.m. – 6:00 p.m.",
];

export default async function SchedulePage({
  searchParams,
}: PageProps<"/schedule">) {
  const query = await searchParams;
  const location = await getSavedLocation();
  const session = await getSession();
  const defaultCity = typeof query.city === "string" ? query.city : location?.city || "Hayward";
  const defaultService = typeof query.service === "string" ? query.service : "household-junk-removal";
  const error = typeof query.error === "string" ? query.error : "";

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-heading text-4xl sm:text-5xl">Schedule a junk haul</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Tell us the city, the service, and the pile. If you are signed in, the job lands in your account immediately. If you are not, we still create the ticket and email dispatch. The closest technician is suggested automatically from your location.
      </p>
      {error ? <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
      <ScheduleForm
        services={services.map((service) => ({ value: service.slug, label: service.name }))}
        cities={cities.map((city) => ({ value: city.name, label: city.name }))}
        sizes={jobSizes.map((size) => ({ value: size.value, label: `${size.label} — ${size.hint}` }))}
        windows={windows}
        defaults={{
          service: defaultService,
          city: defaultCity,
          zip: location?.zip || "94541",
          name: session?.name || "",
          email: session?.email || "",
        }}
      />
    </div>
  );
}

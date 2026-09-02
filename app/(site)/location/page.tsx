import { LocationForm } from "@/components/location-form";
import { NearestTech } from "@/components/nearest-tech";
import { cities } from "@/lib/cities";
import { getSavedLocation } from "@/lib/location-cookie";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Set Your Location for the Closest Junk Hauling Technician",
  description:
    "Choose your Alameda County or Contra Costa County city so Clearway can match the closest Hayward-network technician for junk hauling and debris removal.",
  path: "/location",
});

export default async function LocationPage() {
  const location = await getSavedLocation();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="max-w-3xl font-heading text-4xl sm:text-5xl">Set your location so we can send the closest technician</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        Distance still matters in the East Bay. A crew finishing in San Leandro should not drive past your Hayward driveway because a computer thought Concord was close enough. Choose your city from the full service list. We rank active technicians by miles, then dispatch can still honor a better open window.
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-heading text-2xl">Your city or community</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {cities.length} places across Alameda and Contra Costa counties are on this list, including every incorporated city.
          </p>
          <div className="mt-5">
            <LocationForm location={location} />
          </div>
        </div>
        <NearestTech location={location} />
      </div>
    </div>
  );
}

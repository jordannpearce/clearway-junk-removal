import { scheduleJobAction } from "@/lib/actions";
import { cities } from "@/lib/cities";
import { getSavedLocation } from "@/lib/location-cookie";
import { pageMeta } from "@/lib/seo";
import { services } from "@/lib/services";
import { jobSizes } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const metadata = pageMeta({
  title: "Schedule Junk Removal in Hayward and the East Bay",
  description:
    "Book a Clearway junk hauling appointment. Set your city, choose a service, and we assign the closest technician in Alameda or Contra Costa County.",
  path: "/schedule",
});

export default async function SchedulePage({
  searchParams,
}: PageProps<"/schedule">) {
  const query = await searchParams;
  const location = await getSavedLocation();
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
      <form action={scheduleJobAction} className="mt-8 grid gap-4 rounded-3xl border border-border bg-card p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="service">Service</Label>
          <select id="service" name="service" defaultValue={defaultService} className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm">
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="date">Preferred date</Label>
          <Input id="date" name="date" type="date" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="window">Arrival window</Label>
          <select id="window" name="window" className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm">
            <option>8:00 a.m. – 10:00 a.m.</option>
            <option>10:00 a.m. – 12:00 p.m.</option>
            <option>12:00 p.m. – 3:00 p.m.</option>
            <option>3:00 p.m. – 6:00 p.m.</option>
          </select>
        </div>
        <div>
          <Label htmlFor="size">Estimated volume</Label>
          <select id="size" name="size" className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm">
            {jobSizes.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label} — {size.hint}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <select id="city" name="city" defaultValue={defaultCity} className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm">
            {cities.map((city) => (
              <option key={city.slug} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="zip">ZIP</Label>
          <Input id="zip" name="zip" defaultValue={location?.zip || "94541"} className="mt-1.5" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="address">Service address</Label>
          <Input id="address" name="address" required className="mt-1.5" placeholder="Street number and name" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="notes">What should we haul, and what must stay?</Label>
          <Textarea id="notes" name="notes" className="mt-1.5 min-h-28" placeholder="Garage stall, keep the bikes, take the sofa and boxes..." />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit">Request this appointment</Button>
        </div>
      </form>
    </div>
  );
}

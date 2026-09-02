import { FormSubmit } from "@/components/form-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { scheduleJobAction } from "@/lib/actions";
import type { JobSize } from "@/lib/types";

type Option = { value: string; label: string };

function upcomingDate(daysAhead = 3) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().slice(0, 10);
}

export function ScheduleForm({
  services,
  cities,
  sizes,
  windows,
  defaults,
}: {
  services: Option[];
  cities: Option[];
  sizes: { value: JobSize; label: string }[];
  windows: string[];
  defaults: {
    service?: string;
    name?: string;
    email?: string;
    phone?: string;
    date?: string;
    window?: string;
    size?: JobSize;
    city?: string;
    zip?: string;
    address?: string;
    notes?: string;
  };
}) {
  return (
    <form action={scheduleJobAction} className="mt-8 grid gap-4 rounded-3xl border border-border bg-card p-6 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Label htmlFor="service">Service</Label>
        <select
          id="service"
          name="service"
          defaultValue={defaults.service || services[0]?.value}
          className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
        >
          {services.map((service) => (
            <option key={service.value} value={service.value}>
              {service.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required autoComplete="name" defaultValue={defaults.name} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" defaultValue={defaults.email} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" required autoComplete="tel" defaultValue={defaults.phone} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="date">Preferred date</Label>
        <Input id="date" name="date" type="date" required defaultValue={defaults.date || upcomingDate()} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="window">Arrival window</Label>
        <select
          id="window"
          name="window"
          defaultValue={defaults.window || windows[1] || windows[0]}
          className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
        >
          {windows.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="size">Estimated volume</Label>
        <select
          id="size"
          name="size"
          defaultValue={defaults.size || "truck-half"}
          className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
        >
          {sizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <select
          id="city"
          name="city"
          defaultValue={defaults.city || "Hayward"}
          className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
        >
          {cities.map((city) => (
            <option key={city.value} value={city.value}>
              {city.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="zip">ZIP</Label>
        <Input id="zip" name="zip" defaultValue={defaults.zip || "94541"} className="mt-1.5" />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="address">Service address</Label>
        <Input
          id="address"
          name="address"
          required
          autoComplete="street-address"
          placeholder="Street number and name"
          defaultValue={defaults.address}
          className="mt-1.5"
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="notes">What should we haul, and what must stay?</Label>
        <Textarea
          id="notes"
          name="notes"
          className="mt-1.5 min-h-28"
          placeholder="Garage stall, keep the bikes, take the sofa and boxes..."
          defaultValue={defaults.notes}
        />
      </div>
      <div className="sm:col-span-2">
        <FormSubmit>Request this appointment</FormSubmit>
      </div>
    </form>
  );
}

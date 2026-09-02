import { FormSubmit } from "@/components/form-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveLocationAction } from "@/lib/actions";
import { cities } from "@/lib/cities";
import type { SavedLocation } from "@/lib/types";

export function LocationForm({ location }: { location?: SavedLocation | null }) {
  return (
    <form action={saveLocationAction} className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Label htmlFor="city">City or community</Label>
        <select
          id="city"
          name="city"
          defaultValue={location?.city || "Hayward"}
          className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
        >
          {cities.map((city) => (
            <option key={city.slug} value={city.name}>
              {city.name} · {city.county} County
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="zip">ZIP code</Label>
        <Input id="zip" name="zip" defaultValue={location?.zip || "94541"} className="mt-1.5" />
      </div>
      <div className="flex items-end">
        <FormSubmit className="w-full">Save location and find a tech</FormSubmit>
      </div>
    </form>
  );
}

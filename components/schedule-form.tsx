"use client";

import { useEffect, useMemo, useState } from "react";
import { FormSubmit } from "@/components/form-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { scheduleJobAction } from "@/lib/actions";
import type { JobSize } from "@/lib/types";

type Option = { value: string; label: string };

type Draft = {
  service: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  window: string;
  size: JobSize;
  city: string;
  zip: string;
  address: string;
  notes: string;
};

const draftKey = "clearway-schedule-draft";

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
  defaults: Partial<Draft>;
}) {
  const initial = useMemo<Draft>(
    () => ({
      service: defaults.service || services[0]?.value || "household-junk-removal",
      name: defaults.name || "",
      email: defaults.email || "",
      phone: defaults.phone || "",
      date: defaults.date || upcomingDate(),
      window: defaults.window || windows[1] || windows[0],
      size: defaults.size || "truck-half",
      city: defaults.city || "Hayward",
      zip: defaults.zip || "94541",
      address: defaults.address || "",
      notes: defaults.notes || "",
    }),
    [defaults, services, windows],
  );
  const [draft, setDraft] = useState<Draft>(initial);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(draftKey);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<Draft>;
      setDraft((current) => {
        const next = { ...current };
        for (const [key, value] of Object.entries(saved) as [keyof Draft, Draft[keyof Draft]][]) {
          if (typeof value === "string" && value.trim()) {
            next[key] = value as never;
          }
        }
        return next;
      });
    } catch {
      /* ignore a bad draft */
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(draftKey, JSON.stringify(draft));
  }, [draft]);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <form
      action={async (formData) => {
        sessionStorage.removeItem(draftKey);
        await scheduleJobAction(formData);
      }}
      className="mt-8 grid gap-4 rounded-3xl border border-border bg-card p-6 sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <Label htmlFor="service">Service</Label>
        <select
          id="service"
          name="service"
          value={draft.service}
          onChange={(event) => update("service", event.target.value)}
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
        <Input id="name" name="name" required autoComplete="name" value={draft.name} onChange={(event) => update("name", event.target.value)} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" value={draft.email} onChange={(event) => update("email", event.target.value)} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" required autoComplete="tel" value={draft.phone} onChange={(event) => update("phone", event.target.value)} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="date">Preferred date</Label>
        <Input id="date" name="date" type="date" required value={draft.date} onChange={(event) => update("date", event.target.value)} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="window">Arrival window</Label>
        <select
          id="window"
          name="window"
          value={draft.window}
          onChange={(event) => update("window", event.target.value)}
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
          value={draft.size}
          onChange={(event) => update("size", event.target.value as JobSize)}
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
          value={draft.city}
          onChange={(event) => update("city", event.target.value)}
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
        <Input id="zip" name="zip" value={draft.zip} onChange={(event) => update("zip", event.target.value)} className="mt-1.5" />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="address">Service address</Label>
        <Input
          id="address"
          name="address"
          required
          autoComplete="street-address"
          placeholder="Street number and name"
          value={draft.address}
          onChange={(event) => update("address", event.target.value)}
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
          value={draft.notes}
          onChange={(event) => update("notes", event.target.value)}
        />
      </div>
      <div className="sm:col-span-2">
        <FormSubmit>Request this appointment</FormSubmit>
      </div>
    </form>
  );
}

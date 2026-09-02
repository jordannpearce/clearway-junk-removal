import { cities, findCityByName, type City } from "@/lib/cities";
import { listTechnicians } from "@/lib/store";
import type { SavedLocation, Technician } from "@/lib/types";

export function distanceMiles(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function resolveCity(location: SavedLocation | null): City | undefined {
  if (!location) return undefined;
  return findCityByName(location.city) ?? cities.find((city) => city.zip === location.zip);
}

export function closestTechnicians(location: SavedLocation | null, limit = 3) {
  const city = resolveCity(location) ?? cities.find((item) => item.slug === "hayward")!;
  return listTechnicians()
    .filter((tech) => tech.active)
    .map((tech) => ({
      tech,
      miles: Math.round(distanceMiles(city, tech) * 10) / 10,
    }))
    .sort((a, b) => a.miles - b.miles)
    .slice(0, limit);
}

export function suggestTechnician(location: SavedLocation | null): { tech: Technician; miles: number } | null {
  return closestTechnicians(location, 1)[0] ?? null;
}

export function locationLabel(location: SavedLocation | null) {
  if (!location) return "Hayward, CA (default)";
  return location.label || `${location.city}, ${location.zip}`;
}

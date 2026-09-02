import { cookies } from "next/headers";
import type { SavedLocation } from "@/lib/types";

const cookieName = "clearway_location";

export async function getSavedLocation(): Promise<SavedLocation | null> {
  const jar = await cookies();
  const raw = jar.get(cookieName)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SavedLocation;
  } catch {
    return null;
  }
}

export async function setSavedLocation(location: SavedLocation) {
  const jar = await cookies();
  jar.set(cookieName, JSON.stringify(location), {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

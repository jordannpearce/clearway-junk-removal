import { hasDatabase, query } from "@/lib/db";
import {
  createTechnician as createFileTechnician,
  getTechnician as getFileTechnician,
  listTechnicians as listFileTechnicians,
} from "@/lib/store";
import type { Technician } from "@/lib/types";

const seededTechEmails = [
  "tech@clearwayjunk.com",
  "priya@clearwayjunk.com",
  "luis@clearwayjunk.com",
  "nina@clearwayjunk.com",
  "jamal@clearwayjunk.com",
  "elena@clearwayjunk.com",
];

type TechnicianRow = {
  id: string;
  user_id: string | null;
  name: string;
  phone: string;
  email: string;
  home_city: string;
  county: "Alameda" | "Contra Costa";
  lat: number;
  lng: number;
  active: boolean;
  specialties: string[] | null;
};

function mapTechnician(row: TechnicianRow): Technician {
  return {
    id: row.id,
    userId: row.user_id || "",
    name: row.name,
    phone: row.phone,
    email: row.email,
    homeCity: row.home_city,
    county: row.county,
    lat: Number(row.lat),
    lng: Number(row.lng),
    active: row.active,
    specialties: row.specialties || [],
  };
}

async function removeSeededTechnicians() {
  if (!hasDatabase()) return;
  await query(`DELETE FROM technicians WHERE lower(email) = ANY($1)`, [seededTechEmails]);
}

export async function listTechnicians() {
  if (!hasDatabase()) return listFileTechnicians();
  await removeSeededTechnicians();
  const result = await query<TechnicianRow>(
    `SELECT id, user_id, name, phone, email, home_city, county, lat, lng, active, specialties
     FROM technicians
     ORDER BY name`,
  );
  return result.rows.map(mapTechnician);
}

export async function getTechnician(id: string) {
  if (!hasDatabase()) return getFileTechnician(id);
  await removeSeededTechnicians();
  const result = await query<TechnicianRow>(
    `SELECT id, user_id, name, phone, email, home_city, county, lat, lng, active, specialties
     FROM technicians
     WHERE id = $1`,
    [id],
  );
  return result.rows[0] ? mapTechnician(result.rows[0]) : undefined;
}

export async function createTechnician(input: Omit<Technician, "id">) {
  if (!hasDatabase()) return createFileTechnician(input);
  const technician: Technician = { ...input, id: `tech-${crypto.randomUUID().slice(0, 8)}` };
  await query(
    `INSERT INTO technicians (id, user_id, name, phone, email, home_city, county, lat, lng, active, specialties)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
      technician.id,
      technician.userId || null,
      technician.name,
      technician.phone,
      technician.email,
      technician.homeCity,
      technician.county,
      technician.lat,
      technician.lng,
      technician.active,
      technician.specialties,
    ],
  );
  return technician;
}

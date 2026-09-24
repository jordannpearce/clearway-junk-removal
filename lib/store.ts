import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import type {
  Job,
  JobSize,
  JobStatus,
  NotificationLog,
  Technician,
  User,
} from "@/lib/types";

type StoreData = {
  users: User[];
  technicians: Technician[];
  jobs: Job[];
  notifications: NotificationLog[];
};

const storePath = path.join(process.cwd(), "data", "runtime-store.json");

function now() {
  return new Date().toISOString();
}

const SEEDED_TECH_IDS = new Set([
  "tech-andre",
  "tech-priya",
  "tech-luis",
  "tech-nina",
  "tech-jamal",
  "tech-elena",
]);

function seed(): StoreData {
  const users: User[] = [];
  const technicians: Technician[] = [];

  const jobs: Job[] = [
    {
      id: "job-1001",
      customerId: "user-customer",
      customerName: "Jordan Hale",
      customerEmail: "jordan@example.com",
      customerPhone: "(510) 555-0133",
      serviceSlug: "garage-cleanout",
      serviceName: "Garage and storage cleanout",
      city: "Hayward",
      address: "1842 B Street",
      zip: "94541",
      notes: "Two-car garage, keep the tool chest and bikes along the left wall.",
      size: "truck-half",
      scheduledDate: "2026-09-04",
      scheduledWindow: "10:00 a.m. – 12:00 p.m.",
      status: "confirmed",
      createdAt: "2026-09-01T16:12:00.000Z",
      updatedAt: "2026-09-01T16:40:00.000Z",
    },
    {
      id: "job-1002",
      customerId: "user-customer",
      customerName: "Jordan Hale",
      customerEmail: "jordan@example.com",
      customerPhone: "(510) 555-0133",
      serviceSlug: "furniture-removal",
      serviceName: "Furniture removal",
      city: "Castro Valley",
      address: "22155 Redwood Road",
      zip: "94546",
      notes: "Sectional and mattress, second floor, no elevator.",
      size: "truck-quarter",
      scheduledDate: "2026-09-08",
      scheduledWindow: "1:00 p.m. – 3:00 p.m.",
      status: "requested",
      createdAt: "2026-09-02T14:05:00.000Z",
      updatedAt: "2026-09-02T14:05:00.000Z",
    },
    {
      id: "job-1003",
      customerId: "user-customer",
      customerName: "Jordan Hale",
      customerEmail: "jordan@example.com",
      customerPhone: "(510) 555-0133",
      serviceSlug: "construction-debris-removal",
      serviceName: "Construction debris removal",
      city: "Concord",
      address: "1480 Monument Boulevard",
      zip: "94520",
      notes: "Bathroom tear-out pile in the garage. Tile and drywall.",
      size: "truck-three-quarter",
      scheduledDate: "2026-08-28",
      scheduledWindow: "8:00 a.m. – 10:00 a.m.",
      status: "completed",
      createdAt: "2026-08-26T18:22:00.000Z",
      updatedAt: "2026-08-28T17:10:00.000Z",
    },
  ];

  return { users, technicians, jobs, notifications: [] };
}

function stripSeededCrew(data: StoreData) {
  const nextTechs = data.technicians.filter((tech) => !SEEDED_TECH_IDS.has(tech.id));
  let changed = nextTechs.length !== data.technicians.length;
  data.technicians = nextTechs;
  for (const job of data.jobs) {
    if (job.technicianId && SEEDED_TECH_IDS.has(job.technicianId)) {
      delete job.technicianId;
      delete job.technicianName;
      changed = true;
    }
  }
  return changed;
}

function readStore(): StoreData {
  if (!existsSync(storePath)) {
    const initial = seed();
    writeStore(initial);
    return initial;
  }
  const data = JSON.parse(readFileSync(storePath, "utf8")) as StoreData;
  if (stripSeededCrew(data)) writeStore(data);
  return data;
}

function writeStore(data: StoreData) {
  mkdirSync(path.dirname(storePath), { recursive: true });
  writeFileSync(storePath, JSON.stringify(data, null, 2));
}

function mutate<T>(fn: (data: StoreData) => T): T {
  const data = readStore();
  const result = fn(data);
  writeStore(data);
  return result;
}

export function listUsers() {
  return readStore().users;
}

export function getUserByEmail(email: string) {
  return readStore().users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string) {
  return readStore().users.find((user) => user.id === id);
}

export function createUser(input: Omit<User, "id">) {
  return mutate((data) => {
    const user: User = { ...input, id: `user-${crypto.randomUUID()}` };
    data.users.push(user);
    return user;
  });
}

export function listTechnicians() {
  return readStore().technicians;
}

export function getTechnician(id: string) {
  return readStore().technicians.find((tech) => tech.id === id);
}

export function createTechnician(input: Omit<Technician, "id">) {
  return mutate((data) => {
    const technician: Technician = { ...input, id: `tech-${crypto.randomUUID().slice(0, 8)}` };
    data.technicians.unshift(technician);
    return technician;
  });
}

export function listJobs() {
  return readStore().jobs.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function listJobsForCustomer(customerId: string) {
  return listJobs().filter((job) => job.customerId === customerId);
}

export function listJobsForTechnician(technicianId: string) {
  return listJobs().filter((job) => job.technicianId === technicianId);
}

export function getJob(id: string) {
  return readStore().jobs.find((job) => job.id === id);
}

export function createJob(input: Omit<Job, "id" | "createdAt" | "updatedAt" | "status"> & { status?: JobStatus }) {
  return mutate((data) => {
    const timestamp = now();
    const job: Job = {
      ...input,
      id: `job-${crypto.randomUUID().slice(0, 8)}`,
      status: input.status ?? "requested",
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    data.jobs.unshift(job);
    return job;
  });
}

export function updateJob(id: string, patch: Partial<Job>) {
  return mutate((data) => {
    const job = data.jobs.find((item) => item.id === id);
    if (!job) return null;
    Object.assign(job, patch, { updatedAt: now() });
    return job;
  });
}

export function addNotification(entry: Omit<NotificationLog, "id" | "createdAt">) {
  return mutate((data) => {
    const item: NotificationLog = {
      ...entry,
      id: `note-${crypto.randomUUID().slice(0, 8)}`,
      createdAt: now(),
    };
    data.notifications.unshift(item);
    return item;
  });
}

export function listNotifications() {
  return readStore().notifications;
}

export const jobSizes: { value: JobSize; label: string; hint: string }[] = [
  { value: "truck-quarter", label: "Quarter truck", hint: "A few large items or a small room" },
  { value: "truck-half", label: "Half truck", hint: "A packed garage stall or several rooms" },
  { value: "truck-three-quarter", label: "Three-quarter truck", hint: "A full garage or small home sweep" },
  { value: "truck-full", label: "Full truck", hint: "Whole-home or job-site pile" },
];

export const jobStatuses: JobStatus[] = [
  "requested",
  "confirmed",
  "dispatched",
  "en_route",
  "on_site",
  "completed",
  "cancelled",
];

export function statusLabel(status: JobStatus) {
  return {
    requested: "Requested",
    confirmed: "Confirmed",
    dispatched: "Dispatched",
    en_route: "En route",
    on_site: "On site",
    completed: "Completed",
    cancelled: "Cancelled",
  }[status];
}

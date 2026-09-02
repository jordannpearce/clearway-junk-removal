import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { demoAccounts } from "@/lib/site";
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

function seed(): StoreData {
  const users: User[] = [
    {
      id: "user-customer",
      name: demoAccounts.customer.name,
      email: demoAccounts.customer.email,
      phone: "(510) 555-0133",
      password: demoAccounts.customer.password,
      role: "customer",
      city: "Hayward",
      zip: "94541",
    },
    {
      id: "user-ops",
      name: demoAccounts.ops.name,
      email: demoAccounts.ops.email,
      phone: "(510) 555-0192",
      password: demoAccounts.ops.password,
      role: "ops",
      city: "Hayward",
      zip: "94541",
    },
    {
      id: "user-tech-andre",
      name: "Andre Ruiz",
      email: demoAccounts.tech.email,
      phone: "(510) 555-0177",
      password: demoAccounts.tech.password,
      role: "tech",
      city: "Hayward",
      zip: "94541",
    },
    {
      id: "user-tech-priya",
      name: "Priya Shah",
      email: "priya@clearwayjunk.com",
      phone: "(510) 555-0144",
      password: "tech123",
      role: "tech",
      city: "Oakland",
      zip: "94612",
    },
    {
      id: "user-tech-luis",
      name: "Luis Ortega",
      email: "luis@clearwayjunk.com",
      phone: "(510) 555-0161",
      password: "tech123",
      role: "tech",
      city: "Fremont",
      zip: "94536",
    },
    {
      id: "user-tech-nina",
      name: "Nina Brooks",
      email: "nina@clearwayjunk.com",
      phone: "(925) 555-0188",
      password: "tech123",
      role: "tech",
      city: "Concord",
      zip: "94520",
    },
    {
      id: "user-tech-jamal",
      name: "Jamal Whitaker",
      email: "jamal@clearwayjunk.com",
      phone: "(510) 555-0120",
      password: "tech123",
      role: "tech",
      city: "Richmond",
      zip: "94804",
    },
    {
      id: "user-tech-elena",
      name: "Elena Vasquez",
      email: "elena@clearwayjunk.com",
      phone: "(925) 555-0112",
      password: "tech123",
      role: "tech",
      city: "Walnut Creek",
      zip: "94596",
    },
  ];

  const technicians: Technician[] = [
    {
      id: "tech-andre",
      userId: "user-tech-andre",
      name: "Andre Ruiz",
      phone: "(510) 555-0177",
      email: "tech@clearwayjunk.com",
      homeCity: "Hayward",
      county: "Alameda",
      lat: 37.6688,
      lng: -122.081,
      active: true,
      specialties: ["Household junk", "Estate cleanout", "Appliances"],
    },
    {
      id: "tech-priya",
      userId: "user-tech-priya",
      name: "Priya Shah",
      phone: "(510) 555-0144",
      email: "priya@clearwayjunk.com",
      homeCity: "Oakland",
      county: "Alameda",
      lat: 37.8044,
      lng: -122.2712,
      active: true,
      specialties: ["Furniture", "Apartment hauls", "E-waste"],
    },
    {
      id: "tech-luis",
      userId: "user-tech-luis",
      name: "Luis Ortega",
      phone: "(510) 555-0161",
      email: "luis@clearwayjunk.com",
      homeCity: "Fremont",
      county: "Alameda",
      lat: 37.5483,
      lng: -121.9886,
      active: true,
      specialties: ["Construction debris", "Yard waste", "Commercial"],
    },
    {
      id: "tech-nina",
      userId: "user-tech-nina",
      name: "Nina Brooks",
      phone: "(925) 555-0188",
      email: "nina@clearwayjunk.com",
      homeCity: "Concord",
      county: "Contra Costa",
      lat: 37.978,
      lng: -122.0311,
      active: true,
      specialties: ["Household junk", "Garage cleanout", "Landlords"],
    },
    {
      id: "tech-jamal",
      userId: "user-tech-jamal",
      name: "Jamal Whitaker",
      phone: "(510) 555-0120",
      email: "jamal@clearwayjunk.com",
      homeCity: "Richmond",
      county: "Contra Costa",
      lat: 37.9358,
      lng: -122.3477,
      active: true,
      specialties: ["Commercial", "Appliances", "Construction debris"],
    },
    {
      id: "tech-elena",
      userId: "user-tech-elena",
      name: "Elena Vasquez",
      phone: "(925) 555-0112",
      email: "elena@clearwayjunk.com",
      homeCity: "Walnut Creek",
      county: "Contra Costa",
      lat: 37.9101,
      lng: -122.0652,
      active: true,
      specialties: ["Estate cleanout", "Furniture", "HOA properties"],
    },
  ];

  const jobs: Job[] = [
    {
      id: "job-1001",
      customerId: "user-customer",
      customerName: demoAccounts.customer.name,
      customerEmail: demoAccounts.customer.email,
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
      technicianId: "tech-andre",
      technicianName: "Andre Ruiz",
      createdAt: "2026-09-01T16:12:00.000Z",
      updatedAt: "2026-09-01T16:40:00.000Z",
    },
    {
      id: "job-1002",
      customerId: "user-customer",
      customerName: demoAccounts.customer.name,
      customerEmail: demoAccounts.customer.email,
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
      customerName: demoAccounts.customer.name,
      customerEmail: demoAccounts.customer.email,
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
      technicianId: "tech-nina",
      technicianName: "Nina Brooks",
      createdAt: "2026-08-26T18:22:00.000Z",
      updatedAt: "2026-08-28T17:10:00.000Z",
    },
  ];

  return { users, technicians, jobs, notifications: [] };
}

function readStore(): StoreData {
  if (!existsSync(storePath)) {
    const initial = seed();
    writeStore(initial);
    return initial;
  }
  return JSON.parse(readFileSync(storePath, "utf8")) as StoreData;
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

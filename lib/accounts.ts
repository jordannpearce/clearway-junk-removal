import { demoAccounts } from "@/lib/site";
import { hasDatabase, query } from "@/lib/db";
import { createUser as createFileUser, getUserByEmail as getFileUserByEmail, getUserById as getFileUserById } from "@/lib/store";
import type { User, UserRole } from "@/lib/types";

export type Customer = {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  zip?: string;
  notes: string;
  createdAt: string;
};

function mapUser(row: {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  city: string | null;
  zip: string | null;
}): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    password: row.password,
    role: row.role,
    city: row.city || undefined,
    zip: row.zip || undefined,
  };
}

const seedUsers: User[] = [
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
];

async function seedDatabase() {
  const existing = await query<{ count: string }>("SELECT count(*)::text FROM users");
  if (Number(existing.rows[0]?.count || 0) > 0) return;
  for (const user of seedUsers) {
    await query(
      `INSERT INTO users (id, name, email, phone, password, role, city, zip)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (email) DO NOTHING`,
      [user.id, user.name, user.email, user.phone, user.password, user.role, user.city || null, user.zip || null],
    );
    if (user.role === "customer") {
      await query(
        `INSERT INTO customers (id, user_id, name, email, phone, city, zip, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`,
        [`cust-${user.id}`, user.id, user.name, user.email, user.phone, user.city || null, user.zip || null, "Seeded Hayward demo customer"],
      );
    }
  }
}

export async function findUserByEmail(email: string) {
  if (!hasDatabase()) return getFileUserByEmail(email);
  await seedDatabase();
  const result = await query<Parameters<typeof mapUser>[0]>(
    "SELECT id, name, email, phone, password, role, city, zip FROM users WHERE lower(email) = lower($1)",
    [email],
  );
  return result.rows[0] ? mapUser(result.rows[0]) : undefined;
}

export async function findUserById(id: string) {
  if (!hasDatabase()) return getFileUserById(id);
  await seedDatabase();
  const result = await query<Parameters<typeof mapUser>[0]>(
    "SELECT id, name, email, phone, password, role, city, zip FROM users WHERE id = $1",
    [id],
  );
  return result.rows[0] ? mapUser(result.rows[0]) : undefined;
}

export async function createAccount(input: Omit<User, "id">) {
  if (!hasDatabase()) {
    const user = createFileUser(input);
    return user;
  }
  await seedDatabase();
  const user: User = { ...input, id: `user-${crypto.randomUUID()}` };
  await query(
    `INSERT INTO users (id, name, email, phone, password, role, city, zip)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [user.id, user.name, user.email, user.phone, user.password, user.role, user.city || null, user.zip || null],
  );
  if (user.role === "customer") {
    await upsertCustomer({
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      zip: user.zip,
      notes: "",
    });
  }
  return user;
}

export async function upsertCustomer(input: {
  userId?: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  zip?: string;
  notes?: string;
}) {
  if (!hasDatabase()) return null;
  await seedDatabase();
  const existing = await query<{ id: string }>(
    "SELECT id FROM customers WHERE lower(email) = lower($1) LIMIT 1",
    [input.email],
  );
  if (existing.rows[0]) {
    await query(
      `UPDATE customers SET name = $2, phone = $3, city = $4, zip = $5, user_id = COALESCE($6, user_id), notes = COALESCE(NULLIF($7, ''), notes)
       WHERE id = $1`,
      [existing.rows[0].id, input.name, input.phone, input.city || null, input.zip || null, input.userId || null, input.notes || ""],
    );
    return existing.rows[0].id;
  }
  const id = `cust-${crypto.randomUUID().slice(0, 8)}`;
  await query(
    `INSERT INTO customers (id, user_id, name, email, phone, city, zip, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [id, input.userId || null, input.name, input.email, input.phone, input.city || null, input.zip || null, input.notes || ""],
  );
  return id;
}

export async function listCustomers(): Promise<Customer[]> {
  if (!hasDatabase()) {
    const { listUsers } = await import("@/lib/store");
    return listUsers()
      .filter((user) => user.role === "customer")
      .map((user) => ({
        id: `cust-${user.id}`,
        userId: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        zip: user.zip,
        notes: "Local file store — connect Railway Postgres to persist customers.",
        createdAt: new Date().toISOString(),
      }));
  }
  await seedDatabase();
  const result = await query<{
    id: string;
    user_id: string | null;
    name: string;
    email: string;
    phone: string;
    city: string | null;
    zip: string | null;
    notes: string;
    created_at: Date;
  }>("SELECT id, user_id, name, email, phone, city, zip, notes, created_at FROM customers ORDER BY created_at DESC");
  return result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id || undefined,
    name: row.name,
    email: row.email,
    phone: row.phone,
    city: row.city || undefined,
    zip: row.zip || undefined,
    notes: row.notes,
    createdAt: row.created_at.toISOString(),
  }));
}

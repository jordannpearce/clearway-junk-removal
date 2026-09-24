import { hasDatabase, query } from "@/lib/db";
import { createUser as createFileUser, getUserByEmail as getFileUserByEmail, getUserById as getFileUserById, listUsers as listFileUsers } from "@/lib/store";
import type { User, UserRole } from "@/lib/types";

const demoEmails = ["customer@clearwayjunk.com", "ops@clearwayjunk.com", "tech@clearwayjunk.com"];

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

async function removeDemoAccounts() {
  if (!hasDatabase()) return;
  await query(`DELETE FROM customers WHERE lower(email) = ANY($1)`, [demoEmails]);
  await query(`DELETE FROM users WHERE lower(email) = ANY($1)`, [demoEmails]);
}

export async function findUserByEmail(email: string) {
  if (!hasDatabase()) return getFileUserByEmail(email);
  await removeDemoAccounts();
  const result = await query<Parameters<typeof mapUser>[0]>(
    "SELECT id, name, email, phone, password, role, city, zip FROM users WHERE lower(email) = lower($1)",
    [email],
  );
  return result.rows[0] ? mapUser(result.rows[0]) : undefined;
}

export async function findUserById(id: string) {
  if (!hasDatabase()) return getFileUserById(id);
  await removeDemoAccounts();
  const result = await query<Parameters<typeof mapUser>[0]>(
    "SELECT id, name, email, phone, password, role, city, zip FROM users WHERE id = $1",
    [id],
  );
  return result.rows[0] ? mapUser(result.rows[0]) : undefined;
}

export async function listAccounts(): Promise<User[]> {
  if (!hasDatabase()) return listFileUsers();
  await removeDemoAccounts();
  const result = await query<Parameters<typeof mapUser>[0]>(
    "SELECT id, name, email, phone, password, role, city, zip FROM users ORDER BY name",
  );
  return result.rows.map(mapUser);
}

export async function hasStaffAccount() {
  const users = await listAccounts();
  return users.some((user) => user.role === "admin" || user.role === "ops");
}

export async function createAccount(input: Omit<User, "id">) {
  if (!hasDatabase()) {
    return createFileUser(input);
  }
  await removeDemoAccounts();
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
    return listFileUsers()
      .filter((user) => user.role === "customer")
      .map((user) => ({
        id: `cust-${user.id}`,
        userId: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        zip: user.zip,
        notes: "",
        createdAt: new Date().toISOString(),
      }));
  }
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

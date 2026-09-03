import { cookies } from "next/headers";
import { createAccount, findUserByEmail, findUserById } from "@/lib/accounts";
import type { Session, UserRole } from "@/lib/types";

const cookieName = "clearway_session";

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const raw = jar.get(cookieName)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Session;
    const user = await findUserById(parsed.userId);
    if (!user) return null;
    return {
      userId: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    };
  } catch {
    return null;
  }
}

export async function setSession(session: Session) {
  const jar = await cookies();
  jar.set(cookieName, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(cookieName);
}

export async function loginWithPassword(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user || user.password !== password) return null;
  return {
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  } satisfies Session;
}

export async function registerCustomer(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
  city?: string;
  zip?: string;
}) {
  if (await findUserByEmail(input.email)) {
    throw new Error("An account with that email already exists.");
  }
  const user = await createAccount({
    name: input.name,
    email: input.email,
    phone: input.phone,
    password: input.password,
    role: "customer",
    city: input.city,
    zip: input.zip,
  });
  return {
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  } satisfies Session;
}

export function requireRole(session: Session | null, roles: UserRole[]) {
  if (!session || !roles.includes(session.role)) return null;
  return session;
}

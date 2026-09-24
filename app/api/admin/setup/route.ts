import { NextResponse } from "next/server";
import { createAccount, hasStaffAccount } from "@/lib/accounts";
import { site } from "@/lib/site";

export async function POST(request: Request) {
  if (await hasStaffAccount()) {
    return NextResponse.redirect(new URL("/login", request.url), 303);
  }
  const form = await request.formData();
  const password = String(form.get("password") || "").trim();
  const confirm = String(form.get("confirm") || "").trim();
  if (password.length < 8 || password !== confirm) {
    return NextResponse.redirect(new URL("/admin/setup?error=Use%20a%20password%20of%20at%20least%208%20characters%20and%20confirm%20it.", request.url), 303);
  }
  const user = await createAccount({
    name: String(form.get("name") || "Clearway admin"),
    email: String(form.get("email") || site.email),
    phone: String(form.get("phone") || site.phone),
    password,
    role: "admin",
    city: "Hayward",
    zip: "94541",
  });
  const response = NextResponse.redirect(new URL("/admin", request.url), 303);
  response.cookies.set(
    "clearway_session",
    JSON.stringify({ userId: user.id, role: user.role, name: user.name, email: user.email }),
    { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 },
  );
  return response;
}

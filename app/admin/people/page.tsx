import { redirect } from "next/navigation";
import { createPersonAction } from "@/lib/admin-actions";
import { hasStaffAccount, listAccounts, listCustomers } from "@/lib/accounts";
import { cities } from "@/lib/cities";
import { listTechnicians } from "@/lib/technicians";
import { FormSubmit } from "@/components/form-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function AdminPeoplePage({ searchParams }: PageProps<"/admin/people">) {
  if (!(await hasStaffAccount())) redirect("/admin/setup");
  const query = await searchParams;
  const [users, customers] = await Promise.all([listAccounts(), listCustomers()]);
  const techs = await listTechnicians();
  const staff = users.filter((user) => user.role !== "customer");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl">People</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Open customer, technician, dispatch, and admin accounts here. Check send welcome email to deliver a Resend note when the account is created.
      </p>
      {query.created === "1" ? <p className="mt-4 rounded-xl bg-secondary p-3 text-sm">Account created.</p> : null}
      {query.error ? <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{query.error}</p> : null}

      <form action={createPersonAction} className="mt-6 grid gap-4 rounded-3xl border border-border bg-card p-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <h2 className="font-heading text-2xl">Create an account</h2>
        </div>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <select id="role" name="role" className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm">
            <option value="customer">Customer</option>
            <option value="tech">Technician</option>
            <option value="ops">Dispatch</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <Label htmlFor="city">Home city</Label>
          <select id="city" name="city" className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm">
            {cities.map((city) => (
              <option key={city.slug} value={city.name}>{city.name}, {city.county}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="password">Password (required for staff)</Label>
          <Input id="password" name="password" type="password" className="mt-1.5" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="specialties">Technician specialties</Label>
          <Input id="specialties" name="specialties" className="mt-1.5" placeholder="Household junk, Appliances, Estate cleanout" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Input id="notes" name="notes" className="mt-1.5" />
        </div>
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" name="send_welcome" value="1" defaultChecked className="size-4" />
          Send a welcome or account-opening email
        </label>
        <div>
          <FormSubmit>Create person</FormSubmit>
        </div>
      </form>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-heading text-2xl">Staff</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                </tr>
              </thead>
              <tbody>
                {staff.length === 0 ? (
                  <tr><td className="px-4 py-6 text-muted-foreground" colSpan={3}>No staff yet besides you.</td></tr>
                ) : staff.map((user) => (
                  <tr key={user.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3 capitalize">{user.role === "ops" ? "Dispatch" : user.role}</td>
                    <td className="px-4 py-3">{user.email}<br />{user.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <h2 className="font-heading text-2xl">Technicians on the board</h2>
          <div className="mt-4 space-y-2">
            {techs.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border bg-card px-4 py-6 text-sm text-muted-foreground">
                No technicians yet. Create a technician account above and they will appear on the dispatch board.
              </p>
            ) : techs.map((tech) => (
              <div key={tech.id} className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
                <p className="font-medium">{tech.name}</p>
                <p className="text-muted-foreground">{tech.homeCity} · {tech.phone} · {tech.email}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="font-heading text-2xl">Customers</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">City</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr><td className="px-4 py-6 text-muted-foreground" colSpan={3}>No customers yet.</td></tr>
              ) : customers.map((customer) => (
                <tr key={customer.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{customer.name}</td>
                  <td className="px-4 py-3">{customer.email}<br />{customer.phone}</td>
                  <td className="px-4 py-3">{customer.city || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

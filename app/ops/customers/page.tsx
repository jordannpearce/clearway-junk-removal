import { listCustomers } from "@/lib/accounts";
import { hasDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await listCustomers();
  const usingPostgres = hasDatabase();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl">Customers</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        {usingPostgres
          ? "These records live in Railway Postgres. New sign-ups and booked hauls write a customer row automatically."
          : "No DATABASE_URL yet, so this list is the local demo store. After GitHub and Railway are authorized, customers persist in Postgres."}
      </p>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">City</th>
              <th className="px-4 py-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={4}>
                  No customers yet.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-muted-foreground">{customer.id}</p>
                  </td>
                  <td className="px-4 py-3">
                    {customer.email}
                    <br />
                    {customer.phone}
                  </td>
                  <td className="px-4 py-3">
                    {customer.city || "—"} {customer.zip || ""}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{customer.notes || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

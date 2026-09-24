import { redirect } from "next/navigation";
import { hasStaffAccount } from "@/lib/accounts";
import { site } from "@/lib/site";
import { FormSubmit } from "@/components/form-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function AdminSetupPage({ searchParams }: PageProps<"/admin/setup">) {
  if (await hasStaffAccount()) redirect("/login");
  const query = await searchParams;
  const error = typeof query.error === "string" ? query.error : "";

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="font-heading text-4xl">Create the first admin</h1>
      <p className="mt-4 text-muted-foreground">
        There are no staff logins on this site. Make your admin account, then use it to add dispatchers, technicians, and customers.
      </p>
      {error ? <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
      <form action="/api/admin/setup" method="post" className="mt-8 space-y-4 rounded-3xl border border-border bg-card p-6">
        <div>
          <Label htmlFor="name">Your name</Label>
          <Input id="name" name="name" required className="mt-1.5" defaultValue="Jordan Pearce" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="mt-1.5" defaultValue={site.email} />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" required className="mt-1.5" defaultValue={site.phone} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required minLength={8} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" name="confirm" type="password" required minLength={8} className="mt-1.5" />
        </div>
        <FormSubmit>Create admin account</FormSubmit>
      </form>
    </div>
  );
}

import { redirect } from "next/navigation";
import { sendAdminEmailAction } from "@/lib/admin-actions";
import { hasStaffAccount, listCustomers } from "@/lib/accounts";
import { listNotificationLog } from "@/lib/comms";
import { defaultEmailCopy, emailKinds } from "@/lib/email-templates";
import { resendConfigured } from "@/lib/notify";
import type { EmailKind } from "@/lib/types";
import { FormSubmit } from "@/components/form-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function AdminEmailPage({ searchParams }: PageProps<"/admin/email">) {
  if (!(await hasStaffAccount())) redirect("/admin/setup");
  const query = await searchParams;
  const kind = (typeof query.kind === "string" ? query.kind : "notification") as EmailKind;
  const copy = defaultEmailCopy(emailKinds.some((item) => item.value === kind) ? kind : "notification");
  const customers = await listCustomers();
  const recent = (await listNotificationLog(20)).filter((item) => item.channel === "email");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl">Email</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Send marketing, welcome, account-opening, and notification mail through Resend.
        {resendConfigured() ? " The live API key is connected." : " Without RESEND_API_KEY the send is stored in the log so you can still write the copy."}
      </p>
      {query.sent ? <p className="mt-4 rounded-xl bg-secondary p-3 text-sm">Sent {query.sent} email{query.sent === "1" ? "" : "s"}.</p> : null}
      {query.error ? <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{query.error}</p> : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {emailKinds.map((item) => (
          <a
            key={item.value}
            href={`/admin/email?kind=${item.value}`}
            className={`rounded-2xl border p-4 text-sm ${kind === item.value ? "border-primary bg-card" : "border-border bg-card/60"}`}
          >
            <p className="font-medium">{item.label}</p>
            <p className="mt-1 text-muted-foreground">{item.description}</p>
          </a>
        ))}
      </div>

      <form action={sendAdminEmailAction} className="mt-6 space-y-4 rounded-3xl border border-border bg-card p-6">
        <input type="hidden" name="kind" value={kind} />
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="audience">Audience</Label>
            <select id="audience" name="audience" className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm">
              <option value="one">One address</option>
              <option value="customers">All customers</option>
              <option value="technicians">All technicians</option>
              <option value="dispatch">Dispatch and admin</option>
              <option value="staff">All staff</option>
            </select>
          </div>
          <div>
            <Label htmlFor="to">One email</Label>
            <Input id="to" name="to" type="email" className="mt-1.5" list="customer-emails" />
            <datalist id="customer-emails">
              {customers.map((customer) => (
                <option key={customer.id} value={customer.email}>{customer.name}</option>
              ))}
            </datalist>
          </div>
        </div>
        <div>
          <Label htmlFor="name">Recipient name for {"{{name}}"}</Label>
          <Input id="name" name="name" className="mt-1.5" placeholder="Used when sending to one person" />
        </div>
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" name="subject" required className="mt-1.5" defaultValue={copy.subject} />
        </div>
        <div>
          <Label htmlFor="body">Message</Label>
          <Textarea id="body" name="body" required rows={10} className="mt-1.5" defaultValue={copy.body} />
        </div>
        <FormSubmit>Send with Resend</FormSubmit>
      </form>

      <section className="mt-10">
        <h2 className="font-heading text-2xl">Email log</h2>
        <div className="mt-4 space-y-2">
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No email yet.</p>
          ) : recent.map((note) => (
            <article key={note.id} className="rounded-xl border border-border bg-card p-4 text-sm">
              <p className="font-medium">{note.subject} · {note.status} · {note.kind || "email"}</p>
              <p className="text-muted-foreground">To {note.to} · {note.provider}</p>
              <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{note.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

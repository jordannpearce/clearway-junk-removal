import { redirect } from "next/navigation";
import { sendAdminSmsAction } from "@/lib/admin-actions";
import { hasStaffAccount, listCustomers } from "@/lib/accounts";
import { listNotificationLog } from "@/lib/comms";
import { site } from "@/lib/site";
import { signalwireConfig } from "@/lib/signalwire";
import { listTechnicians } from "@/lib/store";
import { FormSubmit } from "@/components/form-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function AdminSmsPage({ searchParams }: PageProps<"/admin/sms">) {
  if (!(await hasStaffAccount())) redirect("/admin/setup");
  const query = await searchParams;
  const wire = await signalwireConfig();
  const [customers, notes] = await Promise.all([listCustomers(), listNotificationLog(40)]);
  const texts = notes.filter((item) => item.channel === "sms");
  const techs = listTechnicians();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl">SMS</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Review requests, schedule reminders, and staff texts go out on SignalWire.
        {wire.configured
          ? ` Sending from ${wire.fromNumber}.`
          : " Add your SignalWire space, project, token, and from-number to send live. Until then every text is logged."}
      </p>
      {query.sent ? <p className="mt-4 rounded-xl bg-secondary p-3 text-sm">Queued {query.sent} text{query.sent === "1" ? "" : "s"}.</p> : null}
      {query.error ? <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{query.error}</p> : null}

      <form action={sendAdminSmsAction} className="mt-6 space-y-4 rounded-3xl border border-border bg-card p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="kind">Kind</Label>
            <select id="kind" name="kind" className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm">
              <option value="notification">Notification</option>
              <option value="review">Review request</option>
              <option value="welcome">Welcome</option>
              <option value="account_opening">Account opening</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
          <div>
            <Label htmlFor="audience">Audience</Label>
            <select id="audience" name="audience" className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm">
              <option value="one">One number</option>
              <option value="customers">Customers</option>
              <option value="technicians">Technicians</option>
              <option value="dispatch">Dispatch and admin</option>
              <option value="staff">All staff</option>
            </select>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="to">Phone</Label>
            <Input id="to" name="to" className="mt-1.5" placeholder={site.phone} />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" className="mt-1.5" />
          </div>
        </div>
        <div>
          <Label htmlFor="body">Message</Label>
          <Textarea
            id="body"
            name="body"
            required
            rows={6}
            className="mt-1.5"
            defaultValue={`Hi {{name}}, this is Clearway Junk Removal. Reply if you need a window changed, or call ${site.phone}.`}
          />
        </div>
        <FormSubmit>Send with SignalWire</FormSubmit>
      </form>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="font-heading text-2xl">Customers</h2>
          <div className="mt-4 space-y-2">
            {customers.length === 0 ? <p className="text-sm text-muted-foreground">No customer numbers yet.</p> : customers.map((customer) => (
              <p key={customer.id} className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
                <span className="font-medium">{customer.name}</span> · {customer.phone}
              </p>
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-heading text-2xl">Technicians</h2>
          <div className="mt-4 space-y-2">
            {techs.map((tech) => (
              <p key={tech.id} className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
                <span className="font-medium">{tech.name}</span> · {tech.phone}
              </p>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="font-heading text-2xl">SMS log</h2>
        <div className="mt-4 space-y-2">
          {texts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No texts yet. Inbound SignalWire messages also land here.</p>
          ) : texts.map((note) => (
            <article key={note.id} className="rounded-xl border border-border bg-card p-4 text-sm">
              <p className="font-medium">{note.kind || "SMS"} · {note.status} · {note.to}</p>
              <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{note.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

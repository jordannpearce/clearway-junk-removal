import { redirect } from "next/navigation";
import { logCallAction, startCallAction } from "@/lib/admin-actions";
import { hasStaffAccount, listCustomers } from "@/lib/accounts";
import { listCalls } from "@/lib/comms";
import { site } from "@/lib/site";
import { signalwireConfig } from "@/lib/signalwire";
import { listTechnicians } from "@/lib/store";
import { FormSubmit } from "@/components/form-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function AdminCallsPage({ searchParams }: PageProps<"/admin/calls">) {
  if (!(await hasStaffAccount())) redirect("/admin/setup");
  const query = await searchParams;
  const [calls, customers] = await Promise.all([listCalls(50), listCustomers()]);
  const techs = listTechnicians();
  const wire = await signalwireConfig();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl">Call tracking</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Log inbound and outbound conversations with customers and technicians. Start a live outbound call through SignalWire when the API is connected.
        {wire.configured ? ` Calls use ${wire.fromNumber}.` : " Without SignalWire keys, start-call still writes a mocked row so the desk can practice the flow."}
      </p>
      {query.logged === "1" ? <p className="mt-4 rounded-xl bg-secondary p-3 text-sm">Call logged.</p> : null}
      {query.started === "1" ? <p className="mt-4 rounded-xl bg-secondary p-3 text-sm">Outbound call started or queued.</p> : null}
      {query.error ? <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{query.error}</p> : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form action={startCallAction} className="space-y-4 rounded-3xl border border-border bg-card p-6">
          <h2 className="font-heading text-2xl">Start a SignalWire call</h2>
          <div>
            <Label htmlFor="start-name">Contact name</Label>
            <Input id="start-name" name="name" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="start-to">Number to dial</Label>
            <Input id="start-to" name="to" required className="mt-1.5" placeholder={site.phone} />
          </div>
          <div>
            <Label htmlFor="start-role">Who they are</Label>
            <select id="start-role" name="contact_role" className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm">
              <option value="customer">Customer</option>
              <option value="tech">Technician</option>
              <option value="ops">Dispatch</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <Label htmlFor="start-purpose">Purpose</Label>
            <Input id="start-purpose" name="purpose" className="mt-1.5" defaultValue="Schedule confirm" />
          </div>
          <FormSubmit>Call now</FormSubmit>
        </form>

        <form action={logCallAction} className="space-y-4 rounded-3xl border border-border bg-card p-6">
          <h2 className="font-heading text-2xl">Log a call</h2>
          <div>
            <Label htmlFor="log-name">Contact name</Label>
            <Input id="log-name" name="name" required className="mt-1.5" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="direction">Direction</Label>
              <select id="direction" name="direction" className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm">
                <option value="outbound">Outbound</option>
                <option value="inbound">Inbound</option>
              </select>
            </div>
            <div>
              <Label htmlFor="contact_role">Who they are</Label>
              <select id="contact_role" name="contact_role" className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm">
                <option value="customer">Customer</option>
                <option value="tech">Technician</option>
                <option value="ops">Dispatch</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="from">From</Label>
              <Input id="from" name="from" className="mt-1.5" defaultValue={site.phone} />
            </div>
            <div>
              <Label htmlFor="to">To</Label>
              <Input id="to" name="to" required className="mt-1.5" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="purpose">Purpose</Label>
              <Input id="purpose" name="purpose" className="mt-1.5" defaultValue="Follow-up" />
            </div>
            <div>
              <Label htmlFor="duration">Minutes</Label>
              <Input id="duration" name="duration" type="number" min="0" className="mt-1.5" placeholder="4" />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" rows={4} className="mt-1.5" />
          </div>
          <FormSubmit variant="outline">Save to the call log</FormSubmit>
        </form>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="font-heading text-2xl">Customer numbers</h2>
          <div className="mt-4 space-y-2 text-sm">
            {customers.map((customer) => (
              <p key={customer.id} className="rounded-xl border border-border bg-card px-4 py-3">
                <span className="font-medium">{customer.name}</span> · {customer.phone}
              </p>
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-heading text-2xl">Technician numbers</h2>
          <div className="mt-4 space-y-2 text-sm">
            {techs.map((tech) => (
              <p key={tech.id} className="rounded-xl border border-border bg-card px-4 py-3">
                <span className="font-medium">{tech.name}</span> · {tech.phone}
              </p>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="font-heading text-2xl">Call log</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Direction</th>
                <th className="px-4 py-3 font-medium">Purpose</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {calls.length === 0 ? (
                <tr><td className="px-4 py-6 text-muted-foreground" colSpan={5}>No calls tracked yet.</td></tr>
              ) : calls.map((call) => (
                <tr key={call.id} className="border-t border-border align-top">
                  <td className="px-4 py-3 text-muted-foreground">{new Date(call.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{call.contactName || "Unknown"}</p>
                    <p className="text-muted-foreground">{call.toNumber}</p>
                    {call.notes ? <p className="mt-1 text-muted-foreground">{call.notes}</p> : null}
                  </td>
                  <td className="px-4 py-3 capitalize">{call.direction}</td>
                  <td className="px-4 py-3">{call.purpose}</td>
                  <td className="px-4 py-3">{call.status} · {call.provider}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

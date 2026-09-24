import Link from "next/link";
import { redirect } from "next/navigation";
import { listAccounts, listCustomers, hasStaffAccount } from "@/lib/accounts";
import { listCalls, listNotificationLog } from "@/lib/comms";
import { resendConfigured } from "@/lib/notify";
import { signalwireConfig } from "@/lib/signalwire";
import { listJobs, listTechnicians } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminHomePage() {
  if (!(await hasStaffAccount())) redirect("/admin/setup");
  const [customers, users, notes, calls] = await Promise.all([
    listCustomers(),
    listAccounts(),
    listNotificationLog(6),
    listCalls(6),
  ]);
  const techs = listTechnicians().filter((item) => item.active);
  const jobs = listJobs().filter((job) => !["completed", "cancelled"].includes(job.status));
  const resend = resendConfigured();
  const wire = signalwireConfig();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl">Admin</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Create people, send Resend email, text and call through SignalWire, and keep a log of every customer and technician touch.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader><CardTitle>Customers</CardTitle></CardHeader>
          <CardContent className="font-heading text-3xl">{customers.length}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Technicians</CardTitle></CardHeader>
          <CardContent className="font-heading text-3xl">{techs.length}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Open jobs</CardTitle></CardHeader>
          <CardContent className="font-heading text-3xl">{jobs.length}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Staff accounts</CardTitle></CardHeader>
          <CardContent className="font-heading text-3xl">{users.filter((user) => user.role !== "customer").length}</CardContent>
        </Card>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Resend email</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {resend
              ? "API key is set. Marketing, welcome, account-opening, and notification mail go out live."
              : "No RESEND_API_KEY yet. Messages are stored in the notification log so you can still write and preview them."}
            <div className="mt-3">
              <Link href="/admin/email" className="text-primary underline">Compose email</Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>SignalWire SMS and calls</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {wire.configured
              ? `Connected to ${wire.space}. Review texts, job SMS, and click-to-call use ${wire.fromNumber}.`
              : "Add SIGNALWIRE_SPACE, SIGNALWIRE_PROJECT_ID, SIGNALWIRE_API_TOKEN, and SIGNALWIRE_FROM_NUMBER. Until then, SMS and calls are logged as mocked sends."}
            <div className="mt-3 flex gap-4">
              <Link href="/admin/sms" className="text-primary underline">Send SMS</Link>
              <Link href="/admin/calls" className="text-primary underline">Call tracking</Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="font-heading text-2xl">Recent notifications</h2>
          <div className="mt-4 space-y-2">
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing sent yet.</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
                  <p className="font-medium">{note.subject} · {note.channel} · {note.status}</p>
                  <p className="text-muted-foreground">To {note.to} via {note.provider}</p>
                </div>
              ))
            )}
          </div>
        </div>
        <div>
          <h2 className="font-heading text-2xl">Recent calls</h2>
          <div className="mt-4 space-y-2">
            {calls.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tracked calls yet.</p>
            ) : (
              calls.map((call) => (
                <div key={call.id} className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
                  <p className="font-medium">{call.contactName || call.toNumber} · {call.direction}</p>
                  <p className="text-muted-foreground">{call.purpose} · {call.status}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

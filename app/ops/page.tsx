import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listJobs, listNotifications, listTechnicians } from "@/lib/store";

export default function OpsHomePage() {
  const jobs = listJobs();
  const open = jobs.filter((job) => !["completed", "cancelled"].includes(job.status));
  const today = new Date().toISOString().slice(0, 10);
  const todayJobs = jobs.filter((job) => job.scheduledDate === today);
  const techs = listTechnicians().filter((tech) => tech.active);
  const notes = listNotifications().slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl">Hayward dispatch overview</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Live board for junk hauling jobs across Alameda and Contra Costa counties. Assign a technician, change status, and the customer plus crew are notified.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Open jobs</CardTitle>
          </CardHeader>
          <CardContent className="font-heading text-3xl">{open.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>On today’s calendar</CardTitle>
          </CardHeader>
          <CardContent className="font-heading text-3xl">{todayJobs.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active technicians</CardTitle>
          </CardHeader>
          <CardContent className="font-heading text-3xl">{techs.length}</CardContent>
        </Card>
      </div>
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl">Needs attention</h2>
          <Link href="/ops/dispatch" className="text-sm text-primary underline">
            Open dispatch
          </Link>
        </div>
        <div className="mt-4 space-y-2">
          {open.slice(0, 6).map((job) => (
            <div key={job.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
              <div>
                <p className="font-medium">{job.serviceName} · {job.city}</p>
                <p className="text-sm text-muted-foreground">
                  {job.scheduledDate} {job.scheduledWindow} · {job.customerName} · {job.technicianName || "unassigned"}
                </p>
              </div>
              <StatusBadge status={job.status} />
            </div>
          ))}
        </div>
      </section>
      <section className="mt-8">
        <h2 className="font-heading text-2xl">Recent notifications</h2>
        <div className="mt-4 space-y-2">
          {notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet. Booking, dispatch, and review requests will appear here. Without API keys they are stored as mocked sends.</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
                <p className="font-medium">{note.subject} · {note.channel} · {note.status}</p>
                <p className="text-muted-foreground">To {note.to} via {note.provider}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

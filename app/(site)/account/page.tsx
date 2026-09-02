import Link from "next/link";
import { redirect } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { FormSubmit } from "@/components/form-submit";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions";
import { getSession } from "@/lib/auth";
import { listJobsForCustomer, listJobsForTechnician, listTechnicians } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AccountPage({ searchParams }: PageProps<"/account">) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "ops") redirect("/ops");

  const query = await searchParams;
  const techRecord = session.role === "tech"
    ? listTechnicians().find((item) => item.userId === session.userId)
    : undefined;
  const jobs =
    session.role === "tech" && techRecord
      ? listJobsForTechnician(techRecord.id)
      : listJobsForCustomer(session.userId);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-accent">{session.role === "tech" ? "Technician jobs" : "Customer jobs"}</p>
          <h1 className="font-heading text-4xl">Hello, {session.name}</h1>
          <p className="mt-2 text-muted-foreground">
            Track status, change details, or cancel before a crew is on the way. The assigned technician and dispatch are notified when you do.
          </p>
        </div>
        <div className="flex gap-2">
          {session.role === "customer" ? (
            <Button asChild>
              <Link href="/schedule">Schedule another haul</Link>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link href="/ops">Open ops board</Link>
            </Button>
          )}
          <form action={logoutAction}>
            <FormSubmit variant="ghost">Sign out</FormSubmit>
          </form>
        </div>
      </div>
      {query.cancelled === "1" ? (
        <p className="mt-6 rounded-xl bg-secondary p-3 text-sm">That job is cancelled. We emailed the team.</p>
      ) : null}
      <div className="mt-8 space-y-3">
        {jobs.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-muted-foreground">
            No jobs yet. {session.role === "tech" ? "Dispatch has not assigned you a ticket." : "Schedule a haul and it will appear here."}
          </p>
        ) : (
          jobs.map((job) => (
            <Link
              key={job.id}
              href={`/account/jobs/${job.id}`}
              className="block rounded-2xl border border-border bg-card p-5 hover:border-primary"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-xl">{job.serviceName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {job.address}, {job.city} {job.zip} · {job.scheduledDate} · {job.scheduledWindow}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {job.technicianName ? `Assigned to ${job.technicianName}` : "Waiting on dispatch"}
                  </p>
                </div>
                <StatusBadge status={job.status} />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

import { notFound, redirect } from "next/navigation";
import { cancelJobAction, updateCustomerJobAction } from "@/lib/actions";
import { getSession } from "@/lib/auth";
import { cities } from "@/lib/cities";
import { getJob, jobSizes } from "@/lib/store";
import { FormSubmit } from "@/components/form-submit";
import { StatusBadge } from "@/components/status-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function CustomerJobPage({
  params,
  searchParams,
}: PageProps<"/account/jobs/[id]">) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { id } = await params;
  const query = await searchParams;
  const job = getJob(id);
  if (!job) notFound();
  if (session.role === "customer" && job.customerId !== session.userId) redirect("/account");

  const locked = job.status === "completed" || job.status === "cancelled" || job.status === "on_site";

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-sm text-muted-foreground">Job {job.id}</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-4xl">{job.serviceName}</h1>
        <StatusBadge status={job.status} />
      </div>
      <p className="mt-3 text-muted-foreground">
        {job.technicianName ? `${job.technicianName} is assigned.` : "Dispatch has not assigned a technician yet."}{" "}
        Changes notify the team by email and, when configured, SMS.
      </p>
      {query.booked === "1" ? (
        <p className="mt-4 rounded-xl bg-secondary p-3 text-sm">Your appointment is on the board. We emailed confirmation.</p>
      ) : null}
      {query.updated === "1" ? (
        <p className="mt-4 rounded-xl bg-secondary p-3 text-sm">Saved. Dispatch and the technician were notified.</p>
      ) : null}

      <form action={updateCustomerJobAction} className="mt-8 grid gap-4 rounded-3xl border border-border bg-card p-6 sm:grid-cols-2">
        <input type="hidden" name="id" value={job.id} />
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" defaultValue={job.scheduledDate} disabled={locked} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="window">Window</Label>
          <Input id="window" name="window" defaultValue={job.scheduledWindow} disabled={locked} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <select id="city" name="city" defaultValue={job.city} disabled={locked} className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm disabled:opacity-60">
            {cities.map((city) => (
              <option key={city.slug} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="zip">ZIP</Label>
          <Input id="zip" name="zip" defaultValue={job.zip} disabled={locked} className="mt-1.5" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" defaultValue={job.address} disabled={locked} className="mt-1.5" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="size">Volume</Label>
          <select id="size" name="size" defaultValue={job.size} disabled={locked} className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm disabled:opacity-60">
            {jobSizes.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" defaultValue={job.notes} disabled={locked} className="mt-1.5 min-h-28" />
        </div>
        {!locked ? (
          <div className="sm:col-span-2">
            <FormSubmit>Save changes and notify the team</FormSubmit>
          </div>
        ) : (
          <p className="sm:col-span-2 text-sm text-muted-foreground">This job can no longer be edited because it is {job.status.replace("_", " ")}.</p>
        )}
      </form>

      {!locked && job.status !== "en_route" ? (
        <form action={cancelJobAction} className="mt-6">
          <input type="hidden" name="id" value={job.id} />
          <FormSubmit variant="destructive">Cancel this job</FormSubmit>
        </form>
      ) : null}
    </div>
  );
}

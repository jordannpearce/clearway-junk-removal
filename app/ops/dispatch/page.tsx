import { dispatchJobAction } from "@/lib/actions";
import { jobStatuses, listJobs, listTechnicians, statusLabel } from "@/lib/store";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function DispatchPage() {
  const jobs = listJobs().filter((job) => job.status !== "cancelled");
  const techs = listTechnicians().filter((tech) => tech.active);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl">Dispatch board</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Assign the nearest technician or override for a better window. Status changes email the customer and the crew through Resend. SMS is logged through your configured phone provider.
      </p>
      <div className="mt-6 space-y-4">
        {jobs.map((job) => (
          <form key={job.id} action={dispatchJobAction} className="rounded-2xl border border-border bg-card p-5">
            <input type="hidden" name="id" value={job.id} />
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-heading text-xl">{job.serviceName}</p>
                <p className="text-sm text-muted-foreground">
                  {job.customerName} · {job.address}, {job.city} {job.zip}
                </p>
                <p className="text-sm text-muted-foreground">
                  {job.scheduledDate} {job.scheduledWindow} · {job.size.replace("truck-", "")} truck
                </p>
                {job.notes ? <p className="mt-2 text-sm">{job.notes}</p> : null}
              </div>
              <StatusBadge status={job.status} />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <div>
                <Label htmlFor={`tech-${job.id}`}>Technician</Label>
                <select
                  id={`tech-${job.id}`}
                  name="technicianId"
                  defaultValue={job.technicianId || ""}
                  className="mt-1.5 h-9 w-full rounded-lg border border-input px-2.5 text-sm"
                >
                  <option value="">Unassigned</option>
                  {techs.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name} · {tech.homeCity} · {tech.county}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor={`status-${job.id}`}>Status</Label>
                <select
                  id={`status-${job.id}`}
                  name="status"
                  defaultValue={job.status}
                  className="mt-1.5 h-9 w-full rounded-lg border border-input px-2.5 text-sm"
                >
                  {jobStatuses.filter((status) => status !== "cancelled").map((status) => (
                    <option key={status} value={status}>
                      {statusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit">Update and notify</Button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}

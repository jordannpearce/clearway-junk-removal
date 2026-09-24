import { listJobsForTechnician } from "@/lib/store";
import { listTechnicians } from "@/lib/technicians";
import { Badge } from "@/components/ui/badge";

export default async function TechniciansPage() {
  const techs = await listTechnicians();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl">Technicians</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Each technician has a home city. When a customer sets a location, we rank these people by miles. Dispatch can still reassign on the board.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {techs.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground md:col-span-2">
            No technicians on the board. An admin can add them from Admin → People.
          </p>
        ) : techs.map((tech) => {
          const assigned = listJobsForTechnician(tech.id).filter((job) => !["completed", "cancelled"].includes(job.status));
          return (
            <article key={tech.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-heading text-2xl">{tech.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {tech.homeCity}, {tech.county} County · {tech.phone}
                  </p>
                </div>
                <Badge variant={tech.active ? "default" : "secondary"}>{tech.active ? "Active" : "Off"}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tech.specialties.map((item) => (
                  <Badge key={item} variant="secondary">{item}</Badge>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {assigned.length} open job{assigned.length === 1 ? "" : "s"} · based in {tech.homeCity}
              </p>
              <ul className="mt-3 space-y-1 text-sm">
                {assigned.map((job) => (
                  <li key={job.id}>{job.scheduledDate} · {job.city} · {job.serviceName}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}

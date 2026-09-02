import { listJobs, listTechnicians } from "@/lib/store";
import { StatusBadge } from "@/components/status-badge";

function addDays(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

export default function OpsSchedulePage() {
  const days = Array.from({ length: 7 }, (_, index) => addDays(index));
  const jobs = listJobs();
  const techs = listTechnicians();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl">Seven-day schedule</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A simple calendar of booked windows so dispatch can see who is already in Hayward, Oakland, Fremont, Concord, Richmond, or Walnut Creek.
      </p>
      <div className="mt-6 grid gap-4 lg:grid-cols-7">
        {days.map((day) => {
          const dayJobs = jobs.filter((job) => job.scheduledDate === day && job.status !== "cancelled");
          return (
            <section key={day} className="rounded-2xl border border-border bg-card p-3">
              <h2 className="text-sm font-medium">{day}</h2>
              <div className="mt-3 space-y-2">
                {dayJobs.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Open</p>
                ) : (
                  dayJobs.map((job) => (
                    <div key={job.id} className="rounded-lg bg-muted/60 p-2 text-xs">
                      <p className="font-medium">{job.scheduledWindow}</p>
                      <p>{job.city}</p>
                      <p className="text-muted-foreground">{job.technicianName || "Unassigned"}</p>
                      <div className="mt-1">
                        <StatusBadge status={job.status} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>
      <section className="mt-8">
        <h2 className="font-heading text-2xl">Technician home bases</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {techs.map((tech) => (
            <span key={tech.id} className="rounded-full border border-border bg-card px-3 py-1">
              {tech.name} · {tech.homeCity}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { createOpsJobAction } from "@/lib/actions";
import { cities } from "@/lib/cities";
import { services } from "@/lib/services";
import { jobSizes, listJobs, listTechnicians } from "@/lib/store";
import { StatusBadge } from "@/components/status-badge";
import { FormSubmit } from "@/components/form-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function OpsJobsPage() {
  const jobs = listJobs();
  const techs = listTechnicians();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl">All jobs</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Create a ticket from the desk, then dispatch it. Customers who booked on the public site appear here automatically.
      </p>
      <form action={createOpsJobAction} className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-5 md:grid-cols-3">
        <div>
          <Label htmlFor="name">Customer</Label>
          <Input id="name" name="name" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="service">Service</Label>
          <select id="service" name="service" className="mt-1.5 h-9 w-full rounded-lg border border-input px-2.5 text-sm">
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>{service.name}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <select id="city" name="city" defaultValue="Hayward" className="mt-1.5 h-9 w-full rounded-lg border border-input px-2.5 text-sm">
            {cities.map((city) => (
              <option key={city.slug} value={city.name}>{city.name}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="zip">ZIP</Label>
          <Input id="zip" name="zip" defaultValue="94541" className="mt-1.5" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="window">Window</Label>
          <Input id="window" name="window" defaultValue="10:00 a.m. – 12:00 p.m." className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="size">Size</Label>
          <select id="size" name="size" className="mt-1.5 h-9 w-full rounded-lg border border-input px-2.5 text-sm">
            {jobSizes.map((size) => (
              <option key={size.value} value={size.value}>{size.label}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="technicianId">Technician</Label>
          <select id="technicianId" name="technicianId" className="mt-1.5 h-9 w-full rounded-lg border border-input px-2.5 text-sm">
            <option value="">Closest available</option>
            {techs.map((tech) => (
              <option key={tech.id} value={tech.id}>{tech.name} · {tech.homeCity}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-3">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" className="mt-1.5" />
        </div>
        <div>
          <FormSubmit>Create and dispatch</FormSubmit>
        </div>
      </form>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Job</th>
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">Where</th>
              <th className="px-4 py-3 font-medium">Tech</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <Link href="/ops/dispatch" className="font-medium hover:underline">{job.serviceName}</Link>
                  <div className="text-muted-foreground">{job.customerName}</div>
                </td>
                <td className="px-4 py-3">{job.scheduledDate}<br />{job.scheduledWindow}</td>
                <td className="px-4 py-3">{job.city}<br />{job.address}</td>
                <td className="px-4 py-3">{job.technicianName || "—"}</td>
                <td className="px-4 py-3"><StatusBadge status={job.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { LinkButton } from "@/components/link-button";
import { getJob } from "@/lib/store";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Appointment requested",
  description: "Your Clearway junk hauling request is on the Hayward dispatch board.",
});

export default async function ThanksPage({ searchParams }: PageProps<"/schedule/thanks">) {
  const query = await searchParams;
  const job = typeof query.job === "string" ? getJob(query.job) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <h1 className="font-heading text-4xl">We have the request</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Thank you. A Hayward dispatcher has the ticket{job ? ` ${job.id}` : ""}.
        {job?.technicianName ? ` ${job.technicianName} is the closest suggested technician for ${job.city}.` : ""}
        {" "}Create an account with the same email if you want to edit, cancel, or watch status.
      </p>
      <div className="mt-6 flex gap-3">
        <LinkButton href="/login">Create or open an account</LinkButton>
        <LinkButton href="/" variant="outline">
          Back home
        </LinkButton>
      </div>
    </div>
  );
}

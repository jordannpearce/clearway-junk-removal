import { sendReviewRequestAction } from "@/lib/actions";
import { recommendedSmsProviders } from "@/lib/notify";
import { listJobs, listNotifications } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default async function ReviewsPage({ searchParams }: PageProps<"/ops/reviews">) {
  const query = await searchParams;
  const completed = listJobs().filter((job) => job.status === "completed");
  const notes = listNotifications().filter((note) => note.subject.toLowerCase().includes("review") || note.body.toLowerCase().includes("review"));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl">Review requests</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Send a thank-you and review ask only after a job is complete. Email uses the Resend API when <code>RESEND_API_KEY</code> is set. SMS uses the phone company you choose below. Without keys, the message is stored in the notification log so you can still demo the flow.
      </p>
      {query.sent === "1" ? (
        <p className="mt-4 rounded-xl bg-secondary p-3 text-sm">Review request logged. Check the notification list for sent or mocked status.</p>
      ) : null}

      <div className="mt-6 space-y-3">
        {completed.length === 0 ? (
          <p className="text-sm text-muted-foreground">No completed jobs yet.</p>
        ) : (
          completed.map((job) => (
            <form key={job.id} action={sendReviewRequestAction} className="grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-[1fr_160px_auto] md:items-end">
              <input type="hidden" name="id" value={job.id} />
              <div>
                <p className="font-medium">{job.customerName} · {job.city}</p>
                <p className="text-sm text-muted-foreground">
                  {job.serviceName} on {job.scheduledDate}
                  {job.reviewRequestedAt ? " · already requested" : ""}
                </p>
              </div>
              <div>
                <Label htmlFor={`channel-${job.id}`}>Channel</Label>
                <select id={`channel-${job.id}`} name="channel" className="mt-1.5 h-9 w-full rounded-lg border border-input px-2.5 text-sm">
                  <option value="email">Email (Resend)</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
              <Button type="submit">Send request</Button>
            </form>
          ))
        )}
      </div>

      <section className="mt-10">
        <h2 className="font-heading text-2xl">Recommended phone companies for SMS reminders</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          For schedule reminders, en-route texts, and review requests in California you will need 10DLC brand registration. These are the providers we recommend for a Hayward junk hauling shop.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {recommendedSmsProviders.map((provider) => (
            <article key={provider.name} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-heading text-xl">{provider.name}</h3>
              <p className="mt-2 text-sm font-medium">{provider.bestFor}</p>
              <p className="mt-2 text-sm text-muted-foreground">{provider.notes}</p>
              <a href={provider.url} className="mt-3 inline-block text-sm text-primary underline" target="_blank" rel="noreferrer">
                Provider site
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl">Notification log</h2>
        <div className="mt-4 space-y-2">
          {notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Review messages will list here after you send one.</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="rounded-xl border border-border bg-card p-3 text-sm">
                <p className="font-medium">{note.createdAt} · {note.channel} · {note.status}</p>
                <p className="text-muted-foreground">To {note.to}</p>
                <p className="mt-1 whitespace-pre-wrap">{note.body}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

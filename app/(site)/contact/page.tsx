import { contactAction } from "@/lib/actions";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { FormSubmit } from "@/components/form-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const metadata = pageMeta({
  title: "Contact Clearway Junk Removal",
  description: "Call, email, or write Clearway Junk Removal in Hayward for junk hauling, debris removal, dispatch questions, and same-day East Bay windows.",
  path: "/contact",
});

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const query = await searchParams;
  const sent = query.sent === "1";

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1fr]">
      <div>
        <h1 className="font-heading text-4xl sm:text-5xl">Talk to a dispatcher in Hayward</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          If the pile is already in the driveway, call {site.phone}. If you can wait for a written reply, send the form. We are glad either way. Same-day questions get a faster answer on the phone because someone is looking at the live board.
        </p>
        <dl className="mt-8 space-y-3 text-sm">
          <div>
            <dt className="font-medium text-foreground">Yard</dt>
            <dd className="text-muted-foreground">{site.address}, {site.city}, {site.stateAbbr} {site.zip}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Hours</dt>
            <dd className="text-muted-foreground">{site.hours}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Email</dt>
            <dd className="text-muted-foreground">{site.email}</dd>
          </div>
        </dl>
      </div>
      <form action={contactAction} className="space-y-4 rounded-3xl border border-border bg-card p-6">
        {sent ? (
          <p className="rounded-xl bg-secondary p-3 text-sm">
            Thank you. We received the note and sent a confirmation if you included an email.
          </p>
        ) : null}
        <div>
          <Label htmlFor="name">Name</Label>
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
          <Label htmlFor="message">How can we help?</Label>
          <Textarea id="message" name="message" required className="mt-1.5 min-h-32" placeholder="Tell us the city, the pile, and whether you need a same-day window." />
        </div>
        <FormSubmit>Send to Hayward dispatch</FormSubmit>
      </form>
    </div>
  );
}

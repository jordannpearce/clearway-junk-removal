import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description: "How Clearway Junk Removal collects, uses, and protects customer and technician information for local junk hauling jobs in Hayward and the East Bay.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-heading text-4xl sm:text-5xl">Privacy policy</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated September 2, 2026</p>
      <div className="mt-8 space-y-6 leading-relaxed text-muted-foreground">
        <p>
          Clearway Junk Removal is a local business based at {site.address}, {site.city}, {site.stateAbbr} {site.zip}. We collect only what we need to schedule a haul, dispatch a technician, send reminders, and keep a job record you can open later.
        </p>
        <h2 className="font-heading text-2xl text-foreground">Information we collect</h2>
        <p>
          When you schedule or create an account we store your name, email, phone, service address, city, ZIP, notes about the pile, and preferred arrival window. If you set a location for the closest technician, we store that city and ZIP in a cookie on your device so the next visit remembers you.
        </p>
        <p>
          When you sign in we keep a session cookie so you do not have to type a password on every click. Team accounts see jobs assigned to them. Operations accounts see the board. Customers see only their own tickets.
        </p>
        <h2 className="font-heading text-2xl text-foreground">How we use it</h2>
        <p>
          We use contact details to confirm jobs, notify you of status changes, dispatch the nearest technician, and send review requests after completed work. Email is sent with Resend when an API key is present. SMS is sent through the phone provider you configure. Without those keys, messages are stored in an on-site notification log so dispatch can still see what would have been sent.
        </p>
        <h2 className="font-heading text-2xl text-foreground">What we do not do</h2>
        <p>
          We do not sell customer lists. We do not buy advertising audiences with your haul photos. We do not embed third-party schema markup on this site. We do not use your estate notes for anything except completing the job you asked for.
        </p>
        <h2 className="font-heading text-2xl text-foreground">Retention and your choices</h2>
        <p>
          Job records stay so you can reopen a past visit and so our insurance and bookkeeping remain honest. You may email {site.email} to correct an account, close it, or ask what we store. You may cancel a job from your account before a crew is en route.
        </p>
        <h2 className="font-heading text-2xl text-foreground">California notes</h2>
        <p>
          If you are a California resident you may request access to or deletion of personal information we hold, subject to records we must keep for tax, safety, or dispute reasons. Write to {site.email} or call {site.phone} and ask for the privacy contact. We will answer as a local company, not as a maze.
        </p>
      </div>
    </article>
  );
}

import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Terms of Service",
  description: "Terms for booking Clearway Junk Removal, cancelling jobs, on-site estimates, and using the customer and dispatch dashboards.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-heading text-4xl sm:text-5xl">Terms of service</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated September 2, 2026</p>
      <div className="mt-8 space-y-6 leading-relaxed text-muted-foreground">
        <p>
          These terms cover junk hauling and debris removal booked with Clearway Junk Removal in Hayward, California, including work in Alameda County and Contra Costa County, and use of the customer and operations dashboards on this website.
        </p>
        <h2 className="font-heading text-2xl text-foreground">Estimates and final price</h2>
        <p>
          Quotes based on photos or descriptions are estimates. The crew confirms volume and weight on site before loading extra material. If the pile is larger, heavier, or harder to reach than described, we pause and tell you. You may approve the new number, reduce the pile, or cancel the extra portion.
        </p>
        <h2 className="font-heading text-2xl text-foreground">Access and safety</h2>
        <p>
          You confirm we may enter the areas listed on the job and that pets are secured. We do not open gas lines, cut live electrical, or handle household hazardous waste beyond what county rules allow on a junk truck. We may decline unsafe carries, including certain pianos, unstable stacks, or biohazard conditions, and we will help you find a better specialist when we can.
        </p>
        <h2 className="font-heading text-2xl text-foreground">Scheduling, edits, and cancellation</h2>
        <p>
          You may edit or cancel from your account while the job is not yet en route. Once a technician is driving, a trip fee may apply. Weather, locked gates, or missing access can move a window. We notify you by email and, when configured, by SMS.
        </p>
        <h2 className="font-heading text-2xl text-foreground">Accounts and dispatch</h2>
        <p>
          Customer accounts are for people booking their own hauls. Operations and technician accounts are for Clearway staff. You agree not to share a staff login. Demo passwords shipped with this local package must be changed before any real customer data is stored.
        </p>
        <h2 className="font-heading text-2xl text-foreground">Liability</h2>
        <p>
          We carry insurance appropriate to junk hauling. If we damage a path we used, tell us the same day so we can make it right. We are not responsible for items that were in the agreed haul pile, or for delays caused by road closures, building security, or a description that did not match the site.
        </p>
        <h2 className="font-heading text-2xl text-foreground">Contact</h2>
        <p>
          Questions about these terms go to {site.email} or {site.phone}. The yard is at {site.address}, {site.city}, {site.stateAbbr} {site.zip}.
        </p>
      </div>
    </article>
  );
}

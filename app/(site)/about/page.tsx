import Image from "next/image";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "About Clearway Junk Removal in Hayward",
  description:
    "Clearway Junk Removal is a Hayward, California junk hauling company founded to give East Bay homes a careful, local crew for debris removal, cleanouts, and same-day haul-away.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-sm font-medium text-accent">Since {site.founded} · Hayward, California</p>
      <h1 className="mt-2 max-w-3xl font-heading text-4xl sm:text-5xl">A junk hauling company that still answers like a neighbor</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        Clearway started because too many East Bay families were choosing between a distant franchise script and a guy with a pickup who might not show. Hayward deserved a third option: a real shop, insured crews, and a dispatcher who already knows that Mission Boulevard and the Fairview hills are not the same drive.
      </p>
      <div className="relative mt-10 aspect-[16/8] overflow-hidden rounded-3xl">
        <Image src="/images/top-crew-hayward.png" alt="Clearway team in Hayward" fill className="object-cover" />
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-heading text-3xl">What we believe about this work</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Junk is rarely junk to the person standing in the doorway. A garage cleanout can be the end of a marriage, the start of a sale, or the first Saturday a veteran finally has help. We train technicians to ask, to wait, and to treat a keep pile as sacred. Positive sentiment is not a slogan. It is the feeling in the room when the heavy part is over and nobody was rushed.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            We also believe the East Bay is specific. Oakland stairs, Livermore barns, Richmond docks, and Walnut Creek HOAs each change the job. That is why this website lists every city in Alameda County and Contra Costa County instead of hiding behind a radius pin.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-3xl">How the company is built</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Dispatch lives in Hayward. Technicians live across both counties so the closest truck is not a fiction. Customers can sign in, watch a job move from requested to completed, and edit or cancel while there is still time. The ops dashboard lets us assign work, send review requests through Resend, and log SMS through the phone company you choose.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            We recycle when the load allows. We donate when a piece still has a next home. We tell the truth when something must go to the landfill. That mix of pride and honesty is the culture we hire for.
          </p>
        </section>
      </div>
      <section className="mt-10 rounded-3xl bg-secondary/60 p-6 sm:p-8">
        <h2 className="font-heading text-3xl">Visit or call the Hayward yard</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          {site.address}, {site.city}, {site.stateAbbr} {site.zip}. Phone {site.phone}. Email {site.email}. Hours {site.hours}. If you are standing in a driveway with a pile and a question, call first. We are glad you did.
        </p>
      </section>
    </article>
  );
}

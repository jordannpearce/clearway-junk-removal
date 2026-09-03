import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, HeartHandshake, Recycle, Shield } from "lucide-react";
import { FaqList } from "@/components/faq-list";
import { LocationForm } from "@/components/location-form";
import { NearestTech } from "@/components/nearest-tech";
import { LinkButton } from "@/components/link-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cities, citiesByCounty } from "@/lib/cities";
import { homeFaqs } from "@/lib/faqs";
import { guides } from "@/lib/guides";
import { getSavedLocation } from "@/lib/location-cookie";
import { pageMeta } from "@/lib/seo";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Junk Hauling and Debris Removal in Hayward, California",
  description:
    "Clearway Junk Removal is a Hayward junk hauling and debris removal company serving every city in Alameda County and Contra Costa County. Same-day crews, careful handling, customer job tracking, and responsible recycling.",
  path: "/",
});

export default async function HomePage() {
  const location = await getSavedLocation();
  const alameda = citiesByCounty("Alameda");
  const contra = citiesByCounty("Contra Costa");

  return (
    <>
      <section className="relative isolate min-h-[78vh] overflow-hidden">
        <Image
          src="/images/hero-junk-truck-hayward.png"
          alt="Clearway junk hauling truck parked on a sunny Hayward, California residential street with furniture neatly loaded in the bed"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-4 py-16 sm:px-6 lg:justify-center">
          <p className="text-sm font-medium tracking-wide text-amber-100">
            Hayward, California · serving {cities.length} East Bay communities
          </p>
          <h1 className="mt-3 max-w-3xl font-heading text-4xl leading-tight text-white sm:text-6xl">
            Junk hauling that leaves a Hayward home feeling lighter the same day
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90">
            Clearway Junk Removal is the local crew neighbors call when a garage, remodel, or whole house needs a careful reset. We haul household junk, construction debris, furniture, appliances, yard waste, and e-waste across Alameda County and Contra Costa County, then recycle or donate what we can.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/schedule" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Schedule a haul
              <ArrowRight />
            </LinkButton>
            <LinkButton href="/location" size="lg" variant="secondary">
              Find the closest technician
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src="/images/top-crew-hayward.png"
              alt="Clearway junk removal crew standing with a forest-green truck in a Hayward driveway"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-accent">A Hayward team, not a national script</p>
            <h2 className="mt-2 font-heading text-3xl sm:text-4xl">The people who show up already know these streets</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Our shop sits on Main Street in Hayward. That is not a marketing line. It is why a Castro Valley garage, an Oakland walk-up, and a Concord remodel pile can share a dispatch board without anyone pretending the East Bay is one flat suburb. You set your location, we match the nearest technician, and the same person who texts you is the person who rings the doorbell.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Customers sign in to check status, edit notes, or cancel before a crew is rolling. Technicians get the change the same minute. Review requests go out by email through Resend, or by SMS if you connect a phone provider. The work stays human. The records stay tidy.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-3xl">
          <h2 className="font-heading text-3xl sm:text-4xl">What junk hauling in the East Bay actually involves</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            People search for junk hauling, debris removal, cleanouts, and haul-away when a space has stopped working. The words differ. The need is the same: something heavy or messy is in the way, and a careful crew should take it without turning the day into a second job. BERT-friendly answers start there, in ordinary language, not in a pile of synonyms.
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-heading text-2xl">How a typical Hayward visit feels</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              You send photos or a room list. We size the truck, confirm a window, and assign the closest open technician. On arrival the crew walks with you, confirms what stays, protects floors, and loads only the agreed pile. Donation-ready furniture is set aside when a partner can take it. Electronics leave as e-waste. The path is swept. You receive a job record you can open later.
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-heading text-2xl">Why local geography changes the quote</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              A ranch house in San Lorenzo is not a hillside carry in Fairview. A loft in Emeryville is not a Delta driveway in Discovery Bay. MUVERA-aligned pages treat those as different retrieval ideas: access, materials, timing, and neighborhood rules. We price stairs, long carries, and heavy remodel waste as themselves, then tell you so the number still feels fair after the truck leaves.
            </p>
          </article>
        </div>
      </section>

      <section className="bg-secondary/60 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl">Services with photos from real East Bay work</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Each service page is written in full sentences so a person, or a search model, can understand the job without guessing. Choose the pile that matches your day.
              </p>
            </div>
            <LinkButton href="/services" variant="outline" className="hidden sm:inline-flex">
              All services
            </LinkButton>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <div className="relative aspect-[4/3]">
                  <Image src={service.image} alt={`${service.name} in the East Bay`} fill className="object-cover transition duration-300 group-hover:scale-[1.03]" />
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-xl">{service.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="font-heading text-3xl sm:text-4xl">Set your location for the closest technician</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Clearway does not pretend every East Bay address is twenty minutes from the same yard. Choose your city. We rank active technicians by distance from that point, then dispatch still honors an open window if a slightly farther crew can arrive sooner. Customers see the match. Ops can override it on the dispatch board.
          </p>
          <div className="mt-6 rounded-2xl border border-border bg-card p-5">
            <LocationForm location={location} />
          </div>
        </div>
        <NearestTech location={location} />
      </section>

      <section className="border-y border-border bg-card py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-heading text-3xl sm:text-4xl">Every city we serve in Alameda and Contra Costa counties</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            Search engines, and neighbors, deserve a specific answer. Clearway lists every incorporated city and the major unincorporated communities in both counties. If you live in Hayward you are next door to the shop. If you live in Knightsen or Kensington, you are still on the map, with travel time priced honestly.
          </p>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="font-heading text-2xl">Alameda County · {alameda.length} places</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {alameda.map((city) => (
                  <Link key={city.slug} href={`/service-areas/${city.slug}`} className="rounded-full border border-border bg-background px-3 py-1 text-sm hover:border-primary hover:text-primary">
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-heading text-2xl">Contra Costa County · {contra.length} places</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {contra.map((city) => (
                  <Link key={city.slug} href={`/service-areas/${city.slug}`} className="rounded-full border border-border bg-background px-3 py-1 text-sm hover:border-primary hover:text-primary">
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-heading text-3xl sm:text-4xl">Why families keep a Hayward hauler on the refrigerator</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: HeartHandshake, title: "Careful first", body: "We would rather pause at a keep pile than rush a load. Estate work taught us that respect is a skill." },
            { icon: Clock3, title: "Same-day when we can", body: "Hayward staffing makes afternoon windows real for nearby cities. Distant Delta jobs get an honest clock." },
            { icon: Recycle, title: "Sort with intent", body: "Metal, e-waste, clean wood, and donation-ready furniture are not treated as one anonymous pile." },
            { icon: Shield, title: "A job you can open later", body: "Customers track status. Teams get notified. Review requests are sent only after completed work." },
          ].map((item) => (
            <Card key={item.title} className="shadow-none">
              <CardHeader>
                <item.icon className="size-6 text-primary" />
                <CardTitle className="font-heading text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">{item.body}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl">What positive sentiment sounds like after a haul</h2>
            <p className="mt-4 leading-relaxed text-primary-foreground/85">
              The reviews we are proudest of do not shout. They say the crew was gentle with a tight hallway, glad to wait while a daughter chose a lamp, or careful with a neighbor’s plants. That tone is how this site is written on purpose. Search systems that read passage meaning, including BERT-style encoders and multi-vector retrieval such as MUVERA, do better with complete, local, helpful language than with a chant of keywords.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Natural questions answered in full sentences",
                "Separate sections for process, materials, geography, and pricing",
                "City pages that mention real neighborhoods, not copied boilerplate",
                "No schema markup, as requested, so the copy itself has to do the work",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <blockquote className="rounded-2xl bg-primary-foreground/10 p-5 text-sm leading-relaxed">
              “They cleared my parents’ Hayward garage and still asked before touching a single labeled box. I felt looked after, not processed.”
              <footer className="mt-3 text-primary-foreground/70">— Estate cleanout, Hayward</footer>
            </blockquote>
            <blockquote className="rounded-2xl bg-primary-foreground/10 p-5 text-sm leading-relaxed">
              “The Concord remodel pile was gone before lunch and the driveway was open for the tile delivery. That is the only review that matters to a contractor.”
              <footer className="mt-3 text-primary-foreground/70">— Construction debris, Concord</footer>
            </blockquote>
            <blockquote className="rounded-2xl bg-primary-foreground/10 p-5 text-sm leading-relaxed">
              “I booked from my phone, watched the status change to en route, and met a technician who already knew the Oakland elevator rule. Quietly excellent.”
              <footer className="mt-3 text-primary-foreground/70">— Furniture removal, Oakland</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-heading text-3xl sm:text-4xl">Guides written for real East Bay decisions</h2>
          <LinkButton href="/guides" variant="ghost">
            All guides
          </LinkButton>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {guides.slice(0, 4).map((guide) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}`} className="rounded-2xl border border-border bg-card p-5 hover:border-primary">
              <p className="text-xs font-medium uppercase tracking-wide text-accent">{guide.category}</p>
              <h3 className="mt-2 font-heading text-2xl">{guide.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{guide.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-secondary/50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-heading text-3xl sm:text-4xl">Questions neighbors actually ask</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Question-and-answer passages help people and language models alike. These are the calls we take in Hayward every week.
          </p>
          <div className="mt-8">
            <FaqList items={homeFaqs} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl bg-primary px-6 py-12 text-primary-foreground sm:px-10">
          <h2 className="font-heading text-3xl sm:text-4xl">Ready when you are, from a single room to a whole house</h2>
          <p className="mt-4 max-w-2xl text-primary-foreground/85">
            Schedule a visit, set your city for the closest tech, or sign in to manage a job you already booked. If the pile is sitting in the driveway tonight, call {site.phone}. A dispatcher in Hayward will answer like a neighbor.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href="/schedule" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Book junk removal
            </LinkButton>
            <LinkButton href="/contact" size="lg" variant="secondary">
              Talk to dispatch
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}

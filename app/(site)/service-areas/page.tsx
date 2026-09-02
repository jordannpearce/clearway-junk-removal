import Link from "next/link";
import { citiesByCounty } from "@/lib/cities";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Junk Removal Service Areas in Alameda and Contra Costa Counties",
  description:
    "Clearway Junk Removal serves every city in Alameda County and Contra Costa County from our Hayward, California yard, including all incorporated cities and major unincorporated communities.",
  path: "/service-areas",
});

export default function ServiceAreasPage() {
  const groups = [
    { county: "Alameda" as const, intro: "From the Oakland hills to the Livermore Valley, Alameda County is our home county. Hayward sits in the middle, which is why same-day windows are common from San Leandro to Union City." },
    { county: "Contra Costa" as const, intro: "Contra Costa County stretches from the Richmond shoreline to the Delta. We staff technicians in Richmond, Concord, and Walnut Creek so a Lafayette estate and an Antioch garage are not waiting on the same truck." },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="max-w-3xl font-heading text-4xl sm:text-5xl">Junk hauling service areas across Alameda County and Contra Costa County</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        If you asked a neighbor where Clearway works, the honest answer is both East Bay counties, city by city. This page lists every incorporated city and the communities people actually type into a search box. Each place has its own page with local housing notes, landmarks, and questions, because a Kensington ridge and a Brentwood tract should not share a copied paragraph.
      </p>
      {groups.map((group) => {
        const list = citiesByCounty(group.county);
        return (
          <section key={group.county} className="mt-12">
            <h2 className="font-heading text-3xl">{group.county} County</h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">{group.intro}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((city) => (
                <Link key={city.slug} href={`/service-areas/${city.slug}`} className="rounded-2xl border border-border bg-card p-4 hover:border-primary">
                  <p className="font-heading text-xl">{city.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{city.type === "cdp" ? "Unincorporated community" : city.type}</p>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{city.character}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

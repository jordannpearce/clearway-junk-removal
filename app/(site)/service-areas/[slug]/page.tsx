import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqList } from "@/components/faq-list";
import { Button } from "@/components/ui/button";
import { cities, getCity } from "@/lib/cities";
import { cityCopy } from "@/lib/city-copy";
import { pageMeta } from "@/lib/seo";
import { services } from "@/lib/services";

export function generateStaticParams() {
  return cities.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: PageProps<"/service-areas/[slug]">) {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) return {};
  return pageMeta({
    title: `Junk Hauling in ${city.name}, CA`,
    description: `Junk hauling and debris removal in ${city.name}, ${city.county} County, from Clearway’s Hayward, California crew. Household junk, construction debris, cleanouts, and same-day windows when a nearby technician is free.`,
    path: `/service-areas/${city.slug}`,
  });
}

export default async function CityPage({ params }: PageProps<"/service-areas/[slug]">) {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();
  const copy = cityCopy(city);

  return (
    <article className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-sm font-medium text-accent">{copy.heroKicker}</p>
      <h1 className="mt-2 max-w-4xl font-heading text-4xl sm:text-5xl">{copy.headline}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">{copy.lede}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild>
          <Link href={`/schedule?city=${encodeURIComponent(city.name)}`}>Schedule in {city.name}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/location`}>Set {city.name} as my location</Link>
        </Button>
      </div>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-heading text-3xl">Why {city.name} residents call Clearway</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{copy.whyHere}</p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-heading text-3xl">How dispatch works from Hayward to {city.name}</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{copy.process}</p>
        </div>
      </section>

      <section className="mt-10 rounded-3xl bg-secondary/60 p-6 sm:p-8">
        <h2 className="font-heading text-3xl">Materials, access, and nearby routes</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">{copy.materials}</p>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          Housing in {city.name} often looks like this: {city.housing} Landmarks such as {city.landmark} help our technicians picture the block before they arrive.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-3xl">Services we bring to {city.name}</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`} className="rounded-2xl border border-border p-4 text-sm hover:border-primary">
              <p className="font-medium">{service.name}</p>
              <p className="mt-1 text-muted-foreground">{service.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-10 max-w-3xl text-lg leading-relaxed">{copy.sentiment}</p>

      <section className="mt-10">
        <h2 className="font-heading text-3xl">Questions about junk removal in {city.name}</h2>
        <div className="mt-6">
          <FaqList items={copy.faqs} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl">Nearby communities we also serve</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {city.nearby.map((name) => {
            const match = cities.find((item) => item.name === name);
            return match ? (
              <Link key={name} href={`/service-areas/${match.slug}`} className="rounded-full border border-border px-3 py-1 text-sm hover:border-primary">
                {name}
              </Link>
            ) : (
              <span key={name} className="rounded-full border border-border px-3 py-1 text-sm">
                {name}
              </span>
            );
          })}
        </div>
      </section>
    </article>
  );
}

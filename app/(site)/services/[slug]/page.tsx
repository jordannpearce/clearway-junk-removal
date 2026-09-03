import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqList } from "@/components/faq-list";
import { LinkButton } from "@/components/link-button";
import { pageMeta } from "@/lib/seo";
import { getService, services } from "@/lib/services";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMeta({
    title: `${service.name} in Hayward and the East Bay`,
    description: service.summary,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const related = services.filter((item) => service.related.includes(item.slug));

  return (
    <article>
      <div className="relative h-[46vh] min-h-80">
        <Image src={service.image} alt={`${service.name} in Hayward and the East Bay`} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/15" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-10 sm:px-6">
          <p className="text-sm text-amber-100">Clearway Junk Removal · Hayward, California</p>
          <h1 className="mt-2 max-w-3xl font-heading text-4xl text-white sm:text-5xl">{service.name}</h1>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">{service.intro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href={`/schedule?service=${service.slug}`}>
            Schedule {service.shortName.toLowerCase()}
          </LinkButton>
          <LinkButton href="/location" variant="outline">
            Match a nearby technician
          </LinkButton>
        </div>

        <section className="mt-12 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-3xl">What we haul</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
              {service.whatWeHaul.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-heading text-3xl">How the visit works</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-muted-foreground">
              {service.process.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-secondary/60 p-6 sm:p-8">
          <h2 className="font-heading text-3xl">A local note from the Hayward yard</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">{service.localNote}</p>
        </section>

        <section className="mt-12">
          <h2 className="font-heading text-3xl">Questions people ask about {service.shortName.toLowerCase()}</h2>
          <div className="mt-6">
            <FaqList items={service.faqs} />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-heading text-3xl">Related services</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.slug} href={`/services/${item.slug}`} className="rounded-2xl border border-border p-4 hover:border-primary">
                <p className="font-heading text-xl">{item.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}

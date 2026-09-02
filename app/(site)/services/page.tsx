import Image from "next/image";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { services } from "@/lib/services";

export const metadata = pageMeta({
  title: "Junk Hauling Services in Hayward and the East Bay",
  description:
    "Household junk removal, construction debris, estate cleanouts, appliances, yard waste, furniture, garage cleanouts, commercial hauling, and e-waste pickup from Hayward across Alameda and Contra Costa counties.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-sm font-medium text-accent">Hayward crews · full-service haul-away</p>
      <h1 className="mt-2 max-w-3xl font-heading text-4xl sm:text-5xl">Junk hauling and debris removal services for every kind of East Bay pile</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        A service page should read like a conversation with a dispatcher who has already stood in these rooms. Each offering below has its own photo, process, and questions because a mattress haul and a remodel pile are not the same job. Choose the closest match. If your day includes more than one, we can still come once and sort on site.
      </p>
      <div className="mt-10 grid gap-8">
        {services.map((service) => (
          <article key={service.slug} className="grid overflow-hidden rounded-3xl border border-border bg-card md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-64">
              <Image src={service.image} alt={`${service.name} by Clearway Junk Removal`} fill className="object-cover" />
            </div>
            <div className="p-6 sm:p-8">
              <h2 className="font-heading text-3xl">
                <Link href={`/services/${service.slug}`} className="hover:text-primary">
                  {service.name}
                </Link>
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{service.intro}</p>
              <Link href={`/services/${service.slug}`} className="mt-5 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline">
                Read the full {service.shortName.toLowerCase()} guide
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

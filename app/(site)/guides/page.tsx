import Link from "next/link";
import { guides } from "@/lib/guides";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "East Bay Junk Removal Guides",
  description:
    "Practical Hayward and East Bay guides on preparing for junk removal, dumpsters versus hauling, estate cleanouts, recycling, pricing, and landlord turnovers.",
  path: "/guides",
});

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="max-w-3xl font-heading text-4xl sm:text-5xl">Guides for a calmer junk haul</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        Long, useful writing helps neighbors and it helps search. Each guide is a self-contained passage about one decision: how to prepare, what we can take, whether a dumpster is kinder, how an estate should be paced, and how pricing actually works in Hayward.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {guides.map((guide) => (
          <Link key={guide.slug} href={`/guides/${guide.slug}`} className="rounded-3xl border border-border bg-card p-6 hover:border-primary">
            <p className="text-xs font-medium uppercase tracking-wide text-accent">{guide.category} · {guide.readMinutes} min</p>
            <h2 className="mt-2 font-heading text-2xl">{guide.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{guide.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { FaqList } from "@/components/faq-list";
import { getGuide, guides } from "@/lib/guides";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return pageMeta({
    title: guide.title,
    description: guide.excerpt,
    path: `/guides/${guide.slug}`,
  });
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-sm font-medium text-accent">{guide.category} · {guide.readMinutes} minute read</p>
      <h1 className="mt-2 font-heading text-4xl sm:text-5xl">{guide.title}</h1>
      <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{guide.excerpt}</p>
      <div className="mt-8 space-y-5">
        {guide.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="leading-relaxed text-foreground/90">
            {paragraph}
          </p>
        ))}
      </div>
      <section className="mt-12">
        <h2 className="font-heading text-3xl">Questions this guide usually raises</h2>
        <div className="mt-6">
          <FaqList items={guide.questions} />
        </div>
      </section>
    </article>
  );
}

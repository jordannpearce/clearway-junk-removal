import { FaqList } from "@/components/faq-list";
import { homeFaqs } from "@/lib/faqs";
import { guides } from "@/lib/guides";
import { pageMeta } from "@/lib/seo";
import { services } from "@/lib/services";

export const metadata = pageMeta({
  title: "Junk Hauling FAQ for Hayward and the East Bay",
  description:
    "Answers about same-day junk hauling, pricing, recycling, job tracking, and service areas across Alameda County and Contra Costa County.",
  path: "/faq",
});

export default function FaqPage() {
  const extra = [
    ...homeFaqs,
    ...services.flatMap((service) => service.faqs),
    ...guides.flatMap((guide) => guide.questions),
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="font-heading text-4xl sm:text-5xl">Frequently asked questions about East Bay junk hauling</h1>
      <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
        These answers are written as complete thoughts because that is how people ask, and how modern search systems read. If your question is about a specific city, open that city’s page. If it is about a material, open the matching service.
      </p>
      <div className="mt-10">
        <FaqList items={extra} />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { site } from "@/lib/site";

export function pageMeta(input: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const title = input.title.includes(site.name) ? input.title : `${input.title} | ${site.name}`;
  return {
    title,
    description: input.description,
    alternates: input.path ? { canonical: input.path } : undefined,
    openGraph: {
      title,
      description: input.description,
      locale: "en_US",
      type: "website",
      siteName: site.name,
    },
  };
}

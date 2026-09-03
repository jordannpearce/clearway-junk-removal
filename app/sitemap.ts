import type { MetadataRoute } from "next";
import { cities } from "@/lib/cities";
import { guides } from "@/lib/guides";
import { publicSiteUrl } from "@/lib/site";
import { services } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = publicSiteUrl();
  const staticRoutes = [
    "",
    "/services",
    "/service-areas",
    "/guides",
    "/about",
    "/faq",
    "/contact",
    "/schedule",
    "/location",
    "/privacy",
    "/terms",
  ];
  return [
    ...staticRoutes.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 })),
    ...services.map((service) => ({ url: `${base}/services/${service.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...cities.map((city) => ({ url: `${base}/service-areas/${city.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...guides.map((guide) => ({ url: `${base}/guides/${guide.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/ops", "/account", "/login"],
    },
    sitemap: "http://127.0.0.1:43123/sitemap.xml",
  };
}

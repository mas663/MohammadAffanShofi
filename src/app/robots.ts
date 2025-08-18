import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://mohammad-affan-shofi.vercel.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "api/og"],
        disallow: ["/api/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

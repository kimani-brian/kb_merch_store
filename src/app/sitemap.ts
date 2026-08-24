import type { MetadataRoute } from "next";
import { getRoutes } from "@/services/routeService";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const routes = await getRoutes();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/checkout`, changeFrequency: "yearly", priority: 0.1 },
  ];

  const odooPages: MetadataRoute.Sitemap = routes
    .filter((r) => r.slug !== "/")
    .map((r) => ({
      url: `${base}${r.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

  return [...staticPages, ...odooPages];
}

import { odooGet } from "@/services/odooServerClient";
import type { OdooRoute } from "@/types/odoo";
import { getCategories } from "@/services/catalogService";
import { slugify } from "@/lib/utils";

/**
 * Fetch the full navigation route tree managed in Odoo.
 * Purged on-demand via the `navigation` cache tag (webhook, Phase 6).
 */
export async function getRoutes(): Promise<OdooRoute[]> {
  const data = await odooGet<{ routes: OdooRoute[] }>("/api/v1/routes", {
    tags: ["navigation"],
  });
  return data?.routes?.filter((r) => r.active) ?? [];
}

/**
 * Resolve an array of path segments against the Odoo route tree.
 * Matches the deepest registered slug first.
 */
export async function resolveRoute(
  segments: string[],
): Promise<OdooRoute | null> {
  const routes = await getRoutes();
  while (segments.length > 0) {
    const candidate = `/${segments.join("/")}`;
    const match = routes.find((r) => r.slug === candidate);
    if (match) return match;

    // Keep older categories reachable when their route predates automatic
    // category-route creation.
    const category = (await getCategories()).find(
      (item) => `/${slugify(item.name)}` === candidate,
    );
    if (category) {
      return {
        id: -category.id,
        name: category.name,
        slug: candidate,
        parent_id: null,
        page_type: "category",
        seo_title: null,
        seo_description: null,
        sequence: 20,
        active: true,
      };
    }
    segments = segments.slice(0, -1);
  }
  return null;
}

import { odooGet } from "@/services/odooClient";
import type { OdooRoute } from "@/types/odoo";

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
    segments = segments.slice(0, -1);
  }
  return null;
}

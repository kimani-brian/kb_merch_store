import { getTenant, tenantCacheTag } from "@/services/tenant.server";

const INTERNAL_BASE =
  process.env.ODOO_INTERNAL_URL ?? "http://localhost:8884";

interface FetchOptions {
  /** Next.js cache tags for on-demand ISR revalidation via webhook. */
  tags?: string[];
  /** Revalidate interval in seconds. Omit when using tag-based purge. */
  revalidate?: number;
}

interface OdooRequestInit extends RequestInit {
  next?: {
    tags?: string[];
    revalidate?: number;
  };
}

export async function odooRequest(
  path: string,
  init: OdooRequestInit = {},
): Promise<Response> {
  const tenant = await getTenant();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  headers.set("X-Odoo-Database", tenant.dbName);
  return fetch(`${INTERNAL_BASE}${path}`, { ...init, headers });
}

export async function odooGet<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T | null> {
  const tenant = await getTenant();
  const { tags, revalidate } = options;

  try {
    const res = await odooRequest(path, {
      next: tags
        ? {
            tags: tags.map((tag) => tenantCacheTag(tenant.id, tag)),
            revalidate,
          }
        : undefined,
    });

    if (!res.ok) {
      console.error(`[odooClient] ${tenant.id}${path} responded ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.error(`[odooClient] ${tenant.id}${path} failed:`, error);
    return null;
  }
}

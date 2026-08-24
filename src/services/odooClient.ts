/**
 * Centralized HTTP client for the Odoo 19 backend.
 *
 * Server Components / Route Handlers call through the compose network
 * (ODOO_INTERNAL_URL). Never import this module from a Client Component —
 * use Server Actions or route handlers instead.
 */

const INTERNAL_BASE =
  process.env.ODOO_INTERNAL_URL ?? "http://localhost:8884";

export const ODOO_PUBLIC_BASE =
  process.env.NEXT_PUBLIC_ODOO_URL ?? "http://localhost:8884";

interface FetchOptions {
  /** Next.js cache tags for on-demand ISR revalidation via webhook. */
  tags?: string[];
  /** Revalidate interval in seconds. Omit when using tag-based purge. */
  revalidate?: number;
}

export async function odooGet<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T | null> {
  const { tags, revalidate } = options;

  try {
    const res = await fetch(`${INTERNAL_BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
        // Multi-database Odoo instances require explicit DB selection.
        "X-Odoo-Database": process.env.ODOO_DB_NAME ?? "admin",
      },
      next: tags ? { tags, revalidate } : undefined,
    });

    if (!res.ok) {
      console.error(`[odooClient] ${path} responded ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.error(`[odooClient] ${path} failed:`, error);
    return null;
  }
}

/**
 * Resolve an Odoo-relative image path to a browser-accessible absolute URL.
 */
export function odooImageUrl(relativePath: string): string {
  return `${ODOO_PUBLIC_BASE}${relativePath}`;
}

/**
 * Centralized HTTP client for the Odoo 19 backend.
 *
 * Server Components / Route Handlers call through the compose network
 * (ODOO_INTERNAL_URL). Never import this module from a Client Component —
 * use Server Actions or route handlers instead.
 */

/**
 * Resolve an Odoo-relative image path to a tenant-aware local proxy URL.
 */
export function odooImageUrl(relativePath: string): string {
  return `/api/odoo-image?path=${encodeURIComponent(relativePath)}`;
}

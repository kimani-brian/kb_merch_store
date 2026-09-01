import crypto from "node:crypto";
import { revalidateTag } from "next/cache";
import { tenantForDatabase, tenantCacheTag } from "@/services/tenant.server";

/**
 * Inbound webhook from the Odoo outbox dispatcher.
 *
 * Security: HMAC-SHA256 over the RAW request body, shared secret via
 * ODOO_WEBHOOK_SECRET (must match Odoo's `odoo_headless_ecommerce.hmac_secret`).
 * Signature arrives in `X-Hmac-Signature: sha256=<hex>`.
 * Event classification arrives in `X-Odoo-Event` (set by the dispatcher).
 */

function verifySignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header || !header.startsWith("sha256=")) return false;
  const received = header.slice("sha256=".length);
  const expected = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const a = Buffer.from(received, "hex");
  const b = Buffer.from(expected, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Map Odoo event types to Next.js cache tags. */
function tagsForEvent(event: string, tenantId: string): string[] {
  if (/^route\./.test(event)) return [tenantCacheTag(tenantId, "navigation")];
  if (/^(product|stock|category)\./.test(event)) return [tenantCacheTag(tenantId, "catalog")];
  return [];
}

export async function POST(request: Request) {
  const database = request.headers.get("x-odoo-database");
  const tenant = database ? await tenantForDatabase(database) : null;
  if (database && !tenant) {
    return Response.json({ error: "unknown tenant database" }, { status: 400 });
  }
  const secret = tenant?.webhookSecret ?? process.env.ODOO_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook] ODOO_WEBHOOK_SECRET not configured — rejecting");
    return Response.json({ error: "webhook not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-hmac-signature");

  if (!signature || !verifySignature(rawBody, signature, secret)) {
    console.warn("[webhook] invalid or missing HMAC signature — rejected");
    return Response.json({ error: "invalid signature" }, { status: 401 });
  }

  const event = request.headers.get("x-odoo-event") ?? "";
  const tenantId = tenant?.id ?? process.env.ODOO_DEFAULT_TENANT ?? "admin";
  const tags = tagsForEvent(event, tenantId);

  for (const tag of tags) {
    revalidateTag(tag);
  }

  // Order lifecycle events carry no cached catalog data.
  console.log(
    `[webhook] event=${event || "unknown"} tags_purged=[${tags.join(", ")}]`,
  );

  return Response.json({ revalidated: true, event, tags });
}

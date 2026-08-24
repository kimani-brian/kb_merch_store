import crypto from "node:crypto";
import { revalidateTag } from "next/cache";

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
function tagsForEvent(event: string): string[] {
  if (/^route\./.test(event)) return ["navigation"];
  if (/^(product|stock|category)\./.test(event)) return ["catalog"];
  return [];
}

export async function POST(request: Request) {
  const secret = process.env.ODOO_WEBHOOK_SECRET;
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
  const tags = tagsForEvent(event);

  for (const tag of tags) {
    revalidateTag(tag);
  }

  // Order lifecycle events carry no cached catalog data.
  console.log(
    `[webhook] event=${event || "unknown"} tags_purged=[${tags.join(", ")}]`,
  );

  return Response.json({ revalidated: true, event, tags });
}

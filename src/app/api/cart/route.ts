import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { emptySummary, type CartLine, type CartSummary } from "@/lib/cart";

const INTERNAL_BASE =
  process.env.ODOO_INTERNAL_URL ?? "http://localhost:8884";
const ODOO_DB = process.env.ODOO_DB_NAME ?? "admin";
const CART_COOKIE = "kb_cart_token";

interface OdooLine {
  id: number;
  product_id: number;
  name: string;
  handle?: string;
  image_url?: string;
  qty: number;
  price_unit: number;
  subtotal: number;
}

interface OdooCart {
  cart_token?: string;
  lines?: OdooLine[];
  subtotal?: number;
  tax?: number;
  total?: number;
}



function toSummary(data: OdooCart | null): CartSummary {
  if (!data?.lines) return emptySummary();
  return {
    lines: data.lines.map((l) => ({
      lineId: l.id,
      productId: l.product_id,
      name: l.name,
      imageUrl: l.image_url ?? "",
      qty: l.qty,
      priceUnit: l.price_unit,
      lineTotal: l.subtotal,
    })),
    itemCount: data.lines.reduce((s, l) => s + l.qty, 0),
    subtotal: data.subtotal ?? 0,
    tax: data.tax ?? 0,
    total: data.total ?? 0,
  };
}

async function odooCart(
  path: string,
  body: Record<string, unknown>,
): Promise<{ res: Response; data: (OdooCart & { error?: string }) | null }> {
  const token = (await cookies()).get(CART_COOKIE)?.value;
  const res = await fetch(`${INTERNAL_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Odoo-Database": ODOO_DB,
      ...(token ? { Cookie: `cart_token=${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => null)) as
    | (OdooCart & { error?: string })
    | null;
  return { res, data };
}

/**
 * GET /api/cart — current cart summary.
 * Returns an empty cart for anonymous visitors (no implicit cart creation);
 * if the stored token is stale, Odoo rotates it and we refresh the cookie.
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CART_COOKIE)?.value;
  if (!token) return NextResponse.json(emptySummary());

  const { res, data } = await odooCart("/api/v1/cart/get", {});
  if (!res.ok || !data) return NextResponse.json(emptySummary());

  if (data.cart_token && data.cart_token !== token) {
    cookieStore.set(CART_COOKIE, data.cart_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return NextResponse.json(toSummary(data));
}

/**
 * POST /api/cart — add a product. Body: { productId, qty? }
 */
export async function POST(request: Request) {
  let body: { productId?: number; qty?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body.productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  const { res, data } = await odooCart("/api/v1/cart/add", {
    product_id: body.productId,
    qty: body.qty ?? 1,
  });
  if (!res.ok || !data?.cart_token || data.error) {
    return NextResponse.json(
      { error: data?.error ?? "cart add failed" },
      { status: res.status === 200 ? 500 : res.status },
    );
  }

  const cookieStore = await cookies();
  const oldToken = cookieStore.get(CART_COOKIE)?.value;
  if (data.cart_token !== oldToken) {
    cookieStore.set(CART_COOKIE, data.cart_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  const summaryRes = await fetch(`${INTERNAL_BASE}/api/v1/cart/get`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Odoo-Database": ODOO_DB,
      Cookie: `cart_token=${data.cart_token}`,
    },
    body: JSON.stringify({}),
  });
  const summary = toSummary(
    (await summaryRes.json().catch(() => null)) as OdooCart | null,
  );
  return NextResponse.json(summary);
}

/**
 * PATCH /api/cart — update a line quantity. Body: { lineId, qty }
 */
export async function PATCH(request: Request) {
  let body: { lineId?: number; qty?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body.lineId || body.qty == null) {
    return NextResponse.json(
      { error: "lineId and qty required" },
      { status: 400 },
    );
  }

  const { res, data } = await odooCart("/api/v1/cart/update", {
    line_id: body.lineId,
    qty: body.qty,
  });
  if (!res.ok || data?.error) {
    return NextResponse.json(
      { error: data?.error ?? "cart update failed" },
      { status: res.status === 200 ? 500 : res.status },
    );
  }

  // Re-read summary with the same session
  const get = await odooCart("/api/v1/cart/get", {});
  return NextResponse.json(toSummary(get.data));
}

/**
 * DELETE /api/cart — remove a line. Body: { lineId }
 */
export async function DELETE(request: Request) {
  let body: { lineId?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body.lineId) {
    return NextResponse.json({ error: "lineId required" }, { status: 400 });
  }

  const { res, data } = await odooCart("/api/v1/cart/remove", {
    line_id: body.lineId,
  });
  if (!res.ok || data?.error) {
    return NextResponse.json(
      { error: data?.error ?? "cart remove failed" },
      { status: res.status === 200 ? 500 : res.status },
    );
  }

  const get = await odooCart("/api/v1/cart/get", {});
  return NextResponse.json(toSummary(get.data));
}

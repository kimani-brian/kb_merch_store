import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const INTERNAL_BASE =
  process.env.ODOO_INTERNAL_URL ?? "http://localhost:8884";
const ODOO_DB = process.env.ODOO_DB_NAME ?? "admin";
const CART_COOKIE = "kb_cart_token";

/**
 * GET /api/payment/stk/status?request_id=N
 * Proxies the Odoo poller. On success it expires the cart session so the
 * storefront starts fresh for the next drop.
 */
export async function GET(request: Request) {
  const requestId = new URL(request.url).searchParams.get("request_id");
  if (!requestId) {
    return NextResponse.json({ error: "request_id required" }, { status: 400 });
  }

  const res = await fetch(
    `${INTERNAL_BASE}/api/v1/payment/mpesa/stk/status?request_id=${encodeURIComponent(requestId)}`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-Odoo-Database": ODOO_DB,
      },
      cache: "no-store",
    },
  );
  const data = await res.json().catch(() => null);
  if (!res.ok || data?.error) {
    return NextResponse.json(
      { error: data?.error ?? "status check failed" },
      { status: res.status === 200 ? 500 : res.status },
    );
  }

  const response = NextResponse.json(data);

  // Payment confirmed → expire the cart session cookie and reset client cart.
  if (data.status === "paid") {
    const cookieStore = await cookies();
    cookieStore.set(CART_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    response.headers.set("X-Cart-Reset", "1");
  }
  return response;
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const INTERNAL_BASE =
  process.env.ODOO_INTERNAL_URL ?? "http://localhost:8884";
const ODOO_DB = process.env.ODOO_DB_NAME ?? "admin";
const CART_COOKIE = "kb_cart_token";

/**
 * POST /api/payment/stk — initiate an M-Pesa STK push.
 * Body: { phone: string }
 */
export async function POST(request: Request) {
  let body: { phone?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body.phone) {
    return NextResponse.json({ error: "phone required" }, { status: 400 });
  }

  const token = (await cookies()).get(CART_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "no active cart" }, { status: 400 });
  }

  const res = await fetch(
    `${INTERNAL_BASE}/api/v1/payment/mpesa/stk/initiate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Odoo-Database": ODOO_DB,
        Cookie: `cart_token=${token}`,
      },
      body: JSON.stringify({ cart_token: token, phone: body.phone }),
    },
  );
  const data = await res.json().catch(() => null);
  if (!res.ok || data?.error) {
    return NextResponse.json(
      { error: data?.error ?? "STK initiation failed" },
      { status: res.status === 200 ? 500 : res.status },
    );
  }
  return NextResponse.json(data);
}

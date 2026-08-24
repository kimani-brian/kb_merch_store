import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const INTERNAL_BASE =
  process.env.ODOO_INTERNAL_URL ?? "http://localhost:8884";
const ODOO_DB = process.env.ODOO_DB_NAME ?? "admin";
const CART_COOKIE = "kb_cart_token";

/**
 * POST /api/checkout — attach customer details to the Odoo draft quotation.
 * Body: { name, email, phone, county?, street? }
 */
export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    phone?: string;
    county?: string;
    street?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body.email || !body.phone || !body.name) {
    return NextResponse.json(
      { error: "name, email and phone are required" },
      { status: 400 },
    );
  }

  const token = (await cookies()).get(CART_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "no active cart" }, { status: 400 });
  }

  const res = await fetch(`${INTERNAL_BASE}/api/v1/checkout/address`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Odoo-Database": ODOO_DB,
      Cookie: `cart_token=${token}`,
    },
    body: JSON.stringify({
      cart_token: token,
      name: body.name,
      email: body.email,
      phone: body.phone,
      city: body.county,
      street: body.street,
    }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || data?.error) {
    return NextResponse.json(
      { error: data?.error ?? "address step failed" },
      { status: res.status === 200 ? 500 : res.status },
    );
  }
  return NextResponse.json(data);
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getTenant, tenantCartCookie } from "@/services/tenant.server";
import { odooRequest } from "@/services/odooServerClient";

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

  const tenant = await getTenant();
  const token = (await cookies()).get(tenantCartCookie(tenant))?.value;
  if (!token) {
    return NextResponse.json({ error: "no active cart" }, { status: 400 });
  }

  const res = await odooRequest("/api/v1/payment/mpesa/stk/initiate", {
      method: "POST",
      headers: { Cookie: `cart_token=${token}` },
      body: JSON.stringify({ cart_token: token, phone: body.phone }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || data?.error) {
    return NextResponse.json(
      { error: data?.error ?? "STK initiation failed" },
      { status: res.status === 200 ? 500 : res.status },
    );
  }
  return NextResponse.json(data);
}

import { NextResponse } from "next/server";
import { odooRequest } from "@/services/odooServerClient";

export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path");
  if (!path || !path.startsWith("/web/image/") || path.includes("..")) {
    return NextResponse.json({ error: "invalid image path" }, { status: 400 });
  }

  const upstream = await odooRequest(path, { cache: "no-store" });
  if (!upstream.ok || !upstream.body) {
    return new NextResponse(null, { status: upstream.status || 404 });
  }

  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  headers.set("cache-control", "public, max-age=300, s-maxage=3600");
  return new NextResponse(upstream.body, { status: upstream.status, headers });
}

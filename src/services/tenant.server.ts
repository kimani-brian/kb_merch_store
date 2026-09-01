import { headers } from "next/headers";

export interface Tenant {
  id: string;
  dbName: string;
  hostname?: string;
  webhookSecret: string;
}

const INTERNAL_BASE =
  process.env.ODOO_INTERNAL_URL ?? "http://localhost:8884";
const CONTROL_DB = process.env.ODOO_CONTROL_DB ?? "admin";
const DEFAULT_DB = process.env.ODOO_DB_NAME ?? "admin";
const DEFAULT_TENANT = process.env.ODOO_DEFAULT_TENANT ?? "admin";

function configuredTenants(): Record<string, Tenant> {
  const fallback: Record<string, Tenant> = {
    [DEFAULT_TENANT]: {
      id: DEFAULT_TENANT,
      dbName: DEFAULT_DB,
      webhookSecret: process.env.ODOO_WEBHOOK_SECRET ?? "",
    },
  };
  const raw = process.env.ODOO_TENANTS_JSON;
  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const tenants: Record<string, Tenant> = {};
    for (const [id, value] of Object.entries(parsed)) {
      if (typeof value === "string") {
        tenants[id] = { id, dbName: value, webhookSecret: "" };
      } else if (value && typeof value === "object") {
        const config = value as Record<string, unknown>;
        if (typeof config.dbName === "string") {
          tenants[id] = {
            id,
            dbName: config.dbName,
            hostname:
              typeof config.hostname === "string" ? config.hostname : undefined,
            webhookSecret:
              typeof config.webhookSecret === "string"
                ? config.webhookSecret
                : "",
          };
        }
      }
    }
    return Object.keys(tenants).length > 0 ? tenants : fallback;
  } catch {
    return fallback;
  }
}

async function registryTenants(): Promise<Record<string, Tenant>> {
  const registryToken = process.env.HEADLESS_REGISTRY_TOKEN;
  if (!registryToken) return {};

  try {
    const response = await fetch(`${INTERNAL_BASE}/api/v1/tenants`, {
      headers: {
        "Content-Type": "application/json",
        "X-Odoo-Database": CONTROL_DB,
        "X-Headless-Registry-Token": registryToken,
      },
      cache: "no-store",
    });
    if (!response.ok) return {};

    const data = (await response.json()) as {
      tenants?: Array<{
        id?: string;
        db_name?: string;
        hostname?: string;
        webhook_secret?: string;
      }>;
    };
    return Object.fromEntries(
      (data.tenants ?? [])
        .filter((item) => item.id && item.db_name)
        .map((item) => [
          item.id as string,
          {
            id: item.id as string,
            dbName: item.db_name as string,
            hostname: item.hostname,
            webhookSecret: item.webhook_secret ?? "",
          },
        ]),
    );
  } catch {
    return {};
  }
}

function hostnameFromHeaders(headersList: Headers): string {
  return (
    headersList.get("x-forwarded-host") ?? headersList.get("host") ?? ""
  )
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
}

export async function tenantForDatabase(dbName: string): Promise<Tenant | null> {
  const tenants = { ...configuredTenants(), ...(await registryTenants()) };
  return Object.values(tenants).find((tenant) => tenant.dbName === dbName) ?? null;
}

export async function getTenant(): Promise<Tenant> {
  const tenants = { ...configuredTenants(), ...(await registryTenants()) };
  const requestHeaders = await headers();
  const hostname = hostnameFromHeaders(requestHeaders);
  const hostMapRaw = process.env.ODOO_TENANT_HOSTS_JSON;

  if (hostMapRaw) {
    try {
      const hostMap = JSON.parse(hostMapRaw) as Record<string, unknown>;
      const mappedId = hostMap[hostname];
      if (typeof mappedId === "string" && tenants[mappedId]) {
        return tenants[mappedId];
      }
    } catch {
      // Fall through to conventional hostname matching.
    }
  }

  const hostTenant = Object.values(tenants).find(
    (tenant) =>
      hostname === tenant.hostname ||
      hostname === tenant.id ||
      hostname.startsWith(`${tenant.id}.`),
  );
  return hostTenant ?? tenants[DEFAULT_TENANT] ?? Object.values(tenants)[0];
}

export function tenantCacheTag(tenantId: string, tag: string): string {
  return `${tenantId}:${tag}`;
}

export function tenantCartCookie(tenant: Tenant): string {
  const safeId = tenant.id.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `kb_cart_token_${safeId}`;
}

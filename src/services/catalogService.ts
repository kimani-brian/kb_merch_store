import { odooGet } from "@/services/odooServerClient";
import type { OdooCategory, OdooProduct } from "@/types/odoo";

interface ProductsResponse {
  products: OdooProduct[];
}

interface CategoriesResponse {
  categories: OdooCategory[];
}

export async function getProducts(options: {
  categoryId?: number;
  limit?: number;
} = {}): Promise<OdooProduct[]> {
  const params = new URLSearchParams();
  if (options.categoryId != null) {
    params.set("category_id", String(options.categoryId));
  }
  if (options.limit != null) {
    params.set("limit", String(options.limit));
  }
  const query = params.toString();
  const data = await odooGet<ProductsResponse>(
    `/api/v1/catalog/products${query ? `?${query}` : ""}`,
    { tags: ["catalog"] },
  );
  return data?.products ?? [];
}

export async function getCategories(): Promise<OdooCategory[]> {
  const data = await odooGet<CategoriesResponse>(
    "/api/v1/catalog/categories",
    { tags: ["catalog"] },
  );
  return data?.categories ?? [];
}

export async function getProduct(
  handle: string,
): Promise<OdooProduct | null> {
  const data = await odooGet<ProductsResponse>(
    `/api/v1/catalog/products?handle=${encodeURIComponent(handle)}`,
    { tags: ["catalog"] },
  );
  return data?.products?.[0] ?? null;
}

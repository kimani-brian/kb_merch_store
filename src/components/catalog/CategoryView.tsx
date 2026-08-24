"use client";

import { useMemo, useState } from "react";
import FilterSortBar, { type SortKey } from "@/components/catalog/FilterSortBar";
import ProductGrid from "@/components/catalog/ProductGrid";
import type { OdooProduct } from "@/types/odoo";

/**
 * Client-side filtering/sorting over a server-fetched product list.
 * (Size filtering becomes variant-aware in Phase 3.)
 */
export default function CategoryView({ products }: { products: OdooProduct[] }) {
  const [activeSize, setActiveSize] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("featured");

  const visible = useMemo(() => {
    let list = [...products];
    switch (sortKey) {
      case "price-asc":
        list.sort((a, b) => a.list_price - b.list_price);
        break;
      case "price-desc":
        list.sort((a, b) => b.list_price - a.list_price);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return list;
  }, [products, sortKey]);

  return (
    <div>
      <FilterSortBar
        activeSize={activeSize}
        onSizeChange={setActiveSize}
        sortKey={sortKey}
        onSortChange={setSortKey}
      />
      <ProductGrid products={visible} />
    </div>
  );
}

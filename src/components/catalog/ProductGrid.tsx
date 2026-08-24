import ProductCard from "@/components/catalog/ProductCard";
import type { OdooProduct } from "@/types/odoo";

export default function ProductGrid({ products }: { products: OdooProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="border-2 border-dashed border-brand-gray-dark p-16 text-center">
        <p className="font-display text-2xl tracking-widest text-neutral-500 uppercase">
          Nothing here yet
        </p>
        <p className="mt-2 font-mono text-xs text-neutral-600">
          THE NEXT DROP HASN&apos;T LANDED. STAY READY.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

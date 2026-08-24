import Image from "next/image";
import Link from "next/link";
import { odooImageUrl } from "@/services/odooClient";
import { formatKES, slugify } from "@/lib/utils";
import type { OdooProduct } from "@/types/odoo";

export default function ProductCard({ product }: { product: OdooProduct }) {
  const soldOut = product.qty_available <= 0;
  const href = `/products/${product.handle}`;

  return (
    <Link
      href={href}
      className="group block border-2 border-brand-gray-dark bg-brand-black transition-colors hover:border-brand-white"
    >
      {/* Image block */}
      <div className="relative aspect-square overflow-hidden bg-brand-gray-dark">
        {product.image_url ? (
          <Image
            src={odooImageUrl(product.image_url)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-display text-5xl text-brand-gray-dark">
              KB
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {!soldOut && (
            <span className="bg-brand-accent-red px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest text-brand-white uppercase">
              Limited
            </span>
          )}
        </div>
        {soldOut && (
          <span className="absolute top-2 left-2 bg-brand-black px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest text-brand-accent-red uppercase line-through decoration-brand-accent-red">
            Sold out
          </span>
        )}
      </div>

      {/* Info */}
      <div className="border-t-2 border-brand-gray-dark p-3">
        {product.categ_id && (
          <p className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
            {product.categ_id[1]}
          </p>
        )}
        <h3 className="mt-1 truncate font-display text-lg tracking-wide text-brand-white uppercase group-hover:text-brand-accent-red">
          {product.name}
        </h3>
        <p className="mt-1 font-mono text-sm font-bold text-brand-mpesa-green">
          {formatKES(product.list_price)}
        </p>
      </div>
    </Link>
  );
}

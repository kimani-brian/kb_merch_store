import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductGrid from "@/components/catalog/ProductGrid";
import { getCategories, getProducts } from "@/services/catalogService";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

const HERO_STATS = [
  { label: "Pieces per drop", value: "050" },
  { label: "Restocks", value: "000" },
  { label: "Ship window", value: "48H" },
];

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ limit: 8 }),
  ]);

  const shopCategories = categories
    .filter((c) => c.products_count > 0 && c.name !== "All" && c.name !== "Expenses")
    .slice(0, 4);

  return (
    <div>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative border-b-2 border-brand-gray-dark">
        <div className="mx-auto flex max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 md:min-h-[70vh] lg:px-8">
          <p className="font-mono text-xs tracking-[0.35em] text-brand-accent-red uppercase">
            /// Limited edition
          </p>
          <h1 className="mt-4 font-display text-6xl leading-[0.9] tracking-wide text-brand-white uppercase sm:text-8xl lg:text-9xl">
            Drop 01
            <br />
            <span className="text-neutral-600">No restocks.</span>
          </h1>
          <p className="mt-6 max-w-md font-mono text-sm leading-relaxed text-neutral-400">
            Fifty pieces. Numbered. Gone by Friday. Built for the streets of
            Nairobi and shipped worldwide.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 border-2 border-brand-white bg-brand-white px-8 py-4 text-sm font-bold tracking-[0.2em] text-brand-black uppercase transition-colors hover:bg-brand-black hover:text-brand-white"
            >
              Shop the drop <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="font-mono text-xs tracking-widest text-neutral-500 uppercase">
              Pay via M-Pesa // instant confirmation
            </span>
          </div>

          {/* Stat strip */}
          <div className="mt-16 grid max-w-lg grid-cols-3 border-2 border-brand-gray-dark">
            {HERO_STATS.map((stat) => (
              <div
                key={stat.label}
                className="border-r-2 border-brand-gray-dark p-4 last:border-r-0"
              >
                <p className="font-display text-3xl text-brand-accent-red">
                  {stat.value}
                </p>
                <p className="mt-1 font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORY GRID ────────────────────────────────────── */}
      <section className="border-b-2 border-brand-gray-dark">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="font-display text-4xl tracking-widest text-brand-white uppercase">
              The lineup
            </h2>
            <Link
              href="/shop"
              className="font-mono text-xs tracking-widest text-neutral-500 uppercase hover:text-brand-accent-red"
            >
              View all ///
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {shopCategories.map((category, index) => (
              <Link
                key={category.id}
                href={`/${slugify(category.name)}`}
                className={`group relative flex aspect-[4/5] flex-col justify-end overflow-hidden border-2 p-5 transition-colors ${
                  index === 0
                    ? "border-brand-accent-red hover:border-brand-white"
                    : "border-brand-gray-dark hover:border-brand-white"
                }`}
              >
                <span className="absolute top-4 right-4 font-display text-6xl text-brand-gray-dark transition-colors group-hover:text-brand-accent-red">
                  0{index + 1}
                </span>
                <h3 className="font-display text-2xl tracking-widest text-brand-white uppercase">
                  {category.name}
                </h3>
                <p className="mt-1 font-mono text-[11px] tracking-widest text-neutral-500 uppercase">
                  {category.products_count} piece
                  {category.products_count === 1 ? "" : "s"}
                </p>
              </Link>
            ))}
            {shopCategories.length === 0 && (
              <p className="col-span-full py-12 text-center font-mono text-xs text-neutral-600 uppercase">
                Catalog sync pending — waiting on Odoo.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ─── TRENDING GRID ────────────────────────────────────── */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="font-display text-4xl tracking-widest text-brand-white uppercase">
              Trending<span className="text-brand-accent-red">.</span>
            </h2>
            <span className="font-mono text-[10px] tracking-widest text-neutral-600 uppercase">
              Live from Odoo stock
            </span>
          </div>
          <ProductGrid products={products} />
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryView from "@/components/catalog/CategoryView";
import { getCategories, getProducts } from "@/services/catalogService";
import { resolveRoute } from "@/services/routeService";
import { slugify } from "@/lib/utils";

interface CatchAllProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: CatchAllProps): Promise<Metadata> {
  const { slug } = await params;
  const route = await resolveRoute(slug);
  if (!route) return {};
  return {
    title: route.seo_title || route.name,
    description: route.seo_description || undefined,
  };
}

export default async function CatchAllPage({ params }: CatchAllProps) {
  const { slug } = await params;
  const route = await resolveRoute(slug);
  if (!route) notFound();

  // Resolve which Odoo categories this route targets (slug == category name).
  const allCategories = await getCategories();
  const target = slugify(route.slug.split("/").pop() ?? "");
  const categories =
    route.page_type === "category"
      ? allCategories.filter((c) => c.products_count > 0 && slugify(c.name) === target)
      : [];

  const products =
    categories.length > 0
      ? (
          await Promise.all(
            categories.map((c) => getProducts({ categoryId: c.id })),
          )
        ).flat()
      : await getProducts({ limit: 50 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="font-mono text-xs tracking-[0.35em] text-brand-accent-red uppercase">
          /// KB-MERCH drop catalog
        </p>
        <h1 className="mt-2 font-display text-5xl tracking-widest text-brand-white uppercase sm:text-6xl">
          {route.name}
        </h1>
        {route.seo_description && (
          <p className="mt-3 max-w-xl font-mono text-xs leading-relaxed text-neutral-500">
            {route.seo_description}
          </p>
        )}
      </header>
      <CategoryView products={products} />
    </div>
  );
}

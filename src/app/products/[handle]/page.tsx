import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Accordion from "@/components/product/Accordion";
import AddToCartCTA from "@/components/product/AddToCartCTA";
import ImageGallery from "@/components/product/ImageGallery";
import PurchaseBlock from "@/components/product/PurchaseBlock";
import { getProduct } from "@/services/catalogService";
import { formatKES } from "@/lib/utils";

interface PdpProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: PdpProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description_sale || undefined,
  };
}

export default async function ProductDetailPage({ params }: PdpProps) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const soldOut = product.qty_available <= 0;

  // Odoo serves one primary image per template today; the gallery supports
  // N sources for when variant/extra images are wired up.
  const images = [product.image_url];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-neutral-500 uppercase">
          <li>
            <Link href="/" className="hover:text-brand-white">Home</Link>
          </li>
          <li aria-hidden>/</li>
          {product.categ_id && (
            <>
              <li>
                <Link
                  href={`/${product.categ_id[1].toLowerCase()}`}
                  className="hover:text-brand-white"
                >
                  {product.categ_id[1]}
                </Link>
              </li>
              <li aria-hidden>/</li>
            </>
          )}
          <li className="truncate text-neutral-300">{product.name}</li>
        </ol>
      </nav>

      {/* Split layout */}
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Left — gallery */}
        <ImageGallery images={images} alt={product.name} />

        {/* Right — sticky purchase block */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="font-mono text-xs tracking-[0.35em] text-brand-accent-red uppercase">
            /// Drop 01 // Limited edition
          </p>
          <h1 className="mt-3 font-display text-5xl leading-none tracking-wide text-brand-white uppercase sm:text-6xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-mono text-2xl font-bold text-brand-mpesa-green">
              {formatKES(product.list_price)}
            </span>
            <span className="font-mono text-[11px] tracking-widest text-neutral-600 uppercase">
              Incl. VAT // M-Pesa ready
            </span>
          </div>

          {product.description_sale && (
            <p className="mt-5 max-w-lg font-mono text-xs leading-relaxed text-neutral-400">
              {product.description_sale}
            </p>
          )}

          <PurchaseBlock
            productId={product.id}
            soldOut={soldOut}
            attributes={product.attributes}
            variants={product.variants}
          />

          {/* Stock signal */}
          <p className="mt-6 flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase">
            <span
              className={`inline-block h-2 w-2 ${soldOut ? "bg-brand-accent-red" : "bg-brand-mpesa-green animate-pulse"}`}
              aria-hidden
            />
            <span className={soldOut ? "text-brand-accent-red" : "text-neutral-400"}>
              {soldOut
                ? "Sold out — no restock scheduled"
                : `In stock — ${Math.floor(product.qty_available)} unit${product.qty_available === 1 ? "" : "s"} ready to ship`}
            </span>
          </p>

          {/* Accordions */}
          <div className="mt-10">
            <Accordion
              sections={[
                {
                  title: "Material & Fabric Specs",
                  content:
                    product.description_sale ||
                    "380gsm heavyweight cotton fleece. Reinforced double-stitched seams. Boxy oversized cut. Pre-shrunk and enzyme washed.",
                },
                {
                  title: "Sizing Guide",
                  content:
                    "S — Chest 52cm / Length 68cm\nM — Chest 56cm / Length 70cm\nL — Chest 60cm / Length 72cm\nXL — Chest 64cm / Length 74cm\n2XL — Chest 68cm / Length 76cm\n\nModel wears size L. Cut is oversized — size down for a regular fit.",
                },
                {
                  title: "Dispatch Information",
                  content:
                    "Nairobi same-day dispatch before 14:00 EAT.\nCountrywide delivery in 1–3 business days via courier.\nInternational shipping calculated at checkout.\nPay instantly via M-Pesa STK Push.",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
